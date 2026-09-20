// dsh-effort-ultra-skin — HOST half.
//
// This plugin is deliberately almost all browser-side: it is a CSS skin for the
// reasoning-tier control rendered by `@hytime/dsh-thinking-effort`. Making the
// host half inert keeps the blast radius tiny — there is no route, no tool, no
// service, no injected capability, and nothing that touches user data.
//
// The row has to exist because `cordis.patch.yml` registers the host half into a
// profile; the BROWSER half is auto-discovered from `exports["./client"]` +
// `dsh.client` in package.json and needs no row of its own.
//
// Why this is a separate package instead of a patch to the upstream plugin: the
// upstream control lives in a compiled bundle (`lib/client.js`) whose CSS the
// reader cannot extend, and its stylesheet ships a malformed custom property
// (`--dsw-alias-brand-primary-new-colorprimary-new-color`). Overriding from the
// outside keeps upstream free to fix its own CSS without a merge conflict.
/** Plugin display name, shown in loader diagnostics. */
export const name = 'effort-ultra-skin';
/**
 * No host services are needed. An empty inject list means this half applies
 * immediately without waiting on anything, and cannot stall a profile boot.
 */
export const inject = [];
export function apply() {
    console.log('[effort-ultra-skin] host half loaded (inert by design); ' +
        'the browser half applies the skin to the reasoning-tier control.');
}
