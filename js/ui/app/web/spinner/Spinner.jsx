import React from 'react';
import {Grid, Row, Col} from 'react-flexbox-grid';
import CircularProgress from 'material-ui/CircularProgress';
import './spinner.scss';

export default props =>
  <Row className="c-spinner" around="xs" middle="xs">
    <Col xs>
      <Row center="xs">
        <CircularProgress size={80} thickness={5} />
      </Row>
    </Col>
  </Row>
