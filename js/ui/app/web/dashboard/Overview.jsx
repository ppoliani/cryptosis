import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Grid, Row, Col} from 'react-flexbox-grid';
import {compose, identity} from 'folktale/core/lambda';
import PortfolioChart from './PortfolioChart';
import PortfolioSummary from './PortfolioSummary';
import PriceSummary from './PriceSummary';
import Container from '../common/Container';
import AsyncPanel from '../common/AsyncPanel';
import {List, ListItem} from 'material-ui/List';
import {startPortfolioStream} from '../../data/stream/portfolioValueStream';
import {startLast30DaysStream} from '../../data/stream/last30DaysStream';

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

  render() {
    const {investment, portfolio, prices} = this.props;

    return (
      <Col>
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
            <Col>
              <PortfolioSummary
                portfolio={portfolio}
                investment={investment} />
            </Col>
          </Col>
        </Row>
      </Col>
    );
  }
}

const mapStateToProps = state => ({
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
