import React from 'react'
import withScrollReveal from '../src/index'
import { isElement } from 'react-dom/test-utils'
import ShallowRenderer from 'react-test-renderer/shallow'
const renderer = new ShallowRenderer();

const MyComponent = () => {
  return (
    <div>
      <p>Lorem ipsum dolor sit amet.</p>
      <p>Lorem ipsum dolor sit amet.</p>
      <p>Lorem ipsum dolor sit amet.</p>
    </div>
  )
};

describe('HOC', function () {
  it('should take object or array of objects of defined shape as parameter', function () {
    expect(withScrollReveal({ selector: '.item', options: { reset: true }, interval: 300 })).not.toThrow();
    expect(withScrollReveal([
      { selector: '.item', options: { reset: true }, interval: 300 },
      { selector: '.item', options: { reset: true } },
    ])).not.toThrow();
  });

  it('should return wrapped React component with additional props', function () {
    const WrappedComponent = withScrollReveal({
      selector: '.item',
      options: { reset: true },
      interval: 300
    })(MyComponent);
    const component = renderer.render(<WrappedComponent/>);
    const result = renderer.getRenderOutput();

    expect(isElement(component)).toBe(true);
    expect(component).toMatchSnapshot();
    expect(typeof result.props.animationContainerReference).toBe('function');
    expect(typeof result.props.destroyRevealAnimation).toBe('function');
    expect(typeof result.props.refreshRevealAnimation).toBe('function');
  });
});
