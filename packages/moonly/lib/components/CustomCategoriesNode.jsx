import { Components, registerComponent } from 'meteor/vulcan:core';
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

class CustomCategoriesNode extends PureComponent {

  renderCategory(category) {
    return (
      <Components.Category category={category} key={category._id} openModal={this.props.openModal} />
    )
  }



  renderChildren(children) {
    return (
      <div className="categories-children">
        {children.map(category => <CategoriesNode category={category} key={category._id} />)}
      </div>
    )
  }

  render() {

    const category = this.props.category;
    const children = this.props.category.childrenResults;

    return (
      <div className="categories-node">
        {this.renderCategory(category)}
        {children ? this.renderChildren(children) : null}
      </div>
    )
  }

}

CustomCategoriesNode.propTypes = {
  category: PropTypes.object.isRequired, // the current category
};

registerComponent('CategoriesNode', CustomCategoriesNode);
