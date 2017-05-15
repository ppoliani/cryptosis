import React, {Component} from 'react';
import {List} from 'immutable';
import dateformat from 'date-fns/format';
import {partial, pipe} from '../../helpers/fn';
import {filterObject} from '../../helpers/utils';
import {connect} from 'react-redux';
import {compose} from 'folktale/core/lambda';
import {AsyncDataAll, AsyncDataSome} from '../../data/core/AsyncData';
import {Row, Col} from 'react-flexbox-grid';
import Button from 'material-ui/FlatButton';
import pureComponent from '../mixins/pureComponent';
import PageWithPanel from '../common/PageWithPanel';
import AsyncPanel from '../common/AsyncPanel';
import createInvestmentForm from './form/InvestmentForm';
import Table from '../common/Table';
import Container from '../common/Container';
import DialogBoxMixin from '../mixins/DialogBoxMixin';
import {getBrokers} from '../../data/broker/brokerActions';
import {
  getInvestments,
  saveInvestment,
  updateInvestment,
  deleteInvestment,
  getInvestmentTypes
} from '../../data/investment/investmentActions';

const columns = [
  {key: 'investmentType', label: 'Investment Type'},
  {key: 'broker', label: 'Broker'},
  {key: 'date', label: 'Date'},
  {key: 'moneyInvested', label: 'Money Invested'},
  {key: 'expenses', label: 'Expenses'},
  {key: 'quantity', label: 'Quantity'},
  {key: 'price', label: 'Price'},
  {key: 'notes', label: 'Notes'},
  {key: 'action', label: 'Action'}
];

@DialogBoxMixin
@pureComponent
class InvestmentPage extends Component {
  state = {
    isPanelOpen: false,
    limit: 10,
    skip: 0
  }

  componentDidMount() {
    const {skip, limit} = this.state;
    this.props.getInvestments({skip, limit});
    this.props.getBrokers({skip, limit});
    this.props.getInvestmentTypes({skip, limit});
  }

  togglePanel = (_, selectedInvestment={}) => {
    this.setState({isPanelOpen: !this.state.isPanelOpen, selectedInvestment});
  }

  onInvestmentSave = investment => {
    const {saveInvestment, updateInvestment} = this.props;

    if(investment.id) {
     pipe(
       updateInvestment,
       filterObject(investment, ['action'])
      );
    }
    else {
      saveInvestment(investment);
    }

    this.togglePanel();
  }

  getCombinedAsyncResult() {
    return AsyncDataAll([
      this.props.investments.get('fetchInvestmentTypeResult'),
      this.props.fetchBrokersResult
    ]);
  }

  getOptionsFromMap(records) {
    return records.reduce(
      (acc, v, k) => acc.push({
        value: v.get('name'),
        text: v.get('name')
      }),
      List()
    )
    .toJS();
  }

  createDynamicForm() {
    const {brokers, investments} = this.props;

    return this.getCombinedAsyncResult()
      .matchWith({
        Empty: () => null,
        Loading: () => null,
        Success: () => createInvestmentForm(
          this.getOptionsFromMap(investments.get('investmentTypes')),
          this.getOptionsFromMap(brokers),
          this.state.selectedInvestment
        ),
        Failure: ({error}) => console.log('Error building the form', error)
      });
  }

  getPanelContent() {
    const asyncResult = AsyncDataSome([
      this.getCombinedAsyncResult(),
      this.props.investments.get('saveInvestmentResult')
    ]);

    const InvestmentForm = this.createDynamicForm();

    return (
      <AsyncPanel asyncResult={asyncResult}>
        <Col xs={12}>
          <h1>New Investment</h1>
          {InvestmentForm && <InvestmentForm onSubmit={this.onInvestmentSave} />}
        </Col>
      </AsyncPanel>
    );
  }

  onInvestmentDelete = investment => {
    this.props.deleteInvestment(investment);
  }

  onInvestmentDeleteClick = (investment, e) => {
    e.stopPropagation();
    this.openDialog(partial(this.onInvestmentDelete, investment))
  }

  handleCellClick = (e, _, investment) => {
    this.togglePanel(e, investment);
  }

  getInvestmentsData() {
    return this.props.investments.get('investments').reduce(
      (acc, v, id) => acc.push(
        v.set('id', id)
          .set('date', dateformat(v.get('date'), 'MM/DD/YYYY'))
          .set('action', <Button label="Delete" primary={true} onClick={partial(this.onInvestmentDeleteClick, v)} />)
          .toJS()
        ),
      List()
    )
    .toArray();
  }

  renderInvestementsTable() {
    const data = this.getInvestmentsData();
    return (
      <Container title='Investments' subtitle='Full list of all investments'>
        <AsyncPanel asyncResult={this.props.investments.get('fetchInvestmentsResult')}>
          <Table
            columns={columns}
            data={this.getInvestmentsData()}
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
              <Button type="submit" className="right" onClick={this.togglePanel}>New</Button>
            </Col>
          </Row>
          <Row>
            <Col xs>
              {this.renderInvestementsTable()}
            </Col>
          </Row>
          {this.renderDialogBox('Are you sure you want to delete this investment?')}
      </PageWithPanel>
    );
  }
}

const mapStateToProps = state => ({
  investments: state.investment,
  brokers: state.broker.get('brokers'),
  fetchBrokersResult: state.broker.get('fetchBrokersResult'),
});

const mapDispatchToProps = dispatch => ({
  getInvestments: compose(dispatch, getInvestments),
  saveInvestment: compose(dispatch, saveInvestment),
  updateInvestment: compose(dispatch, updateInvestment),
  deleteInvestment: compose(dispatch, deleteInvestment),
  getBrokers: compose(dispatch, getBrokers),
  getInvestmentTypes: compose(dispatch, getInvestmentTypes)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(InvestmentPage);
