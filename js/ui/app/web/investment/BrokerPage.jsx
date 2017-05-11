import React, {Component} from 'react';
import {connect} from 'react-redux';
import {compose} from 'folktale/core/lambda';
import {autobind} from 'core-decorators';
import {Row, Col} from 'react-flexbox-grid';
import Button from 'material-ui/FlatButton';
import pureComponent from '../mixins/pureComponent';
import AsyncPanel from '../common/AsyncPanel';
import PageWithPanel from '../common/PageWithPanel';
import BrokerForm from './form/BrokerForm';
import {getBrokers, saveBroker} from '../../data/broker/brokerActions';


@pureComponent
class BrokerPage extends Component {
  constructor(props, state) {
    super(props, state);

    this.state = {
      isPanelOpen: false
    };
  }

  componentDidMount() {
    const {skip, limit} = this.state;
    this.props.getBrokers({skip, limit});
  }

  @autobind
  togglePanel() {
    this.setState({isPanelOpen: !this.state.isPanelOpen});
  }

  @autobind
  onBrokerSave(broker) {
    this.props.saveBroker(broker);
  }

  getPanelContent() {
    return (
      <AsyncPanel asyncResult={this.props.saveBrokerResult}>
        <Col xs={12}>
          <h1>New Broker</h1>
          <Col>
            <BrokerForm onSubmit={this.onBrokerSave} />
          </Col>
        </Col>
      </AsyncPanel>
    );
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

const mapStateToProps = state => state.broker.toObject();
const mapDispatchToProps = dispatch => ({
  getBrokers: compose(dispatch, getBrokers),
  saveBroker: compose(dispatch, saveBroker)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BrokerPage);
