import React, {Component} from 'react';
import Drawer from 'material-ui/Drawer';
import InboxIcon from 'material-ui-icons/Inbox';
import StarIcon from 'material-ui-icons/Star';
import {
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from 'material-ui/List';
import './sidebar.scss';
import {partial} from '../../helpers/fn';

export default class SideBar extends Component {
  getListItems() {
    const {onSidebarClick} = this.props;

    return (
      <div>
        <ListItem button>
          <ListItemIcon>
            <InboxIcon />
          </ListItemIcon>
          <ListItemText primary="Dashboard" onClick={partial(onSidebarClick, 'dashboard')} />
        </ListItem>
        <ListItem button>
          <ListItemIcon>
            <StarIcon />
          </ListItemIcon>
          <ListItemText primary="Investements" onClick={partial(onSidebarClick, 'investements')} />
        </ListItem>
      </div>
    );
  }

  render() {
    const {isOpen, toggleSidebar} = this.props;
    return (
      <Drawer
        open={isOpen}
        onRequestClose={toggleSidebar}>
          <div className='sidebar'>
            {this.getListItems()}
          </div>
      </Drawer>
    );
  }
}
