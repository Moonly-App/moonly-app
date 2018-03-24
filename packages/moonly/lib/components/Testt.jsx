import React from 'react'
import { render } from 'react-dom'
import { Components, registerComponent, withCurrentUser } from 'meteor/vulcan:core';


import List from './List'
import Item from './Item'

const TestScroll = () => (
  <div className="hejjj">
    <List options={{ distance: '50px', origin: 'right' }} interval={500}>
      <Item content="foo" />
      <Item content="bar" />
      <Item content="jam" />
    </List>
  </div>
)

registerComponent('TestScroll', TestScroll);
