import React, { Component } from 'react'
import { findDOMNode } from 'react-dom'


export const WithScrollReveal = Original =>
  class extends Component {
    constructor(props) {
      super(props)
      this.target = []
    }
    componentDidMount() {
      import ScrollReveal from 'scrollreveal'
      console.log(this)
      ScrollReveal().reveal(
        this.target,
        this.props.options,
        this.props.interval

      )
    }
    componentWillUnmount() {
      ScrollReveal().clean(this.childNodes)
    }
    render() {
      const children = React.Children.map(this.props.children, child =>
        React.cloneElement(child, {
          ref: c => this.target.push(findDOMNode(c))
        })
      )
      return <Original {...this.props}>{children}</Original>
    }
  }

export default WithScrollReveal
