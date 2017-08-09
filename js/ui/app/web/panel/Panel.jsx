import React, {Component} from 'react'
import AppBar from 'material-ui/AppBar'
import Button from 'material-ui/FlatButton'
import Drawer from 'material-ui/Drawer'
import {Grid, Row} from 'react-flexbox-grid'
import './panel.scss'

export default class Panel extends Component {
  render() {
    const {isOpen, togglePanel, onPanelExit, children} = this.props;

    return (
      <Row>
        <Drawer
          open={isOpen}
          openSecondary={true}
          width={450}>
            <Button label="Close" onClick={togglePanel}/>
            {children}
        </Drawer>
      </Row>
    );
  }
}
