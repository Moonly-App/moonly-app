import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import Button from 'react-bootstrap/lib/Button';
// import DropdownButton from 'react-bootstrap/lib/DropdownButton';
// import MenuItem from 'react-bootstrap/lib/MenuItem';
// import Modal from 'react-bootstrap/lib/Modal';
import { ModalTrigger, Components, replaceComponent, getRawComponent, registerComponent, withList } from "meteor/vulcan:core";
import { Link, withRouter } from 'react-router';
import { Categories } from 'meteor/example-forum';
import classNames from 'classnames';
import Button from 'react-bootstrap/lib/Button';
import DropdownButton from 'react-bootstrap/lib/DropdownButton';
import { LinkContainer } from 'react-router-bootstrap';
import MenuItem from 'react-bootstrap/lib/MenuItem';
import { FormattedMessage } from 'meteor/vulcan:i18n';

// note: cannot use ModalTrigger component because of https://github.com/react-bootstrap/react-bootstrap/issues/1808
class CustomCategoriesList extends getRawComponent('CategoriesList') {

  renderEdit(category) {
    return (
      <ModalTrigger title="Edit Category" component={<a className="edit-category-link"><Components.Icon name="edit"/></a>}>
        <Components.CategoriesEditForm category={category}/>
      </ModalTrigger>
    )
  }

  renderCategory(category, index) {
    const categories = this.props.results;
    const classes = classNames("posts-category", {'posts-category-active': this.getCurrentCategoriesArray().includes(category.slug)});

    return (
      <li className="category-menu-item dropdown-item" key={index}>
      {this.getCurrentCategoriesArray().includes(category.slug) ? <Components.Icon name="voted"/> :  null}  
        <Link className={classes} to={this.getCategoryLink(category.slug)}>
          <span className={category.slug}>
          <img className="catImage" src={category.image} /> {category.name}
          </span>
        </Link>
        
        <Components.ShowIf check={Categories.options.mutations.edit.check} document={category}>{this.renderEdit(category)}</Components.ShowIf>
      </li>
    )
  }

  render(category, index) {

    // const category = this.props;
    const categories = this.props.results;
    const currentCategorySlug = this.props.router.location.query && this.props.router.location.query.cat;
    const allCategoriesQuery = _.clone(this.props.router.location.query);
    delete allCategoriesQuery.cat;


    return (
      <div>
        <Components.ShowIf check={Categories.options.mutations.new.check}>
        <div className="categories-new-button category-menu-item dropdown-item">
          <ModalTrigger title={<FormattedMessage id="categories.new"/>} component={<Button bsStyle="primary"><span>+</span></Button>}>
            <Components.CategoriesNewForm/>
          </ModalTrigger>
        </div>
      </Components.ShowIf>
        <div className="category-menu-item category-menu-item-all dropdown-item">
          <LinkContainer className="category-menu-item-title" to={{pathname:"/", query: allCategoriesQuery}}>
            <MenuItem eventKey={0}>
              All Feed
            </MenuItem>
          </LinkContainer>
        </div>

      {
        // categories data are loaded
        !this.props.loading ?
          // there are currently categories
          categories && categories.length > 0 ? _.sortBy(categories, "name").map((category, index) => this.renderCategory(category, index)) : null
        // categories are loading
        : <div className="dropdown-item"><MenuItem><Components.Loading /></MenuItem></div>
      }
      
      </div>
    )
  }
};
CustomCategoriesList.contextTypes = {
  currentUser: PropTypes.object,
  scrollToTop: PropTypes.func,
  toggleFilters: PropTypes.func
}
const categoriesListOptions = {
  collection: Categories,
  queryName: 'categoriesListQuery',
  fragmentName: 'CategoriesList',
  limit: 0,
  pollInterval: 0,
};
CustomCategoriesList.propTypes = {
  category: PropTypes.object,
  index: PropTypes.number,
  currentCategorySlug: PropTypes.string,
  openModal: PropTypes.func
};
registerComponent('CategoriesList', CustomCategoriesList, withRouter, [withList, categoriesListOptions]);
