import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Grid, Row, Col} from 'react-flexbox-grid'
import {autobind} from 'core-decorators'
import PriceBox from './PriceBox'
import {getSelectedCurrency, renderPrice} from '../common/InvestmentValueHelpers'
import './price.scss'

class PriceContainer extends Component {
  getFormattedPrice(price) {
    const {form} = this.props;
    return renderPrice(price, getSelectedCurrency(form))
  }

  renderPriceBox(value, asset) {
    return (
      <Col xs>
        <PriceBox
          asset={asset}
          price={this.getFormattedPrice(value.get('price'))}
          source={value.get('market')} />
      </Col>
    );
  }

  @autobind
  renderPriceContainer({value: prices}) {
    return (
      <Row around='xs' className='row-spacing price-container'>
        {prices.map((value, asset) => this.renderPriceBox(value, asset))}
      </Row>
    )
  }

  render() {
    const {prices} = this.props;

    return prices.get('live').matchWith({
      Just: this.renderPriceContainer,
      Nothing: () => null
    })
  }
}

const mapStateToProps = state => ({
  form: state.form,
  prices: state.prices
});

const mapDispatchToProps = dispatch => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PriceContainer)
