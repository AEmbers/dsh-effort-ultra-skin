// dsh-effort-ultra-skin — BROWSER half.
//
// What it does: restyles the reasoning-tier control drawn by
// `@hytime/dsh-thinking-effort` into a blue→violet pill with a starfield and a
// slow sheen sweep. It renders NO UI of its own and registers NO slot — it only
// appends one <style> element, which keeps it out of the way of every other
// extension and makes uninstall a clean no-op.
//
// How the bundle is loaded: package.json declares `dsh.client` + the
// `./client` export; the DSH module loader picks this file into the client
// roster. This bundle needs no official client package, so its factory ignores
// `require` — it uses only DOM APIs. Do not add bare ESM `import` statements
// here: this file is NOT processed by a bundler.
//
// ── Styling contract ──────────────────────────────────────────────────────
// Host theme flips are handled through the host's own `body[data-ds-dark-theme]`
// attribute, because a literal brand gradient cannot be derived from the
// `--dsw-alias-*` table: the alias tokens have no violet, and the violet end is
// the whole point of the design. Every OTHER color in this sheet goes through an
// alias token with a literal fallback, and theme branching is confined to those
// three `--effort-*` custom properties. No third-party `[data-theme]` selector
// is used anywhere.
//
// ── Coupling warning ──────────────────────────────────────────────────────
// This skin targets markup owned by another plugin. The selectors below are the
// `data-seat-*` attributes that plugin sets plus structural positions inside
// them, deliberately NOT its CSS-module class hashes (which are build-generated
// and can change on any release). If upstream changes those attributes this
// skin stops matching and silently does nothing — it must never half-apply.

