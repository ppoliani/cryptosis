import React, {Component} from 'react';
import {Grid, Row, Col} from 'react-flexbox-grid';
import Button from 'material-ui/FlatButton';
import {autobind} from 'core-decorators'
import PageWithPanel from '../common/PageWithPanel';
import InvestmentForm from './form/InvestmentForm';

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
      <Col xs={12}>
        <h1>New Investment</h1>
        <InvestmentForm onSubmit={onSubmit}/>
      </Col>
    )
  }

  render() {
    return (
      <PageWithPanel
        PanelContent={this.getPanelContent()}
        togglePanel={this.togglePanel}
        isPanelOpen={this.state.isPanelOpen}>
          <Row>
            <Col xs>
              <Button type="submit" className="right" onClick={this.togglePanel}>New</Button>
            </Col>
          </Row>
          <Row>
            <Col xs>
              Here will be the table with all investements
            </Col>
          </Row>
      </PageWithPanel>
    );
  }
}
