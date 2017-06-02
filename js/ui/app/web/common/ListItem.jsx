import React from 'react';
import {List, ListItem} from 'material-ui/List';
import {Grid, Row, Col} from 'react-flexbox-grid';

import './list-item.scss';

export default ({first, second}) => (
  <ListItem>
    <Row className='list-item'>
      <Col xs={6} className='list-item__first'>{first}</Col>
      <Col xs={6} className='list-item__second'>{second}</Col>
    </Row>
  </ListItem>
)