window.__ModuleLoader__.load({
  id: 'dsh-effort-ultra-skin',
  factory: () => {
    const STYLE_ID = 'dsh-effort-ultra-skin'

    // The seat's own attribute names, mirrored from @hytime/dsh-thinking-effort.
    const SEAT_TRIGGER = '[data-seat-trigger]'
    const SEAT_PANEL = '[data-seat-panel]'
    const SEAT_REASONING = '[data-seat-reasoning]'
    const SEAT_RANGE = '[data-seat-range]'
    const SEAT_INPUT = '[data-seat-input]'

    const CSS = [
      /* ── brand layer: the only place theme branching happens ── */
      ':root{',
      '--effort-a:#4d93f8;--effort-b:#2563eb;--effort-c:#8b5cf6;',
      '--effort-star:rgba(255,255,255,.92);--effort-glow:rgba(139,92,246,.55);',
      '--effort-track-h:24px;',
      '}',
      'body[data-ds-dark-theme]{',
      '--effort-a:#5686fe;--effort-b:#3b6ef0;--effort-c:#a06bff;',
      '}',

      /* ── collapsed chip in the composer ── */
      SEAT_TRIGGER + '{',
      'border-radius:999px!important;height:28px!important;padding:0 10px!important;',
      'border:1px solid color-mix(in srgb,var(--effort-a) 26%,transparent)!important;',
      'background:linear-gradient(120deg,',
      'color-mix(in srgb,var(--effort-a) 13%,transparent) 0%,',
      'color-mix(in srgb,var(--effort-c) 15%,transparent) 100%)!important;',
      'box-shadow:0 1px 2px rgba(0,0,0,.05);',
      'transition:box-shadow 160ms ease,border-color 160ms ease,background 160ms ease;',
      '}',
      SEAT_TRIGGER + ':hover:not(:disabled){',
      'border-color:color-mix(in srgb,var(--effort-a) 46%,transparent)!important;',
      'background:linear-gradient(120deg,',
      'color-mix(in srgb,var(--effort-a) 20%,transparent) 0%,',
      'color-mix(in srgb,var(--effort-c) 24%,transparent) 100%)!important;',
      'box-shadow:0 1px 6px -1px var(--effort-glow);',
      '}',
      SEAT_TRIGGER + ':focus-visible{',
      'outline:2px solid color-mix(in srgb,var(--effort-a) 60%,transparent)!important;',
      'outline-offset:2px!important;',
      '}',
      /* first child = model label, second = effort label */
      SEAT_TRIGGER + '>:first-child{font-weight:500}',
      SEAT_TRIGGER + '>:nth-child(2){',
      'border-left:0!important;margin-left:8px!important;padding-left:8px!important;',
      'padding-top:1px!important;padding-bottom:1px!important;',
      'border-radius:999px;',
      'background:color-mix(in srgb,var(--effort-a) 14%,transparent);',
      'color:color-mix(in srgb,var(--effort-a) 82%,var(--dsw-alias-label-primary,#0f1115))!important;',
      'font-weight:600;font-size:12px;line-height:18px;',
      '}',

      /* ── the open panel ── */
      SEAT_PANEL + '{',
      'border-radius:14px!important;padding:16px 16px 14px!important;gap:12px!important;',
      'border:.5px solid var(--dsw-alias-border-l1,rgba(0,0,0,.1))!important;',
      '}',
      SEAT_PANEL + ' ' + SEAT_REASONING + '>:last-child{',
      'background:linear-gradient(92deg,var(--effort-a),var(--effort-c));',
      '-webkit-background-clip:text;background-clip:text;',
      '-webkit-text-fill-color:transparent;color:transparent;',
      '}',

      /* ── the tier bar: track is child 1, the range input is child 2 ── */
      SEAT_RANGE + '>:first-child{',
      'top:3px!important;left:0!important;right:0!important;',
      'height:var(--effort-track-h)!important;border-radius:999px!important;',
      'background:var(--dsw-alias-border-l2,rgba(127,132,140,.22))!important;',
      'box-shadow:inset 0 1px 2px rgba(0,0,0,.16)!important;',
      'overflow:hidden!important;transition:box-shadow 180ms ease;',
      '}',
      /* fill = the track's first child */
      SEAT_RANGE + '>:first-child>:first-child{',
      'top:0!important;left:0!important;height:100%!important;border-radius:999px!important;',
      'background-color:transparent!important;',
      'background-image:',
      'radial-gradient(circle at 14% 42%,var(--effort-star) 0 .9px,transparent 1.7px),',
      'radial-gradient(circle at 38% 70%,rgba(255,255,255,.72) 0 .8px,transparent 1.6px),',
      'radial-gradient(circle at 62% 30%,rgba(255,255,255,.85) 0 .9px,transparent 1.7px),',
      'radial-gradient(circle at 86% 62%,rgba(255,255,255,.66) 0 .8px,transparent 1.6px),',
      'linear-gradient(92deg,var(--effort-a) 0%,var(--effort-b) 46%,var(--effort-c) 100%)!important;',
      'background-size:86px 100%,112px 100%,134px 100%,158px 100%,100% 100%!important;',
      'background-repeat:repeat-x,repeat-x,repeat-x,repeat-x,no-repeat!important;',
      'box-shadow:0 2px 10px -2px var(--effort-glow)!important;',
      'animation:dshEffortStars 6s linear infinite;',
      'transition:width 260ms cubic-bezier(.22,.61,.36,1);',
      '}',
      /* the sheen: a light band crossing the fill */
      SEAT_RANGE + '>:first-child>:first-child::after{',
      'content:""!important;position:absolute!important;top:0!important;bottom:0!important;',
      'left:-50%!important;width:46%!important;height:100%!important;border-radius:999px!important;',
      'background:linear-gradient(100deg,transparent 0%,rgba(255,255,255,.42) 50%,transparent 100%)!important;',
      'opacity:1!important;',
      'animation:dshEffortSheen 2.6s cubic-bezier(.45,0,.55,1) infinite!important;',
      '}',
      /* second child of the track = the per-tier dot row; the pill replaces it */
      SEAT_RANGE + '>:first-child>:nth-child(2){display:none!important}',
      SEAT_RANGE + '>:last-child{height:30px!important}',
      /* hide the native thumb: the gradient bar is the affordance */
      SEAT_RANGE + '>:last-child::-webkit-slider-thumb{',
      '-webkit-appearance:none!important;appearance:none!important;',
      'width:0!important;height:0!important;border:0!important;',
      'background:transparent!important;box-shadow:none!important;opacity:0!important;',
      '}',
      SEAT_RANGE + '>:last-child::-moz-range-thumb{',
      'width:0!important;height:0!important;border:0!important;',
      'background:transparent!important;opacity:0!important;',
      '}',
      SEAT_RANGE + '>:last-child:focus-visible{outline:none!important}',
      /* keep the focus ring visible on the track instead of the removed thumb */
      SEAT_RANGE + ':focus-within>:first-child{',
      'box-shadow:inset 0 1px 2px rgba(0,0,0,.16),',
      '0 0 0 3px color-mix(in srgb,var(--effort-a) 28%,transparent)!important;',
      '}',
      /* the highest tier reads a touch hotter (attribute set from the range input) */
      SEAT_RANGE + '[data-effort-tier="ultra"]>:first-child>:first-child{',
      'animation-duration:3.4s,2s!important;',
      '}',
      SEAT_RANGE + '[data-effort-tier="ultra"]>:first-child{',
      'box-shadow:inset 0 1px 2px rgba(0,0,0,.16),',
      '0 0 0 1px color-mix(in srgb,var(--effort-c) 22%,transparent)!important;',
      '}',

      /* ── the tier label row under the bar ── */
      SEAT_PANEL + ' [class*="scale"]{margin-top:2px!important;gap:6px!important}',
      SEAT_PANEL + ' [class*="scale"]>*{',
      'color:var(--dsw-alias-label-tertiary,#81858c)!important;',
      'font-size:12px;line-height:16px;transition:color 140ms ease;',
      '}',
      SEAT_PANEL + ' [class*="scale"]>[data-seat-active]{',
      'color:var(--dsw-alias-label-primary,#0f1115)!important;font-weight:600;',
      '}',

      /* ── follow-the-model-default row ── */
      SEAT_PANEL + ' [data-seat-default]{border-radius:8px!important}',
      SEAT_PANEL + ' [data-seat-default][aria-pressed="true"]{',
      'background:color-mix(in srgb,var(--effort-a) 10%,transparent)!important;',
      '}',

      '@keyframes dshEffortSheen{',
      '0%{left:-50%;opacity:0}12%{opacity:1}70%{opacity:1}100%{left:104%;opacity:0}',
      '}',
      '@keyframes dshEffortStars{',
      '0%{background-position:0 0,0 0,0 0,0 0,0 0}',
      '100%{background-position:86px 0,-112px 0,134px 0,-158px 0,0 0}',
      '}',

      /* motion is decoration here, so honour the OS preference */
      '@media (prefers-reduced-motion:reduce){',
      SEAT_RANGE + '>:first-child>:first-child,',
      SEAT_RANGE + '>:first-child>:first-child::after{animation:none!important}',
      SEAT_RANGE + '>:first-child>:first-child::after{opacity:0!important}',
      '}',
    ].join('')

    // Highest tier is detected from the input's own min/max instead of parsing
    // the localised tier label, so it works in every UI language. `max` is the
    // tier count minus one, so `value === max` means "top tier".
    const markTiers = () => {
      const inputs = document.querySelectorAll(SEAT_INPUT)
      for (const input of inputs) {
        const seat = input.closest(SEAT_RANGE)
        if (seat === null) continue
        const max = Number(input.max)
        const value = Number(input.value)
        if (!Number.isFinite(max) || max <= 0) continue
        const tier = value >= max ? 'ultra' : value <= 0 ? 'low' : 'mid'
        if (seat.getAttribute('data-effort-tier') !== tier) {
          seat.setAttribute('data-effort-tier', tier)
        }
      }
    }

    return {
      apply(ctx) {
        ctx.effect(() => {
          const style = document.createElement('style')
          style.id = STYLE_ID
          style.setAttribute('data-dsh-plugin', 'effort-ultra-skin')
          style.textContent = CSS
          document.head.appendChild(style)
          return () => {
            if (style.parentNode !== null) style.parentNode.removeChild(style)
            for (const seat of document.querySelectorAll('[data-effort-tier]')) {
              seat.removeAttribute('data-effort-tier')
            }
          }
        }, 'effort-ultra-skin: stylesheet')

        ctx.effect(() => {
          markTiers()
          const observer = new MutationObserver(() => {
            markTiers()
          })
          // The control is re-rendered on session and model changes, and the
          // range input's value/aria attributes are how a tier switch shows up.
          observer.observe(document.body, {
            subtree: true,
            childList: true,
            attributes: true,
            attributeFilter: ['value', 'aria-valuetext', 'aria-valuenow'],
          })
          return () => observer.disconnect()
        }, 'effort-ultra-skin: tier observer')
      },
    }
  },
})
