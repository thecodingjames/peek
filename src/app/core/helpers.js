export function raw(value) {
  return JSON.parse(JSON.stringify(value))
}

export function forceFocus(targetFn = () => {}) {
  Vue.nextTick(() => {
    let watchdog = 1;

    let interval = setInterval(() => {
      const target = targetFn()

      target?.focus()

      if (target == document.activeElement || watchdog > 20) {
        clearInterval(interval)
      }

      watchdog++
    }, 1 * watchdog)
  })
}
