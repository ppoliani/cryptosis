import React, {Component} from 'react';
import {autobind} from 'core-decorators';
import Paper from 'material-ui/Paper';
import {Grid, Col, Row} from 'react-flexbox-grid';
import Header from './Header';
import SideBar from './SideBar';
import './layout.scss';

export default (NestedComponent, props={}) => class LayoutComponent extends Component {
  constructor(props, state) {
    super(props, state);

    this.state = {
      isSiderBarOpen: false
    };
  }

  @autobind
  onSidebarExit(link, e) {
    // e.preventDefault();
    //redirect to given link using react router
  }

  @autobind
  toggleSidebar() {
    this.setState({isSiderBarOpen: !this.state.isSiderBarOpen});
  }

  render() {
    const {isSiderBarOpen} = this.state;

    return (
      <div>
        <Header toggleSidebar={this.toggleSidebar}/>
        <div className="main-content">
          <Paper className='main-content__page'>
            <Grid fluid>
              <Row middle="xs">
                <Col xs>
                  <NestedComponent {...props}/>
                </Col>
              </Row>
            </Grid>
          </Paper>
        </div>
        <SideBar
          toggleSidebar={this.toggleSidebar}
          isOpen={isSiderBarOpen}
          onSidebarExit={this.onSidebarExit} />
      </div>
    );
  }
}
