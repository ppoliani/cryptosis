import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Grid, Row, Col} from 'react-flexbox-grid';
import {compose, identity} from 'folktale/core/lambda';
import PortfolioChart from './PortfolioChart';
import PortfolioSummary from './PortfolioSummary';
import PriceSummary from './PriceSummary';
import InvestmentSummary from './InvestmentSummary';
import {startPortfolioStream} from '../../data/stream/portfolioValueStream';
import {startLast30DaysStream} from '../../data/stream/last30DaysStream';
import CurrencySelector from '../common/CurrencySelector';
import {getSelectedCurrency} from '../common/InvestmentValueHelpers';

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
    const {investment, portfolio, prices} = this.props;

    return (
      <Col>
        <Row between='xs' className='row-spacing'>
          <CurrencySelector />
        </Row>
        <Row between='xs'>
          <Col lg={8} xs={12} className='row-spacing'>
            <PortfolioChart
              investment={investment}
              portfolio={portfolio} />
          </Col>
          <Col lg={4} xs={12}>
            <Col className='row-spacing'>
              <PriceSummary
                currency={getSelectedCurrency(this.props.form)}
                investment={investment}
                prices={prices}/>
            </Col>
            <Col className='row-spacing'>
              <PortfolioSummary
                currency={getSelectedCurrency(this.props.form)}
                portfolio={portfolio}
                investment={investment} />
            </Col>
            <Col>
              <InvestmentSummary
                currency={getSelectedCurrency(this.props.form)}
                investment={investment}
                portfolio={portfolio} />
            </Col>
          </Col>
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
  startPortfolioStream: compose(dispatch, startPortfolioStream),
  startLast30DaysStream: compose(dispatch, startLast30DaysStream)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Overview);
