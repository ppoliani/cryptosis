import React, {Component} from 'react'
import {connect} from 'react-redux'
import Container from '../../common/Container'
import AsyncPanel from '../../panel/AsyncPanel'
import AsyncData from '../../../data/core/AsyncData'
import {getSelectedCurrency, getSelectedAsset} from '../../common/TransactionHelpers'
import TransactionsSummary from './TransactionsSummary'
import AssetSelector from '../../form/selectors/AssetSelector'
import {excludeFiat} from '../../../../../common/aggregators/utils'

class TransactionSummaryContainer extends Component {
  getAssetOptions(assetValues) {
    return [...assetValues.keys()]
      .map(k => ({
        value: k,
        text: k
      }));
  }

  getSelectedAsset(assetValues) {
    const options = this.getAssetOptions(assetValues);
    return getSelectedAsset(this.props.form) || (options[0] && options[0].value);
  }

  renderSelector() {
    const {portfolio, form} = this.props;

    return portfolio
      .get('total')
      .matchWith({
        Just: ({value: total}) => {
          const assetValues = total.getIn(['value', 'assetValues']);
          const options = this.getAssetOptions(assetValues);
          const selected = this.getSelectedAsset(assetValues);

          return (
            <AssetSelector
              options={options}
              value={selected} />
          )
        },
        Nothing: () => []
      });
  }

  renderContent() {
    const {portfolio, form} = this.props;

    return portfolio
      .get('total')
      .matchWith({
        Just: ({value: total}) => {
          const currency = getSelectedCurrency(form);
          const assetValues = total.getIn(['value', 'assetValues']);
          const asset = this.getSelectedAsset(assetValues);

          return (
            <TransactionsSummary
              total={total}
              asset={asset}
              currency={currency} />
          );
        },
        Nothing: () => null
      });
  }

  render() {
    return (
      <Container title='Transactions' subtitle='Summary'>
        <AsyncPanel asyncResult={AsyncData.Success()}>
          {this.renderSelector()}
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
)(TransactionSummaryContainer)
