import React, {Component} from 'react';
import {autobind} from 'core-decorators';
import Header from './Header';
import SideBar from './SideBar';

export default NestedComponent => class Layout extends Component {
  constructor(props, state) {
    super(props, state);

    this.state = {
      isSiderBarOpen: false
    };
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
          <SideBar
            toggleSidebar={this.toggleSidebar}
            isOpen={isSiderBarOpen}
          />
          <NestedComponent />
      </div>
    );
  }
}
