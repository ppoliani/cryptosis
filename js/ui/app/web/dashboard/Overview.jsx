import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Grid, Row, Col} from 'react-flexbox-grid';
import {compose, identity} from 'folktale/core/lambda';
import PortfolioChart from './PortfolioChart';
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

  getTotalInvested() {
    return this.props.portfolio
      .get('total')
      .matchWith({
        Just: ({value: total}) => Math.floor(total.get('totalAssets').reduce((acc, v) => acc + v, 0)),
        Nothing: () => 0
      });
  }

  getTotalPortfolioValue() {
    return this.props.portfolio
      .get('total')
      .matchWith({
        Just: ({value: total}) => Math.floor(total.get('currentValue').reduce((acc, v) => acc + v, 0)),
        Nothing: () => 0
      });
  }

  getPercentageChange(initial, current) {
    return (current - initial) / initial * 100;
  }

  renderCurrentPrices() {
    const {investment, prices} = this.props;

    return (
      <Container title='Prices' subtitle='Live'>
        <AsyncPanel asyncResult={investment.get('fetchInvestmentsResult')}>
          <List>
            {
              prices.get('live').matchWith({
                Just: ({value: prices}) => prices.map((v, k, i) => {
                  return <ListItem key={k}>{k}: {v.get('price')}</ListItem>
                })
                .toList()
                .toJS(),
                Nothing: () => {}
              })
            }
          </List>
        </AsyncPanel>
      </Container>
    )
  }

  renderPortfolioValue() {
    const {investment} = this.props;
    const totalInvested = this.getTotalInvested();
    const totalPortfolioValue = this.getTotalPortfolioValue();

    return (
      <Container title='Portfolio' subtitle='Aggregates'>
        <AsyncPanel asyncResult={investment.get('fetchInvestmentsResult')}>
          <List>
            <ListItem primaryText={`Total Invested: £${totalInvested}`} />
            <ListItem primaryText={`Total Portfolio Value: £${totalPortfolioValue}`} />
            <ListItem primaryText={`Change: £${totalPortfolioValue - totalInvested}`} />
            <ListItem primaryText={`Change (%): ${this.getPercentageChange(totalInvested, totalPortfolioValue).toFixed(2)}%`} />
          </List>
        </AsyncPanel>
      </Container>
    )
  }

  render() {
    const {investment, portfolio} = this.props;

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
              {this.renderCurrentPrices()}
            </Col>
            <Col>
              {this.renderPortfolioValue()}
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
