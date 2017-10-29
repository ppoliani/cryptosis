import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Row, Col} from 'react-flexbox-grid'
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
    const price = value.get('price');

    return (
      <Col key={asset} xs className='row-spacing'>
        <PriceBox
          asset={asset}
          price={price}
          formatedPrice={this.getFormattedPrice(price)}
          source={value.get('market')} />
      </Col>
    );
  }

  render() {
    const {prices} = this.props;
    return (
      <Row around='xs' className='row-spacing price-container'>
        {
          prices.map((value, asset) => this.renderPriceBox(value, asset))
          .toList()
          .toJS()
        }
      </Row>
    )
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
