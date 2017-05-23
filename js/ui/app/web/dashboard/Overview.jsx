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

class Overview extends Component {
  componentDidMount() {
    const {startPortfolioStream, startLast30DaysStream} = this.props;
    startPortfolioStream();
    startLast30DaysStream();
  }

  componentWillUnmount() {
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

  componentDidUpdate() {
    const values = this.props.form.currencySelector.values;
    console.log('>>>>>>', values && values.currency)
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
                investment={investment}
                prices={prices}/>
            </Col>
            <Col className='row-spacing'>
              <PortfolioSummary
                portfolio={portfolio}
                investment={investment} />
            </Col>
            <Col>
              <InvestmentSummary
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
