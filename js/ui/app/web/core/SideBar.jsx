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

const getInvestementItems = onSidebarExit => (
  <div>
    <ListItem button>
      <ListItemIcon>
        <SendIcon />
      </ListItemIcon>
      <Link to="/investments">
        <ListItemText primary="Investments" onClick={partial(onSidebarExit, 'investments')} />
      </Link>
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <SendIcon />
      </ListItemIcon>
      <Link to="/brokers">
        <ListItemText primary="Brokers" onClick={partial(onSidebarExit, 'brokers')} />
      </Link>
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <SendIcon />
      </ListItemIcon>
      <Link to="/investment-types">
        <ListItemText primary="Investment Types" onClick={partial(onSidebarExit, 'investementTypes')} />
      </Link>
    </ListItem>
  </div>
);

const getListItems = onSidebarExit => (
  <div>
    <ListItem button>
      <ListItemIcon>
        <SendIcon />
      </ListItemIcon>
      <Link to="/">
        <ListItemText primary="Dashboard" onClick={partial(onSidebarExit, 'dashboard')} />
      </Link>
    </ListItem>
    <Divider />
    {getInvestementItems(onSidebarExit)}
  </div>
);

export default class SideBar extends Component {
  render() {
    const {isOpen, toggleSidebar, onSidebarExit} = this.props;
    return (
      <Drawer
        open={isOpen}
        onRequestClose={toggleSidebar}>
          <div className='sidebar'>
            {getListItems(onSidebarExit)}
          </div>
      </Drawer>
    );
  }
}
