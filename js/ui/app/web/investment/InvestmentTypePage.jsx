import React, {PureComponent} from 'react'
import {List} from 'immutable'
import {connect} from 'react-redux'
import {Row, Col} from 'react-flexbox-grid'
import Button from 'material-ui/FlatButton'
import PageWithPanel from '../panel/PageWithPanel'
import AsyncPanel from '../panel/AsyncPanel'
import {partial, pipe} from '../../../../common/core/fn'
import {filterObject} from '../../services/utils'
import createInvestmentTypeForm from './form/InvestmentTypeForm'
import DialogBoxMixin from '../mixins/DialogBoxMixin'
import Table from '../table/Table'
import Container from '../common/Container'
import {
  getInvestmentTypes,
  saveInvestmentType,
  updateInvestmentType,
  deleteInvestmentType
} from '../../data/investment/investmentActions'

const columns = [
  {key: 'name', label: 'Name'},
  {key: 'type', label: 'Type'},
  {key: 'notes', label: 'Notes'},
  {key: 'action', label: 'Action'}
];

@DialogBoxMixin
class InvestmentTypePage extends PureComponent {
  state = {
    isPanelOpen: false,
    limit: 10,
    skip: 0
  }

  componentDidMount() {
    const {skip, limit} = this.state;
    this.props.getInvestmentTypes({skip, limit});
  }

  togglePanel = (_, selectedInvestementType={}) => {
    this.setState({isPanelOpen: !this.state.isPanelOpen, selectedInvestementType});
  }

  onInvestmentTypeSave = investmentType => {
    const {saveInvestmentType, updateInvestmentType} = this.props;

    if(investmentType.id) {
      // exclude the action prop shich was added above
     pipe(
       updateInvestmentType,
       filterObject(investmentType, ['action'])
      );
    }
    else {
      saveInvestmentType(investmentType);
    }

    this.togglePanel();
  }

  getPanelContent() {
    const InvestmentTypeForm = createInvestmentTypeForm(this.state.selectedInvestementType);

    return (
      <AsyncPanel asyncResult={this.props.saveInvestmentTypeResult}>
        <Col xs={12}>
          <h1>New Transaction</h1>
          <InvestmentTypeForm onSubmit={this.onInvestmentTypeSave}/>
        </Col>
      </AsyncPanel>
    )
  }

  onInvestmentTypeDelete = investmentType => {
    this.props.deleteInvestmentType(investmentType);
  }

  onInvestmentTypeDeleteClick = (investmentType, e) => {
    e.stopPropagation();
    this.openDialog(partial(this.onInvestmentTypeDelete, investmentType))
  }

  handleCellClick = (e, _, investmentType) => {
    this.togglePanel(e, investmentType);
  }

  getInvestmentTypeData() {
    return this.props.investmentTypes.reduce(
      (acc, v, id) => acc.push(
        v.set('id', id)
          .set('action', <Button label="Delete" primary={true} onClick={partial(this.onInvestmentTypeDeleteClick, v)} />)
          .toJS()
      ),
      List()
    )
    .toArray()
  }

  renderInvestmentTypeTable() {
    return (
      <Container title='Crypto Assets' subtitle='Full list of crypto assets'>
        <AsyncPanel asyncResult={this.props.fetchInvestmentTypeResult}>
          <Table
            columns={columns}
            data={this.getInvestmentTypeData()}
            handleCellClick={this.handleCellClick}
          />
        </AsyncPanel>
      </Container>
    )
  }

  render() {
    const {isPanelOpen} = this.state;

    return (
      <PageWithPanel
        PanelContent={isPanelOpen && this.getPanelContent()}
        togglePanel={this.togglePanel}
        isPanelOpen={isPanelOpen}>
          <Row>
            <Col xs>
              <Button type="submit" className="right" onClick={this.togglePanel}>New</Button>
            </Col>
          </Row>
          <Row>
            <Col xs>
              {this.renderInvestmentTypeTable()}
            </Col>
          </Row>
          {this.renderDialogBox('Are you sure you want to delete this crypto asset?')}
      </PageWithPanel>
    );
  }
}

const mapStateToProps = state => ({
  investmentTypes: state.investment.get('investmentTypes'),
  saveInvestmentTypeResult: state.investment.get('saveInvestmentTypeResult'),
  fetchInvestmentTypeResult: state.investment.get('fetchInvestmentTypeResult'),
});

const mapDispatchToProps = dispatch => ({
  getInvestmentTypes: (dispatch) ['∘'] (getInvestmentTypes),
  saveInvestmentType: (dispatch) ['∘'] (saveInvestmentType),
  updateInvestmentType: (dispatch) ['∘'] (updateInvestmentType),
  deleteInvestmentType: (dispatch) ['∘'] (deleteInvestmentType)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(InvestmentTypePage)
