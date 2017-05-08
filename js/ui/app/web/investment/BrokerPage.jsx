import React, {Component} from 'react';
import {connect} from 'react-redux';
import classnames from 'classnames';
import {compose} from 'folktale/core/lambda';
import {autobind} from 'core-decorators';
import {Grid, Row, Col} from 'react-flexbox-grid';
import Button from 'material-ui/FlatButton';
import Spinner from '../common/Spinner';
import PageWithPanel from '../common/PageWithPanel';
import BrokerForm from './form/BrokerForm';
import {saveBroker} from '../../data/broker/brokerActions';

const onSubmit = async (values) => {
  await Promise.resolve();
  console.log(values);
}

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

  renderActionStatus() {
    const {saveBrokerResult} = this.props;

    return saveBrokerResult.matchWith({
      Empty: () => null,
      Loading: () => <Spinner />,
      Success: ({data: broker}) => console.log('Success', broker),
      Failure: ({error}) => console.log('Failure', error)
    });
  }

  shouldFadeOut() {
    const {saveBrokerResult} = this.props;

    return saveBrokerResult.matchWith({
      Empty: () => false,
      Loading: () => true,
      Success: () => false,
      Failure: () => false
    });
  }

  getPanelContent() {
    const classList = {'fade-out': this.shouldFadeOut()};

    return (
      <Col xs={12}>
        <h1>New Broker</h1>
        <Col className={classnames(classList)}>
          <BrokerForm onSubmit={this.onBrokerSave} />
        </Col>
        {this.renderActionStatus()}
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

const mapStateToProps = state => state.broker.toObject();
const mapDispatchToProps = dispatch => ({
  saveBroker: compose(dispatch, saveBroker)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BrokerPage);
