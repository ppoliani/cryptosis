import React, {Component} from 'react';
import Drawer from 'material-ui/Drawer';
import Layout from 'material-ui/Layout';
import './panel.scss';

const layoutProps = {
  direction: 'column',
  justify: 'center',
  align: 'center',
  gutter: 24
};

export default class Panel extends Component {
  render() {
    const {isOpen, togglePanel, onPanelExit, children} = this.props;

    return (
      <Layout item xs={12}>
        <Drawer
          open={isOpen}
          anchor="top"
          onRequestClose={togglePanel}>
            <Layout container {...layoutProps}>
              <Layout item xs={12} className='side-panel'>
                {children}
              </Layout>
            </Layout>
        </Drawer>
      </Layout>
    );
  }
}
