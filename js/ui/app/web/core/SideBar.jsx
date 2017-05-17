import React, {Component} from 'react';
import Drawer from 'material-ui/Drawer';
import AccountBalanceIcon from 'material-ui-icons/AccountBalance';
import AndroidIcon from 'material-ui-icons/Android';
import HomeIcon from 'material-ui-icons/Home';
import PolymerIcon from 'material-ui-icons/Polymer';
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
      <ListItem leftIcon={<AccountBalanceIcon />} primaryText="Investments" onClick={partial(onSidebarExit, 'investments')} />
    </Link>
    <Link to="/brokers">
      <ListItem leftIcon={<AndroidIcon />} primaryText="Brokers"  onClick={partial(onSidebarExit, 'brokers')}/>
    </Link>
    <Link to="/investment-types">
      <ListItem leftIcon={<PolymerIcon />} primaryText="Investment Types" onClick={partial(onSidebarExit, 'investementTypes')} />
    </Link>
  </div>
);

const getListItems = onSidebarExit => (
  <div>
    <Link to="/">
      <ListItem leftIcon={<HomeIcon />} primaryText="Dashboard" onClick={partial(onSidebarExit, 'dashboard')} />
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
