import React, {Component} from 'react';
import {autobind} from 'core-decorators';
import Paper from 'material-ui/Paper';
import {Grid, Col, Row} from 'react-flexbox-grid';
import Header from './Header';
import SideBar from './SideBar';

export default NestedComponent => class LayoutComponent extends Component {
  constructor(props, state) {
    super(props, state);

    this.state = {
      isSiderBarOpen: false
    };
  }

  @autobind
  onSidebarExit(link, e) {
    // e.preventDefault();
    console.log(link);
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
            <Grid>
              <Row>
                <Col xs>
                  <NestedComponent />
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
