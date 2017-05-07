import React, {Component} from 'react';
import {autobind} from 'core-decorators';
import {Grid, Row, Col} from 'react-flexbox-grid';
import Button from 'material-ui/FlatButton';
import PageWithPanel from '../common/PageWithPanel';
import BrokerForm from './form/BrokerForm';

const onSubmit = async (values) => {
  await Promise.resolve();
  console.log(values);
}

export default class BrokerPage extends Component {
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
        <h1>New Broker</h1>
        <BrokerForm onSubmit={onSubmit}/>
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
              Here will be the table with all Brokers
            </Col>
          </Row>
      </PageWithPanel>
    );
  }
}
