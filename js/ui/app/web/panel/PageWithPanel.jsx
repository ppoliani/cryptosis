import React, {Component} from 'react'
import Drawer from 'material-ui/Drawer'
import {Grid, Row, Col} from 'react-flexbox-grid'
import Panel from './Panel'

export default class PageWithPanel extends Component {
  render() {
    const {children, togglePanel, PanelContent, isPanelOpen} = this.props;

    return (
        <Row>
          <Col xs>
            {children}
          </Col>
          <Panel
            isOpen={isPanelOpen}
            togglePanel={togglePanel}>
              {PanelContent}
          </Panel>
        </Row>
    );
  }
}
