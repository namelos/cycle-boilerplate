import { Observable } from 'rx'
const { timer } = Observable

/* --- logic --- */

const main = () => ({
  DOM: timer(0, 1000).map(i => `seconds elapsed ${i}`),
  Log: timer(0, 2000).map(i => 2 * i)
})

/* --- effects --- */
const DOMEffect = text$ =>
  text$.subscribe(text =>
    document.querySelector('#app').textContent = text)

const consoleLogEffect = msg$ =>
  msg$.subscribe(console::console.log)

const effectsFunctions = {
  DOM: DOMEffect,
  Log: consoleLogEffect
}

/* --- binding --- */

const run = (mainFn, effects) => {
  const sink = mainFn()
  Object.keys(effects).map(key =>
    effects[key](sink[key]))
}

/* --- run --- */

run(main, effectsFunctions)