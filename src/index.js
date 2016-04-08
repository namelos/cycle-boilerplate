// import React from 'react'
// import ReactDOM from 'react-dom'
//
// import Cycle from '@cycle/core'
// import { makeDOMDriver, p } from '@cycle/dom'
// import { Observable } from 'rx'
//
// function main({ DOM }) {
//   return {
//     DOM: DOM
//       .select('p')
//       .events('click')
//       .map('clicked')
//       .startWith('init')
//       .map(data => p(data))
//   }
// }
//
// Cycle.run(main, {
//   DOM: makeDOMDriver('#app')
// })

import React from 'react'
import ReactDOM from 'react-dom'
import { Observable, Subject } from 'rx'

const vtree = <div>
  <h4>my title</h4>
  <p>my content</p>
</div>

function isChildReactElement(child) {
  return !!child && typeof child === `object` && child._isReactElement
}

let handlers = {}

function augmentVTreeWithHandlers(vtree, index = null) {
  if (typeof vtree === `string` || typeof vtree === `number`)
    return vtree

  let newProps = {}

  if (!vtree.props.selector && !!index)
    newProps.selector = index

  let wasTouched = false

  if (handlers[vtree.props.selector]) {
    for (let evType in handlers[vtree.props.selector]) {
      if (handlers[vtree.props.selector].hasOwnProperty(evType)) {
        let handlerFnName = `on${evType.charAt(0).toUpperCase()}${evType.slice(1)}`
        newProps[handlerFnName] = handlers[vtree.props.selector][evType].send
        wasTouched = true
      }
    }
  }

  let newChildren = vtree.props.children

  if (Array.isArray(vtree.props.children)) {
    newChildren = vtree.props.children.map(augmentVTreeWithHandlers)
    wasTouched = true
  } else if (isChildReactElement(vtree.props.children)) {
    newChildren = augmentVTreeWithHandlers(vtree.props.children)
    wasTouched = true
  }
  return wasTouched ? React.cloneElement(vtree, newProps, newChildren) : vtree
}

function select(selector) {
  return {
    events: function events(evType) {
      handlers[selector] = handlers[selector] || {}
      handlers[selector][evType] = handlers[selector][evType] || new Subject()
      handlers[selector][evType].send = function sendIntoSubject(...args) {
        const props = this
        const event = { currentTarget: { props }, args }
        handlers[selector][evType].onNext(event)
      }
      return handlers[selector][evType]
    }
  }
}

const newVtree = augmentVTreeWithHandlers(vtree)

ReactDOM.render(newVtree,
  document.querySelector('#app'))
