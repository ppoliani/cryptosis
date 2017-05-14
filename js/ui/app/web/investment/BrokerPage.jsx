import React, {Component} from 'react';
import {List} from 'immutable';
import {connect} from 'react-redux';
import {compose} from 'folktale/core/lambda';
import {Row, Col} from 'react-flexbox-grid';
import Button from 'material-ui/FlatButton';
import pureComponent from '../mixins/pureComponent';
import AsyncPanel from '../common/AsyncPanel';
import {partial, pipe} from '../../helpers/fn';
import {filterObject} from '../../helpers/utils';
import PageWithPanel from '../common/PageWithPanel';
import createBrokerForm from './form/BrokerForm';
import Table from '../common/Table';
import Container from '../common/Container';
import DialogBoxMixin from '../mixins/DialogBoxMixin';
import {getBrokers, saveBroker, updateBroker, deleteBroker} from '../../data/broker/brokerActions';

const columns = [
  {key: 'name', label: 'Name'},
  {key: 'website', label: 'Website'},
  {key: 'email', label: 'Email'},
  {key: 'telephone', label: 'Telephone'},
  {key: 'notes', label: 'Notes'},
  {key: 'action', label: 'Action'}
];

@DialogBoxMixin
@pureComponent
class BrokerPage extends Component {
  state = {
    isPanelOpen: false,
    limit: 10,
    skip: 0
  }

  componentDidMount() {
    const {skip, limit} = this.state;
    this.props.getBrokers({skip, limit});
  }

  togglePanel = (_, selectedBroker={}) => {
    this.setState({isPanelOpen: !this.state.isPanelOpen, selectedBroker});
  }

  onBrokerSave = broker => {
    const {saveBroker, updateBroker} = this.props;

    if(broker.id) {
      // exclude the action prop which was added above
     pipe(
       updateBroker,
       filterObject(broker, ['action'])
      );
    }
    else {
      saveBroker(broker);
    }

    this.togglePanel();
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

  onBrokerDelete = broker => {
    this.props.deleteBroker(broker);
  }

  onBrokerDeleteClick = (broker, e) => {
    e.stopPropagation();
    this.openDialog(partial(this.onBrokerDelete, broker))
  }

  handleCellClick = (e, _, broker) => {
    this.togglePanel(e, broker);
  }

  getBrokersData() {
    return this.props.brokers.reduce(
      (acc, v, id) => acc.push(
        Object.assign({}, v, {
          id,
          action: (
            <Button label="Delete" primary={true} onClick={partial(this.onBrokerDeleteClick, v)} />
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
          {this.renderDialogBox('Are you sure you want to delete this broker?')}
      </PageWithPanel>
    );
  }
}

const mapStateToProps = state => state.broker.toObject();
const mapDispatchToProps = dispatch => ({
  getBrokers: compose(dispatch, getBrokers),
  saveBroker: compose(dispatch, saveBroker),
  updateBroker: compose(dispatch, updateBroker),
  deleteBroker: compose(dispatch, deleteBroker)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BrokerPage);
