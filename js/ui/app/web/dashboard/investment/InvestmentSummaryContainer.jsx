import React, {Component} from 'react'
import {connect} from 'react-redux'
import Container from '../../common/Container'
import AsyncPanel from '../../panel/AsyncPanel'
import AsyncData from '../../../data/core/AsyncData'
import {getSelectedCurrency, getSelectedAsset} from '../../common/InvestmentValueHelpers'
import InvestmentSummary from './InvestmentSummary'
import AssetSelector from '../../form/selectors/AssetSelector'

class InvestmentSummaryContainer extends Component {
  getAssetOptions(totalExposure) {
    return [...totalExposure.keys()]
      .map(k => ({
        value: k,
        text: k
      }));
  }

  getSelectedAsset(totalExposure) {
    const options = this.getAssetOptions(totalExposure);
    return getSelectedAsset(this.props.form) || (options[0] && options[0].value);
  }

  renderSelector() {
    const {portfolio, assetLife, form} = this.props;

    return portfolio
      .getIn(['total', assetLife])
      .matchWith({
        Just: ({value: total}) => {
          const totalExposure = total.get('totalExposure');
          const options = this.getAssetOptions(totalExposure);
          const selected = this.getSelectedAsset(totalExposure);

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
    const {portfolio, assetLife, form} = this.props;

    return portfolio
      .getIn(['total', assetLife])
      .matchWith({
        Just: ({value: total}) => {
          const totalExposure = total.get('totalExposure');
          const selected = this.getSelectedAsset(totalExposure);
          const asset = this.getSelectedAsset(totalExposure);
          const currency = getSelectedCurrency(form);

          return (
            <InvestmentSummary
              total={total}
              portfolio={portfolio}
              asset={asset}
              currency={currency}
              assetLife={assetLife} />
          );
        },
        Nothing: () => null
      });
  }

  render() {
    return (
      <Container title='Investment' subtitle='Summary'>
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
)(InvestmentSummaryContainer)
