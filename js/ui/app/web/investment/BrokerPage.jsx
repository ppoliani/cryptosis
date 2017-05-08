import React, {Component} from 'react';
import {connect} from 'react-redux';
import {compose} from 'folktale/core/lambda';
import {autobind} from 'core-decorators';
import {Row, Col} from 'react-flexbox-grid';
import Button from 'material-ui/FlatButton';
import pureComponent from '../mixins/pureComponent';
import NotificationMixin from '../mixins/NotificationMixin';
import AyncPanel from '../common/AsyncPanel'
import PageWithPanel from '../common/PageWithPanel';
import BrokerForm from './form/BrokerForm';
import {saveBroker} from '../../data/broker/brokerActions';


@pureComponent
@NotificationMixin
class BrokerPage extends Component {
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

  @autobind
  onBrokerSave(broker) {
    this.props.saveBroker(broker);
  }

  getPanelContent() {
    const {saveBrokerResult} = this.props;

    return (
      <AyncPanel asyncResult={saveBrokerResult}>
        <Col xs={12}>
          <h1>New Broker</h1>
          <Col>
            <BrokerForm onSubmit={this.onBrokerSave} />
          </Col>
        </Col>
      </AyncPanel>
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
          {
            this.renderNotification(
              this.props.saveBrokerResult,
              'Broker added successfully!',
              'Error while adding a new broker!'
            )
          }
      </PageWithPanel>
    );
  }
}

const mapStateToProps = state => state.broker.toObject();
const mapDispatchToProps = dispatch => ({
  saveBroker: compose(dispatch, saveBroker)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BrokerPage);
