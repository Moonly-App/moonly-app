# REACT-SCROLLREVEAL
React high order component that provides [scrollreveal](https://github.com/jlmakes/scrollreveal) functionality

## Usage
- Install `npm i --save react-scrollreveal`
- Wrap component with HOC
```javascript
import React from 'react'
import withScrollReveal from 'react-scrollreveal'

class MyComponent extends React.Component {
  render() {
    const { animationContainerReference } = this.props;
    
    return (
      <div ref={animationContainerReference}>
        ...
      </div>
    )
  }
}

export default withScrollReveal([
  {
    selector: '.sr-item',
    options: {
      reset: true,
    },
  },
  {
    selector: '.sr-item--sequence',
    options: {
      reset: true,
      delay: 400,
    },
    interval: 100
  }
])(MyComponent) 
```
- ???
- PROFIT

## Reference
withScrollReveal HOC arguments.  
You have to provide object or array of objects with shape that described bellow:

{  
  selector {string} - css selector to get DOM nodes that init scrollreveal on   
  options {object} - [scrollreveal configuration](https://github.com/jlmakes/scrollreveal#2-configuration)  
  interval {number} - interval in milliseconds to create [animation sequence](https://github.com/jlmakes/scrollreveal#3-advanced) for selected elements  
}

  
Wrapped component props:
- animationContainerReference {function} - you have to set reference of your animated elements' container
- destroyRevealAnimation {function} - remove all styles, event listeners
- refreshRevealAnimation {function} - reset all styles for all sr elements
