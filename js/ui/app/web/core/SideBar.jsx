import React, {Component} from 'react';
import Drawer from 'material-ui/Drawer';
import InboxIcon from 'material-ui-icons/Inbox';
import StarIcon from 'material-ui-icons/Star';
import {Link} from 'react-router-dom';
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
          <Link to="/">
            <ListItemText primary="Dashboard" onClick={partial(onSidebarClick, 'dashboard')} />
          </Link>
        </ListItem>
        <ListItem button>
          <ListItemIcon>
            <StarIcon />
          </ListItemIcon>
          <Link to="/investments">
            <ListItemText primary="Investments" onClick={partial(onSidebarClick, 'investments')} />
          </Link>
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
