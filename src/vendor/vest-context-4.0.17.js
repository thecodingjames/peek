
/**
 * Bundled by jsDelivr using Rollup v2.79.2 and Terser v5.39.0.
 * Original file: /npm/context@4.0.17/dist/context.mjs
 *
 * Do NOT use SRI with dynamically generated files! More information: https://www.jsdelivr.com/using-sri-with-dynamic-files
 */
import{invariant as n,defaultTo as t,dynamicValue as u,assign as e}from"./vest-utils-2.0.17.js";const r=Symbol();function o(u){let e=r;return{run:function(n,t){const u=c()?o():r;e=n;const i=t();return e=u,i},use:o,useX:function(u){return n(c(),t(u,"Not inside of a running context.")),e}};function o(){return c()?e:u}function c(){return e!==r}}function c(n){const t=o();return{bind:function(n,t){return function(...u){return r(n,(function(){return t(...u)}))}},run:r,use:t.use,useX:t.useX};function r(r,o){const c=t.use(),i=u(n,r,c)??r,s=e({},c||{},i);return t.run(Object.freeze(s),o)}}export{c as createCascade,o as createContext};export default null;
