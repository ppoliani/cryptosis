import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Grid, Row, Col} from 'react-flexbox-grid'
import {identity} from 'folktale/core/lambda'
import {autobind} from 'core-decorators'
import {partial} from '../../../../common/core/fn'
import {startPortfolioStream} from '../../data/stream/portfolioValueStream'
import {startLast30DaysStream} from '../../data/stream/last30DaysStream'
import CurrencySelector from '../form/selectors/CurrencySelector'
import {getSelectedCurrency, getSelectedAsset} from '../common/TransactionHelpers' 
import TabView from './tabs/TabView'
import PriceContainer from '../price/PriceContainer'

const DEFAULT_CURRENCY = 'GBP';

class Overview extends Component {
  componentDidMount() {
    this.subscribe(DEFAULT_CURRENCY);
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  componentDidUpdate(prevProps) {
    const currency = getSelectedCurrency(this.props.form);

    if(currency && getSelectedCurrency(prevProps.form) !== currency) {
      this.unsubscribe().then(partial(this.subscribe, currency));
    }
  }

  @autobind
  subscribe(currency) {
    const {startPortfolioStream, startLast30DaysStream} = this.props;

    startPortfolioStream(currency);
    startLast30DaysStream(currency);
  }

  unsubscribe() {
    const {stream} = this.props;

    const s1 = stream
      .get('portfolioSubscription')
      .matchWith({
        Just: ({value}) => value.unsubscribe(),
        Nothing: identity
      });

    const s2 = stream
      .get('last30DaysSubscription')
      .matchWith({
        Just: ({value}) => value.unsubscribe(),
        Nothing: identity
      });

    return Promise.all([s1, s2]);
  }

  render() {
    const {transaction, portfolio, prices, form} = this.props;

    return (
      <Col>
        <Row between='xs' className='row-spacing'>
          <CurrencySelector value={getSelectedCurrency(form)}/>
        </Row>
        <Row between='xs' className='row-spacing'>
          <PriceContainer />
        </Row>
        <Row between='xs'>
          <TabView
            portfolio={portfolio}
            transaction={transaction}
            currency={getSelectedCurrency(form)}
            asset={getSelectedAsset(form)} />
        </Row>
      </Col>
    );
  }
}

const mapStateToProps = state => ({
  form: state.form,
  stream: state.stream,
  portfolio: state.portfolio,
  transaction: state.transaction,
  prices: state.prices
});

const mapDispatchToProps = dispatch => ({
  startPortfolioStream: (dispatch) ['∘'] (startPortfolioStream),
  startLast30DaysStream: (dispatch) ['∘'] (startLast30DaysStream)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Overview)
