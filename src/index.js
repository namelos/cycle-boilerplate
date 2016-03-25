import { run } from '@cycle/core'
import { makeDOMDriver, hJSX } from '@cycle/dom'
import { makeHTTPDriver } from '@cycle/http'
import isolate from '@cycle/isolate'
import { Observable } from 'rx'
const { of, just, combineLatest } = Observable

const LabeledSlider = ({ DOM, props$ }) => {
  const initialValue$ = props$.map(({ initial }) => initial).first()

  const newValue$ = DOM.select('.slider').events('input').map(e => e.target.value)

  const value$ = initialValue$.concat(newValue$)

  const vtree$ = combineLatest(props$, value$,
    ({ label, unit, min, max }, value) => <div className="label-slider">
      <span className="label">{label} {value}{unit}</span>
      <input type="range" className="slider" min={min} max={max} value={value} />
    </div>)

  return { DOM: vtree$, value$ }
}

const WeightSlider = isolate(LabeledSlider, 'weight')
const HeightSlider = isolate(LabeledSlider, 'height')

const main = ({ DOM }) => {
  const weightProps$ = of({ label: 'Weight', unit: 'kg', min: 40, max: 150, initial: 70 })
  const heightProps$ = of({ label: 'Height', unit: 'cm', min: 140, max: 210, initial: 170 })

  const weightSlider = WeightSlider({ DOM, props$: weightProps$ })
  const heightSlider = HeightSlider({ DOM, props$: heightProps$ })

  const bmi$ = combineLatest(weightSlider.value$, heightSlider.value$, (weight, height) =>
    Math.round(weight / (height * 0.01 * height * 0.01)))

  return {
    DOM: bmi$.combineLatest(weightSlider.DOM, heightSlider.DOM,
      (bmi, weightVTree, heightVTree) => <div>
        { weightVTree }
        { heightVTree }
        bmi { bmi }
      </div>
    )
  }
}

run(main, {
  DOM: makeDOMDriver('#app')
})