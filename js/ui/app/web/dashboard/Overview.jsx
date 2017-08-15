import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Grid, Row, Col} from 'react-flexbox-grid'
import {identity} from 'folktale/core/lambda'
import {startPortfolioStream} from '../../data/stream/portfolioValueStream'
import {startLast30DaysStream} from '../../data/stream/last30DaysStream'
import CurrencySelector from '../form/selectors/CurrencySelector'
import {getSelectedCurrency} from '../common/InvestmentValueHelpers'
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

    if(getSelectedCurrency(prevProps.form) !== currency) {
      this.unsubscribe();
      this.subscribe(currency);
    }
  }

  subscribe(currency) {
    const {startPortfolioStream, startLast30DaysStream} = this.props;

    startPortfolioStream(currency);
    startLast30DaysStream(currency);
  }

  unsubscribe() {
    const {stream} = this.props;

    stream
      .get('portfolioSubscription')
      .matchWith({
        Just: ({value}) => value.unsubscribe(),
        Nothing: identity
      });

    stream
      .get('last30DaysSubscription')
      .matchWith({
        Just: ({value}) => value.unsubscribe(),
        Nothing: identity
      });
  }

  render() {
    const {investment, portfolio, prices, form} = this.props;

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
            investment={investment}
            prices={prices}
            currency={getSelectedCurrency(form)} />
        </Row>
      </Col>
    );
  }
}

const mapStateToProps = state => ({
  form: state.form,
  stream: state.stream,
  portfolio: state.portfolio,
  investment: state.investment,
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
