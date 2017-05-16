import React, {Component} from 'react';
import {connect} from 'react-redux';
import {List as ListIm, Map} from 'immutable';
import {Grid, Row, Col} from 'react-flexbox-grid';
import {compose, identity} from 'folktale/core/lambda';
import {LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer} from 'recharts';
import dateformat from 'date-fns/format';
import Container from '../common/Container';
import AsyncPanel from '../common/AsyncPanel';
import {List, ListItem} from 'material-ui/List';
import {getPartialInvestments} from '../../data/investment/investmentActions';
import {startPortfolioStream, startLast30DaysStream} from '../../data/stream/streamActions';

const colors = [
  '#8884d8',
  '#82ca9d'
]

class Overview extends Component {
  componentDidMount() {
    const {startPortfolioStream, getPartialInvestments, startLast30DaysStream} = this.props;
    getPartialInvestments();
    startPortfolioStream();
    setTimeout(startLast30DaysStream, 2000); // TODO: find a better way to wait for getPartialInvestments to finish
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

  getPortfolioChartData() {
    // create all records for a given symbol
    // i.e. [{ETH: 1000, day: 1233}, ...]
    const createChartRecordsForSymbol = (priceList, symbol) => priceList.map(p =>
      Map({
        [symbol]: p.get('value'),
        day: dateformat(p.get('day'), 'MM/DD/YYYY'),
      })
    )

    // merge list with data for each day for a specific symbol
    // i.e. [{ETH: 1000, day: 1233}, ...] and [{BTC: 1000, day: 1233}, ...]
    // -> [{ETH: 1000, BTC: 1000, day: 1233}, ...]
    const mergeLists = (oldVal, newVal, key) => oldVal
        ? oldVal.merge(newVal)
        : newVal;

    return this.props.portfolio
      .get('last30Days')
      .matchWith({
        Just: ({value: aggregates}) => aggregates.reduce(
            (acc, priceList, symbol) => acc.mergeWith(
              mergeLists,
              createChartRecordsForSymbol(priceList, symbol)
            ),
            ListIm()
          )
          .toJS(),
        Nothing: () => {}
      })
  }

  // iterate over the keys and create a Line for each
  renderLines() {
    return this.props.portfolio
      .get('last30Days')
      .matchWith({
        Just: ({value}) => [...value.keys()].map((k, i) => <Line key={k} type='natural' dot={false} dataKey={k} stroke={colors[i]} />),
        Nothing: () => {}
      })
  }

  renderPortfolioChart() {
    const {investment} = this.props;

    return (
      <Container title='Portfolio' subtitle='Total Value (last 30 days)'>
        <AsyncPanel asyncResult={investment.get('fetchInvestmentsResult')}>
          <ResponsiveContainer width='100%' height={300}>
            <LineChart data={this.getPortfolioChartData()}>
              <XAxis dataKey='day' />
              <YAxis />
              <Tooltip/>
              <CartesianGrid strokeDasharray="3 3" />
              {this.renderLines()}
            </LineChart>
          </ResponsiveContainer>
        </AsyncPanel>
      </Container>
    )
  }

  render() {
    return (
      <Col>
        <Row between='xs'>
          <Col lg={8} xs={12}>
            {this.renderPortfolioChart()}
          </Col>
          <Col lg={4} xs={12}>
            {this.renderPortfolioValue()}
          </Col>
        </Row>
      </Col>
    );
  }
}

const mapStateToProps = state => ({
  stream: state.stream,
  portfolio: state.portfolio,
  investment: state.investment
});

const mapDispatchToProps = dispatch => ({
  getPartialInvestments: compose(dispatch, getPartialInvestments),
  startPortfolioStream: compose(dispatch, startPortfolioStream),
  startLast30DaysStream: compose(dispatch, startLast30DaysStream)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Overview);
