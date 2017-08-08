import React, {Component} from 'react';
import {List as ListIm, Map} from 'immutable';
import AmCharts from '@amcharts/amcharts3-react';
import {LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer} from 'recharts';
import AsyncPanel from '../common/AsyncPanel';
import Container from '../common/Container';
import {getChartConfig} from '../../helpers/chart';
import './chart.scss';

export default class PortfolioChart extends Component {
  // create all records for a given symbol
  // i.e. [{ETH: 1000, day: 1233}, ...]
  getPortfolioChartData() {
    const createChartRecordsForSymbol = (priceList, symbol) => priceList.map(p =>
      Map({
        [symbol]: p.getIn(['value', this.props.historicProperty]).toFixed(2),
        day: new Date(p.get('day')),
      })
    )

    // merge list with data for each day for a specific symbol
    // i.e. [{ETH: 1000, day: 1233}, ...] and [{BTC: 1000, day: 1233}, ...]
    // -> [{ETH: 1000, BTC: 1000, day: 1233}, ...]
    const mergeLists = (oldVal, newVal) => oldVal
        ? oldVal.merge(newVal)
        : newVal;

    const {portfolio, assetLife} = this.props;

    return portfolio
      .getIn(['last30Days', assetLife])
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

  render() {
    const {investment, title, subtitle, portfolio, assetLife} = this.props;
    const last30Days = portfolio.getIn(['last30Days', assetLife]);

    return (
      <Container title={title} subtitle={subtitle}>
        <AsyncPanel asyncResult={investment.get('fetchInvestmentsResult')}>
          <div className='chart-container'>
            <AmCharts.React
              pathToImages='/assets/images/'
              type='serial'
              theme='light'
              dataProvider={this.getPortfolioChartData()}
              {...getChartConfig(last30Days)}/>
            </div>
        </AsyncPanel>
      </Container>
    )
  }
}
