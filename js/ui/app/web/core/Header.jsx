import React, {Component} from 'react';
import Layout from 'material-ui/Layout';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import MenuIcon from 'material-ui-icons/Menu';

export default class Header extends Component {
  render() {
    const {toggleSidebar} = this.props;

    return (
      <AppBar>
        <Toolbar>
          <Layout
            container
            align='center'
            justify='space-between'>
              <IconButton contrast>
                <MenuIcon onClick={toggleSidebar} />
              </IconButton>
              <Typography type="title" colorInherit>Investreck</Typography>
              <Button contrast>Logout</Button>
          </Layout>
        </Toolbar>
      </AppBar>
    );
  }
}
