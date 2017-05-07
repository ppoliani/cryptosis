import React, {Component} from 'react';
import Drawer from 'material-ui/Drawer';
import Layout from 'material-ui/Layout';
import Panel from './Panel';

const layoutProps = {
  direction: 'column',
  justify: 'center',
  align: 'stretch',
  gutter: 24
};

export default class PageWithPanel extends Component {
  render() {
    const {children, togglePanel, PanelContent, isPanelOpen} = this.props;

    return (
      <Layout container {...layoutProps}>
        <Layout item xs={12}>
          {children}
        </Layout>
        <Layout item xs={12}>
          <Panel
            isOpen={isPanelOpen}
            togglePanel={togglePanel}>
              {PanelContent}
          </Panel>
        </Layout>
      </Layout>
    );
  }
}
