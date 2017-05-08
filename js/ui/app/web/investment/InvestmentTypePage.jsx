import React, {Component} from 'react';
import {autobind} from 'core-decorators';
import {connect} from 'react-redux';
import {compose} from 'folktale/core/lambda';
import {Grid, Row, Col} from 'react-flexbox-grid';
import Button from 'material-ui/FlatButton';
import PageWithPanel from '../common/PageWithPanel';
import pureComponent from '../mixins/pureComponent';
import AsyncPanel from '../common/AsyncPanel';
import InvestmentTypeForm from './form/InvestmentTypeForm';
import {saveInvestmentType} from '../../data/investment/investmentActions';

const onSubmit = async (values) => {
  await Promise.resolve();
  console.log(values);
}

@pureComponent
class InvestmentTypePage extends Component {
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
  onInvestmentTypeSave(investmentType) {
    this.props.saveInvestmentType(investmentType);
  }

  getPanelContent() {
    return (
      <AsyncPanel asyncResult={this.props.saveInvestmentTypeResult}>
        <Col xs={12}>
          <h1>New Investment Type</h1>
          <InvestmentTypeForm onSubmit={this.onInvestmentTypeSave}/>
        </Col>
      </AsyncPanel>
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
              Here will be the table with all investements types
            </Col>
          </Row>
      </PageWithPanel>
    );
  }
}

const mapStateToProps = state => ({
  investmentTypes: state.investment.get('types'),
  saveInvestmentTypeResult: state.investment.get('saveInvestmentTypeResult')
});

const mapDispatchToProps = dispatch => ({
  saveInvestmentType: compose(dispatch, saveInvestmentType)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(InvestmentTypePage);
