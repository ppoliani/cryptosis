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
    <Link to="/investments">
      <ListItem leftIcon={<SendIcon />} primaryText="Investments" onClick={partial(onSidebarExit, 'investments')} />
    </Link>
    <Link to="/brokers">
      <ListItem leftIcon={<SendIcon />} primaryText="Brokers"  onClick={partial(onSidebarExit, 'brokers')}/>
    </Link>
    <Link to="/investment-types">
      <ListItem leftIcon={<SendIcon />} primaryText="Investment Types" onClick={partial(onSidebarExit, 'investementTypes')} />
    </Link>
  </div>
);

const getListItems = onSidebarExit => (
  <div>
    <Link to="/">
      <ListItem leftIcon={<SendIcon />} primaryText="Dashboard" onClick={partial(onSidebarExit, 'dashboard')} />
    </Link>
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
