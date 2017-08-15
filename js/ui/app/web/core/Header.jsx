import React, {Component} from 'react'
import {Grid} from 'react-flexbox-grid'
import AppBar from 'material-ui/AppBar'
import Button from 'material-ui/FlatButton'
import IconButton from 'material-ui/IconButton'
import MenuIcon from 'material-ui-icons/Menu'
import {logout} from '../../services/auth'

export default class Header extends Component {
  render() {
    const {toggleSidebar} = this.props;
    return (
      <AppBar
        title="Cryptosis"
        onLeftIconButtonTouchTap={toggleSidebar}
        iconElementRight={<Button onClick={logout}>Logout</Button>} />
    );
  }
}
