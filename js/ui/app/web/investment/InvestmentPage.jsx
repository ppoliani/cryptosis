import React, {Component} from 'react';
import {List} from 'immutable';
import {connect} from 'react-redux';
import {compose} from 'folktale/core/lambda';
import {AsyncDataAll} from '../../data/core/AsyncData';
import {Row, Col} from 'react-flexbox-grid';
import Button from 'material-ui/FlatButton';
import pureComponent from '../mixins/pureComponent';
import PageWithPanel from '../common/PageWithPanel';
import AsyncPanel from '../common/AsyncPanel';
import createInvestmentForm from './form/InvestmentForm';
import Table from '../common/Table';
import Container from '../common/Container';
import DialogBoxMixin from '../mixins/DialogBoxMixin';
import {saveInvestment, getInvestmentTypes} from '../../data/investment/investmentActions';
import {getBrokers} from '../../data/broker/brokerActions';

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
    this.props.getBrokers({skip, limit});
    this.props.getInvestmentTypes({skip, limit});
  }

  togglePanel = (_, selectedInvestment={}) => {
    this.setState({isPanelOpen: !this.state.isPanelOpen, selectedInvestment});
  }

  onInvestmentSave = investement => {
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

  getPanelContent() {
    // const InvestmentForm = createInvestmentForm({}/*brokers and types options*/, this.state.selectedInvestment);

    return (
      <AsyncPanel asyncResult={this.props.investments.saveInvestmentResult}>
        <Col xs={12}>
          <h1>New Investment</h1>
          {/*<InvestmentForm onSubmit={this.onInvestmentSave}/>*/}
        </Col>
      </AsyncPanel>
    );
  }

  handleCellClick = (e, _, investment) => {
    this.togglePanel(e, investment);
  }

  getInvestmentsData() {
    return this.props.investments.investments.reduce(
      (acc, v, id) => acc.push(
        Object.assign({}, v, {
          id,
          action: (
            <Button label="Delete" primary={true} onClick={partial(this.onInvestmentDeleteClick, v)} />
          )
        })
      ),
      List()
    )
    .toArray()
  }

  renderInvestementsTable() {
    return (
      <Container title='Investments' subtitle='Full list of all investments'>
        <AsyncPanel asyncResult={this.props.investments.fetchInvestmentResult}>
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
    AsyncDataAll([this.props.investments.fetchInvestmentTypeResult, this.props.fetchBrokersResult])
      .matchWith({
        Empty: () => console.log('>>>>>>>>>>>>>>>>> Empty'),
        Loading: () => console.log('>>>>>>>>>>>>>>>>> Loading'),
        Success: () => console.log('>>>>>>>>>>>>>>>>> Success'),
        Failure: () => console.log('>>>>>>>>>>>>>>>>> Failure')
      });

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
  investments: state.investment.toObject(),
  fetchBrokersResult: state.broker.get('fetchBrokersResult'),
});

const mapDispatchToProps = dispatch => ({
  saveInvestment: compose(dispatch, saveInvestment),
  getBrokers: compose(dispatch, getBrokers),
  getInvestmentTypes: compose(dispatch, getInvestmentTypes)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(InvestmentPage);
