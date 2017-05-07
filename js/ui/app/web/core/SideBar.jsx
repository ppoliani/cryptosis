import React, {Component} from 'react';
import Drawer from 'material-ui/Drawer';
import SendIcon from 'material-ui-icons/Send';
import Divider from 'material-ui/Divider';
import {Link} from 'react-router-dom';
import {
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from 'material-ui/List';
import './sidebar.scss';
import {partial} from '../../helpers/fn';

const getInvestementItems = onSidebarClick => (
  <div>
    <ListItem button>
      <ListItemIcon>
        <SendIcon />
      </ListItemIcon>
      <Link to="/investments">
        <ListItemText primary="Investments" onClick={partial(onSidebarClick, 'investments')} />
      </Link>
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <SendIcon />
      </ListItemIcon>
      <Link to="/brokers">
        <ListItemText primary="Brokers" onClick={partial(onSidebarClick, 'brokers')} />
      </Link>
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <SendIcon />
      </ListItemIcon>
      <Link to="/investment-types">
        <ListItemText primary="Investment Types" onClick={partial(onSidebarClick, 'investementTypes')} />
      </Link>
    </ListItem>
  </div>
);

const getListItems = onSidebarClick => (
  <div>
    <ListItem button>
      <ListItemIcon>
        <SendIcon />
      </ListItemIcon>
      <Link to="/">
        <ListItemText primary="Dashboard" onClick={partial(onSidebarClick, 'dashboard')} />
      </Link>
    </ListItem>
    <Divider />
    {getInvestementItems(onSidebarClick)}
  </div>
);

export default class SideBar extends Component {
  render() {
    const {isOpen, toggleSidebar, onSidebarClick} = this.props;
    return (
      <Drawer
        open={isOpen}
        onRequestClose={toggleSidebar}>
          <div className='sidebar'>
            {getListItems(onSidebarClick)}
          </div>
      </Drawer>
    );
  }
}
