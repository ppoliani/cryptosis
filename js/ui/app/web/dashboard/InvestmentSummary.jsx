import React, {Component} from 'react'
import {connect} from 'react-redux'
import {autobind} from 'core-decorators'
import {Row, Col} from 'react-flexbox-grid'
import Container from '../common/Container'
import AsyncPanel from '../panel/AsyncPanel'
import AsyncData from '../../data/core/AsyncData'
import pureComponent from '../mixins/pureComponent'
import {getPercentageChange} from '../../../../common/core/utils'
import {renderInvestmentChange} from '../common/InvestmentValueHelpers'
import {renderPrice, getSelectedCurrency, getSelectedAsset} from '../common/InvestmentValueHelpers'
import {getTotalCashForType, getQtyForType} from '../../../../common/metrics/portfolio'
import SelectorForm from '../common/Selector'
import TitledBox from '../box/TitledBox'

@pureComponent
class InvestmentSummary extends Component {
  getAssetOptions(totalExposure) {
    return [...totalExposure.keys()]
      .map(k => ({
        value: k,
        text: k
      }));
  }

  renderSelector() {
    const {portfolio, form, assetLife} = this.props;

    return portfolio
      .getIn(['total', assetLife])
      .matchWith({
        Just: ({value: total}) => {
          const options = this.getAssetOptions(total.get('totalExposure'));
          const selected = getSelectedAsset(form) || (options[0] && options[0].value);

          if(!selected) return null
          const Selector = SelectorForm('assetSelector', [], 'asset', options, selected);

          return (
            <Selector />
          )
        },
        Nothing: () => []
      });
  }

  renderContent() {
    const {form, portfolio, assetLife} = this.props;
    const currency = getSelectedCurrency(this.props.form);
    const asset = getSelectedAsset(this.props.form);

    return portfolio
      .getIn(['total', assetLife])
      .matchWith({
        Just: ({value: total}) => {
          const exposure = total.getIn(['totalExposure', asset]);
          const holdings = getQtyForType(portfolio, asset, assetLife);
          const currentValue = total.getIn(['currentValue', asset]);
          const totalInvested = total.getIn(['totalInvested', asset]);
          const totalCash = getTotalCashForType(portfolio, asset, assetLife);
          const percentageChange = renderInvestmentChange(currentValue, exposure, currency);

          return (
            <div>
              <Row around='xs'>
                <Col xs={5} className='row-spacing'>
                  <TitledBox color='secondary' header='Holdings'>{holdings}</TitledBox>
                </Col>
                <Col xs={5} className='row-spacing'>
                  <TitledBox color='secondary' header='Exposure'>{renderPrice(exposure, currency)}</TitledBox>
                </Col>
              </Row>
              <Row around='xs'>
                <Col xs={5} className='row-spacing'>
                  <TitledBox color='secondary' header='Cash'>{renderPrice(totalCash, currency)}</TitledBox>
                </Col>
                <Col xs={5} className='row-spacing'>
                  <TitledBox color='secondary' header='Amount Invested'>{renderPrice(totalInvested, currency)}</TitledBox>
                </Col>
              </Row>
              <Row around='xs'>
                <Col xs={5} className='row-spacing'>
                  <TitledBox color='secondary' header='Current Value'>{renderPrice(currentValue, currency)}</TitledBox>
                </Col>
                <Col xs={5} className='row-spacing'>
                  <TitledBox color='secondary' header='Safe Sell Price'>{renderPrice(exposure / holdings, currency)}</TitledBox>
                </Col>
              </Row>
              <Row around='xs'>
                <Col xs={11} className='row-spacing'>
                  <TitledBox color='secondary' header='Profit/Loss'>{percentageChange}</TitledBox>
                </Col>
              </Row>
            </div>
          );
        },
        Nothing: () => []
      });
  }

  render() {
    return (
      <Container title='Investment' subtitle='Summary'>
        <AsyncPanel asyncResult={AsyncData.Success()}>
          {/* {this.renderSelector()} */}
          {this.renderContent()}
        </AsyncPanel>
      </Container>
    )
  }
}

const mapStateToProps = state => ({
  form: state.form,
  portfolio: state.portfolio
});

const mapDispatchToProps = dispatch => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(InvestmentSummary)
