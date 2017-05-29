import React, {Component} from 'react';
import {List, fromJS, Map} from 'immutable';
import dateformat from 'date-fns/format';
import {partial, pipe} from '../../../../common/core/fn';
import {filterObject} from '../../helpers/utils';
import {connect} from 'react-redux';
import {compose, identity} from 'folktale/core/lambda';
import {Row, Col} from 'react-flexbox-grid';
import Button from 'material-ui/FlatButton';
import pureComponent from '../mixins/pureComponent';
import PageWithPanel from '../common/PageWithPanel';
import AsyncPanel from '../common/AsyncPanel';
import Table from '../common/Table';
import Container from '../common/Container';
import DialogBoxMixin from '../mixins/DialogBoxMixin';
import PanelContent from './PanelContent';
import {getBrokers} from '../../data/broker/brokerActions';
import {startInvestmentCurrentValueStream} from '../../data/stream/investmentValueStream';
import {renderInvestmentValue, getSelectedCurrency, renderPrice} from '../common/InvestmentValueHelpers';
import CurrencySelector from '../common/CurrencySelector';
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
  {key: 'positionType', label: 'Position Type'},
  {key: 'date', label: 'Date'},
  {key: 'quantity', label: 'Quantity'},
  {key: 'price', label: 'Price'},
  {key: 'status', label: 'Status'},
  {key: 'action', label: 'Action'}
];
const DEFAULT_CURRENCY = 'GBP';

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
    const {form, getInvestments, getBrokers, getInvestmentTypes} = this.props;
    const currency = getSelectedCurrency(form);

    getInvestments({skip, limit});
    getBrokers({skip, limit});
    getInvestmentTypes({skip, limit});
    this.subscribe(currency);
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  componentDidUpdate(prevProps) {
    const currency = getSelectedCurrency(this.props.form);

    if(getSelectedCurrency(prevProps.form) !== currency) {
      this.unsubscribe();
      this.subscribe(currency);
    }
  }

  unsubscribe() {
    this.props.stream
      .get('investmentCurrentValueSubscription')
      .matchWith({
        Just: ({value}) => value.unsubscribe(),
        Nothing: identity
      });
  }

  subscribe(currency) {
    this.props.startInvestmentCurrentValueStream(currency);
  }

  togglePanel = (_, selectedInvestment={}) => {
    this.setState({isPanelOpen: !this.state.isPanelOpen, selectedInvestment});
  }

  onInvestmentSave = investment => {
    const {saveInvestment, updateInvestment} = this.props;

    if(investment.id) {
     pipe(
       updateInvestment,
       filterObject(investment, ['action', 'status'])
      );
    }
    else {
      saveInvestment(fromJS(investment));
    }

    this.togglePanel();
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

  // will include the value for each investment
  getExtendedTableData = (investments, investmentValues) =>
    investments.reduce(
      (acc, v, id) => acc.push(
        v.set('id', id)
          .set('date', dateformat(v.get('date'), 'MM/DD/YYYY'))
          .set('status', v.get('positionType') === 'buy' ? renderInvestmentValue(id, investmentValues, v.get('currency')): '')
          .set('action', <Button label="Delete" primary={true} onClick={partial(this.onInvestmentDeleteClick, v)} />)
      ),
      List()
    )
    .toJS();


  getInvestmentsData = investments => this.props.portfolio
      .get('investmentValues')
      .matchWith({
        Just: ({value}) => this.getExtendedTableData(investments, value),
        Nothing: () => this.getExtendedTableData(investments, Map())
      });

  getInvestmentsByAssetLife(assetLife) {
    return this.props.investments
      .get('investments')
      .filter(i => i.get('assetLife') === assetLife);
  }

  renderInvestementsTable = (subtitle, data) => (
    <Container title='Investments' subtitle={subtitle}>
      <AsyncPanel asyncResult={this.props.investments.get('fetchInvestmentsResult')}>
        <Table
          columns={columns}
          data={data}
          handleCellClick={this.handleCellClick}
        />
      </AsyncPanel>
    </Container>
  )

  renderTable(assetLife) {
    return this.props.investments.get('fetchInvestmentsResult')
      .matchWith({
        Empty: () => {},
        Loading: () => {},
        Success: ({value}) =>
           pipe(
              partial(this.renderInvestementsTable, assetLife),
              this.getInvestmentsData,
              this.getInvestmentsByAssetLife(assetLife)
            ),
        Failure: () => {}
      })
  }

  getPanelContent() {
    const {investments, fetchInvestmentTypeResult, fetchBrokersResult, brokers} = this.props;

    return (
      <PanelContent
        saveInvestmentResult={investments.get('saveInvestmentResult')}
        investmentTypes={investments.get('investmentTypes')}
        brokers={brokers}
        selectedInvestment={this.state.selectedInvestment}
        onInvestmentSave={this.onInvestmentSave}
        fetchInvestmentTypeResult={investments.get('fetchInvestmentTypeResult')}
        fetchBrokersResult={fetchBrokersResult}
      />
    )
  }

  render() {
    return (
      <PageWithPanel
        PanelContent={this.getPanelContent()}
        togglePanel={this.togglePanel}
        isPanelOpen={this.state.isPanelOpen}>
          <Row className='row-spacing'>
            <Col xs>
              <CurrencySelector />
              <Button type="submit" className="right" onClick={this.togglePanel}>New</Button>
            </Col>
          </Row>
          <Row className='row-spacing'>
            <Col>
              {this.renderTable('Long Term')}
            </Col>
          </Row>
          <Row>
            <Col xs>
              {this.renderTable('Short Term')}
            </Col>
          </Row>
          {this.renderDialogBox('Are you sure you want to delete this investment?')}
      </PageWithPanel>
    );
  }
}

const mapStateToProps = state => ({
  form: state.form,
  stream: state.stream,
  investments: state.investment,
  brokers: state.broker.get('brokers'),
  portfolio: state.portfolio,
  fetchBrokersResult: state.broker.get('fetchBrokersResult'),
});

const mapDispatchToProps = dispatch => ({
  getInvestments: compose(dispatch, getInvestments),
  saveInvestment: compose(dispatch, saveInvestment),
  updateInvestment: compose(dispatch, updateInvestment),
  deleteInvestment: compose(dispatch, deleteInvestment),
  getBrokers: compose(dispatch, getBrokers),
  getInvestmentTypes: compose(dispatch, getInvestmentTypes),
  startInvestmentCurrentValueStream: compose(dispatch, startInvestmentCurrentValueStream)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(InvestmentPage);

