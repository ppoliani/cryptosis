import React, {Component} from 'react';
import {List} from 'immutable';
import {connect} from 'react-redux';
import {compose} from 'folktale/core/lambda';
import {autobind} from 'core-decorators';
import {Row, Col} from 'react-flexbox-grid';
import Button from 'material-ui/FlatButton';
import pureComponent from '../mixins/pureComponent';
import AsyncPanel from '../common/AsyncPanel';
import {partial} from '../../helpers/fn';
import PageWithPanel from '../common/PageWithPanel';
import createBrokerForm from './form/BrokerForm';
import Table from '../common/Table';
import Container from '../common/Container';
import {getBrokers, saveBroker} from '../../data/broker/brokerActions';

const columns = [
  {key: 'name', label: 'Name'},
  {key: 'website', label: 'Website'},
  {key: 'email', label: 'Email'},
  {key: 'telephone', label: 'Telephone'},
  {key: 'notes', label: 'Notes'},
  {key: 'action', label: 'Action'}
];

@pureComponent
class BrokerPage extends Component {
  constructor(props, state) {
    super(props, state);

    this.state = {
      isPanelOpen: false,
      limit: 10,
      skip: 0
    };
  }

  componentDidMount() {
    const {skip, limit} = this.state;
    this.props.getBrokers({skip, limit});
  }

  @autobind
  togglePanel(_, selectedBroker={}) {
    this.setState({isPanelOpen: !this.state.isPanelOpen, selectedBroker});
  }

  @autobind
  onBrokerSave(broker) {
    this.props.saveBroker(broker);
  }

  getPanelContent() {
    const BrokerForm = createBrokerForm(this.state.selectedBroker);

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

  @autobind
  onBrokerDelete(data, e) {
    e.stopPropagation();
    console.log(data);
  }

  @autobind
  handleCellClick(e, _, broker) {
    console.log(broker);
    this.togglePanel(e, broker);
  }

  getBrokersData() {
    return this.props.brokers.reduce(
      (acc, v, id) => acc.push(
        Object.assign(v, {
          id,
          action: (
            <Button label="Delete" primary={true} onClick={partial(this.onBrokerDelete, v)} />
          )
        })
      ),
      List()
    )
    .toArray()
  }

  renderBrokerTable() {
    return (
      <Container title='Brokers' subtitle='Full list of brokers'>
        <AsyncPanel asyncResult={this.props.fetchBrokersResult}>
          <Table
            columns={columns}
            data={this.getBrokersData()}
            handleCellClick={this.handleCellClick}
          />
        </AsyncPanel>
      </Container>
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
              <Button type='submit' className='right' onClick={this.togglePanel}>New</Button>
            </Col>
          </Row>
          <Row>
            <Col xs>
              {this.renderBrokerTable()}
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
