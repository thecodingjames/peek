export function wrap(apply) {
  return `
    text-wrap: ${apply ? 'wrap' : 'revert'};
    word-wrap: ${apply ? 'anywhere' : 'revert'};
  `
}

export function background(selector) {
  const currentColor = window.getComputedStyle(document.querySelector('.v-application')).getPropertyValue('--v-theme')
     // --c: color-mix(in srgb, currentColor calc(var(--v-activated-opacity) * 100%), transparent); background-color: var(--c);
  const baseLight = 'rgba(0, 0, 0, 0.87)'
  const baseDark = 'rgb(255, 255, 255)'
  const opacity = window.getComputedStyle(document.querySelector('.v-application')).getPropertyValue('--v-activated-opacity')

  return `
    .v-theme--light ${selector} {
      --base: ${baseLight};
      --bg-mix: ${baseDark};
    }
    @media (prefers-color-scheme: light) {
      ${selector} {
        --base: ${baseLight};
        --bg-mix: ${baseDark};
      }
    }

    .v-theme--dark ${selector} {
      --base: ${baseDark};
      --bg-mix: transparent;
    }
    @media (prefers-color-scheme: dark) {
      ${selector} {
        --base: ${baseDark};
        --bg-mix: ${baseLight};
      }
    }

    ${selector} {
      background-color: color-mix(in srgb, var(--base) calc(${opacity} * 100%), var(--bg-mix));
    }
  `
}
