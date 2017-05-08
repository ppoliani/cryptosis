import React, {Component} from 'react';
import {connect} from 'react-redux';
import classnames from 'classnames';
import {compose} from 'folktale/core/lambda';
import {autobind} from 'core-decorators';
import {Grid, Row, Col} from 'react-flexbox-grid';
import Button from 'material-ui/FlatButton';
import Snackbar from 'material-ui/Snackbar';
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

  renderNotification() {
    const {saveBrokerResult} = this.props;

    return saveBrokerResult.matchWith({
      Empty: () => null,
      Loading: () => null,
      Success: ({data: broker}) => <Snackbar
        open={true}
        message="Broker added successfully!"
        autoHideDuration={4000}
      />,
      Failure: ({error}) => <Snackbar
        open={true}
        message="Error while adding a new broker!"
        autoHideDuration={4000}
      />
    });
  }

  renderActionStatus() {
    const {saveBrokerResult} = this.props;

    return saveBrokerResult.matchWith({
      Empty: () => null,
      Loading: () => <Spinner />,
      Success: ({data: broker}) => null,
      Failure: ({error}) => null
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
          {this.renderNotification()}
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
