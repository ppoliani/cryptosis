import React, {Component} from 'react';
import {List as ListIm, Map} from 'immutable';
import {LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer} from 'recharts';
import AsyncPanel from '../common/AsyncPanel';
import Container from '../common/Container';
import dateformat from 'date-fns/format';

const colors = [
  '#8884d8',
  '#82ca9d'
]

export default class PortfolioChart extends Component {
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

  render() {
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
}
