import React, {Component} from 'react'
import {connect} from 'react-redux'
import Drawer from 'material-ui/Drawer'
import AccountBalanceIcon from 'material-ui-icons/AccountBalance'
import AndroidIcon from 'material-ui-icons/Android'
import HomeIcon from 'material-ui-icons/Home'
import PolymerIcon from 'material-ui-icons/Polymer'
import Divider from 'material-ui/Divider'
import {Link} from 'react-router-dom'
import {
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from 'material-ui/List'
import './sidebar.scss'
import {partial} from '../../../../common/core/fn'

const getInvestementItems = (onSidebarExit, userProfile) =>
  userProfile.get('info')
    .matchWith({
      Just: ({value: user}) => {
        return user.get('roles') === 'admin'
          ? <div>
              <Link to="/brokers">
                <ListItem leftIcon={<AndroidIcon />} primaryText="Brokers"  onClick={partial(onSidebarExit, 'brokers')}/>
              </Link>
              <Link to="/investment-types">
                <ListItem leftIcon={<PolymerIcon />} primaryText="Investment Types" onClick={partial(onSidebarExit, 'investementTypes')} />
              </Link>
            </div>
          : null
      },
      Nothing: () => null
    })

const getListItems = (onSidebarExit, userProfile) => (
  <div>
    <Link to="/">
      <ListItem leftIcon={<HomeIcon />} primaryText="Dashboard" onClick={partial(onSidebarExit, 'dashboard')} />
    </Link>
    <Link to="/investments">
      <ListItem leftIcon={<AccountBalanceIcon />} primaryText="Investments" onClick={partial(onSidebarExit, 'investments')} />
    </Link>
    <Divider />
    {getInvestementItems(onSidebarExit, userProfile)}
  </div>
);

class SideBar extends Component {
  render() {
    const {isOpen, toggleSidebar, onSidebarExit, userProfile} = this.props;
    return (
      <Drawer
        open={isOpen}
        onRequestClose={toggleSidebar}>
          <div className='sidebar'>
            {getListItems(onSidebarExit, userProfile)}
          </div>
      </Drawer>
    );
  }
}

const mapStateToProps = state => ({
  userProfile: state.userProfile
})

export default connect(
  mapStateToProps,
  () => ({})
)(SideBar)
