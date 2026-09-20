// Smoke-test the BROWSER half without a real browser.
//
// Loads lib/client.js into a stubbed `window.__ModuleLoader__` plus a minimal
// DOM, then drives apply() and asserts the observable effects: the stylesheet
// is appended, the tier attribute is derived from the range input, and the
// disposer cleans both up. Uses only node: APIs, so it runs anywhere.
//
//   node scripts/smoke-client.mjs

import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const here = dirname(fileURLToPath(import.meta.url))
const clientPath = join(here, '..', 'lib', 'client.js')

const checks = []
const check = (label, pass, detail) => {
  checks.push({ label, pass, detail })
  console.log(`${pass ? '  ok  ' : ' FAIL '} ${label}${detail === undefined ? '' : `  — ${detail}`}`)
}

// ── minimal DOM ────────────────────────────────────────────────────────────
class El {
  constructor(tag) {
    this.tagName = tag.toUpperCase()
    this.children = []
    this.parentNode = null
    this.attributes = new Map()
    this.style = { setProperty() {} }
    this.textContent = ''
    this.id = ''
  }
  setAttribute(k, v) { this.attributes.set(k, String(v)) }
  getAttribute(k) { return this.attributes.has(k) ? this.attributes.get(k) : null }
  removeAttribute(k) { this.attributes.delete(k) }
  appendChild(child) { child.parentNode = this; this.children.push(child); return child }
  removeChild(child) {
    const i = this.children.indexOf(child)
    if (i >= 0) this.children.splice(i, 1)
    child.parentNode = null
    return child
  }
  get firstElementChild() { return this.children[0] ?? null }
  get lastElementChild() { return this.children[this.children.length - 1] ?? null }
  closest(selector) {
    let node = this
    while (node !== null) {
      if (node.matchesSelf(selector)) return node
      node = node.parentNode
    }
    return null
  }
  matchesSelf(selector) {
    const m = /^\[([a-z-]+)\]$/.exec(selector)
    if (m === null) return false
    return this.attributes.has(m[1])
  }
}

const head = new El('head')
const body = new El('body')
const document = {
  head,
  body,
  createElement: (tag) => new El(tag),
  getElementById: (id) => findAll(head, (n) => n.id === id)[0] ?? null,
  querySelectorAll: (selector) => findAll(body, (n) => {
    if (selector.startsWith('[')) return n.matchesSelf(selector)
    return false
  }),
}
function findAll(root, pred) {
  const out = []
  const walk = (n) => {
    if (pred(n)) out.push(n)
    for (const c of n.children) walk(c)
  }
  walk(root)
  return out
}

// ── the control under test, mirroring @hytime/dsh-thinking-effort ──────────
const seat = new El('div')
seat.setAttribute('data-seat-range', 'true')
const track = seat.appendChild(new El('div'))
track.appendChild(new El('span'))       // fill
track.appendChild(new El('span'))       // pip row
const input = seat.appendChild(new El('input'))
input.setAttribute('data-seat-input', 'true')
input.max = '3'
input.value = '3'
body.appendChild(seat)

// ── stubbed module loader + observer ──────────────────────────────────────
let observed = null
let disconnected = 0
class MutationObserver {
  constructor(cb) { this.cb = cb; observed = this }
  observe(target, opts) { this.target = target; this.opts = opts }
  disconnect() { disconnected += 1 }
}

let registration = null
const window = {
  __ModuleLoader__: {
    load(spec) { registration = spec },
  },
}

// ── run the bundle ────────────────────────────────────────────────────────
const source = await readFile(clientPath, 'utf8')
const run = new Function('window', 'document', 'MutationObserver', source)
run(window, document, MutationObserver)

check('bundle registers exactly one module', registration !== null)
check('module id matches the loader contract', registration?.id === 'dsh-effort-ultra-skin', registration?.id)
check('factory is a function', typeof registration?.factory === 'function')

const plugin = registration.factory()
// `inject` is optional on a client plugin; this bundle needs no client service,
// so an absent list and an empty list are both correct. Reject only a non-array.
check('plugin inject is absent or a list',
  plugin.inject === undefined || Array.isArray(plugin.inject),
  JSON.stringify(plugin.inject))
check('plugin needs no required client service',
  plugin.inject === undefined || plugin.inject.length === 0,
  JSON.stringify(plugin.inject))
check('plugin exports apply', typeof plugin.apply === 'function')

// ── drive apply() with a fake ctx that tracks disposers ───────────────────
const disposers = []
const ctx = { effect: (fn) => { disposers.push(fn()) } }
plugin.apply(ctx)

check('apply registered exactly two effects', disposers.length === 2, String(disposers.length))

const style = head.children.find((n) => n.id === 'dsh-effort-ultra-skin') ?? null
check('stylesheet appended to head', style !== null)
const css = style === null ? '' : style.textContent
check('stylesheet is non-trivial', css.length > 1500, `${css.length} chars`)
check('css is balanced (no stray brace)', (css.match(/\{/g) || []).length === (css.match(/\}/g) || []).length)
check('css targets the seat attributes', css.includes('[data-seat-range]') && css.includes('[data-seat-trigger]'))
check('css avoids upstream hash class names', !/_[A-Za-z0-9]{5,}_/.test(css))

check('observer installed on body', observed !== null && observed.target === body)
check('observer watches value/aria attributes',
  JSON.stringify(observed?.opts?.attributeFilter) === JSON.stringify(['value', 'aria-valuetext', 'aria-valuenow']),
  JSON.stringify(observed?.opts?.attributeFilter))

check('top tier gets data-effort-tier=ultra', seat.getAttribute('data-effort-tier') === 'ultra', String(seat.getAttribute('data-effort-tier')))

// mid tier via the observer path
input.value = '1'
observed.cb()
check('middle tier re-marked on mutation', seat.getAttribute('data-effort-tier') === 'mid', String(seat.getAttribute('data-effort-tier')))

// lowest tier
input.value = '0'
observed.cb()
check('lowest tier re-marked', seat.getAttribute('data-effort-tier') === 'low', String(seat.getAttribute('data-effort-tier')))

// ── dispose cleanly ───────────────────────────────────────────────────────
for (const d of disposers) if (typeof d === 'function') d()

check('disposer removed the stylesheet', head.children.every((n) => n.id !== 'dsh-effort-ultra-skin'))
check('disposer removed the tier attribute', seat.getAttribute('data-effort-tier') === null)
check('disposer disconnected the observer', disconnected === 1, String(disconnected))

const failed = checks.filter((c) => !c.pass)
console.log(`\n${checks.length - failed.length}/${checks.length} checks passed`)
if (failed.length > 0) {
  console.error(`\nFAILED:\n${failed.map((f) => `  - ${f.label}${f.detail === undefined ? '' : ` (${f.detail})`}`).join('\n')}`)
  process.exit(1)
}
console.log('smoke-client: OK — browser half loads, applies, and cleans up.')
