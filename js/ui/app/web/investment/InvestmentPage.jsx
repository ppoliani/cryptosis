import React, {Component} from 'react';
import Layout from 'material-ui/Layout';
import Button from 'material-ui/Button';
import {autobind} from 'core-decorators';
import AddInvestment from './form/AddInvestmentForm';
import PageWithPanel from '../common/PageWithPanel';

const onSubmit = async (values) => {
  await Promise.resolve();
  console.log(values);
}

export default class InvestmentPage extends Component {
  constructor(props, state) {
    super(props, state);

    this.state = {
      isPanelOpen: false
    };
  }

  @autobind
  togglePanel() {
    this.setState({isPanelOpen: !this.state.isPanelOpen});
  }

  getPanelContent() {
    return (
      <Layout item xs={12}>
        <h1>New Investment</h1>
        <AddInvestment onSubmit={onSubmit}/>
      </Layout>
    )
  }

  render() {
    return (
      <PageWithPanel
        PanelContent={this.getPanelContent()}
        togglePanel={this.togglePanel}
        isPanelOpen={this.state.isPanelOpen}>
          <Layout item xs={12}>
            <Layout container justify="flex-end">
              <Button type="submit" raised className="right" onClick={this.togglePanel}>New</Button>
            </Layout>
          </Layout>
          <Layout item xs={12}>
            Here will be the table with all investements
          </Layout>
      </PageWithPanel>
    );
  }
}
