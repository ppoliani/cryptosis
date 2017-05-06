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
  onSidebarClick(link, e) {
    e.preventDefault();
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
          <SideBar
            toggleSidebar={this.toggleSidebar}
            isOpen={isSiderBarOpen}
            onSidebarClick={this.onSidebarClick}
          />
          <NestedComponent />
      </div>
    );
  }
}
