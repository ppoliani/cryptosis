import React, {Component} from 'react';
import Drawer from 'material-ui/Drawer';
import './sidebar.scss';

export default class SideBar extends Component {
  render() {
    const {isOpen, toggleSidebar} = this.props;
    return (
      <Drawer
        open={isOpen}
        onClick={toggleSidebar}>
          <div className='sidebar'>Sidebar</div>
      </Drawer>
    );
  }
}
