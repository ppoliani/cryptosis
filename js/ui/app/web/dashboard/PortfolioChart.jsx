import React, {Component} from 'react';
import {List as ListIm, Map} from 'immutable';
import AmCharts from '@amcharts/amcharts3-react';
import {LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer} from 'recharts';
import AsyncPanel from '../common/AsyncPanel';
import Container from '../common/Container';
import dateformat from 'date-fns/format';

// var imagesContext = require.context('!!file?name=images/amcharts/[name].[ext]!amcharts3/amcharts/images');
// imagesContext.keys().forEach(imagesContext);

const colors = [
  '#8884d8',
  '#82ca9d',
  '#FF6600'
]

export default class PortfolioChart extends Component {
  getSymbols() {
    const {portfolio, assetLife} = this.props;

    return portfolio
      .getIn(['last30Days', assetLife])
      .matchWith({
        Just: ({value: aggregates}) => aggregates.map((_, symbol) => symbol).toList(),
        Nothing: () => ListIm()
      })
  }

  getValueAxes() {
    return this.getSymbols()
      .map((symbol, i) => ({
        'id': i
      }))
      .toJS();
  }

  getGraphMetadata() {
    return this.getSymbols()
      .map((symbol, i) => ({
        'valueAxis': 0,
        'lineColor': colors[i],
        'title': symbol,
        'valueField': symbol,
        'fillAlphas': 0,
        // 'balloonText': `<div>[[value]]</b></div>`
      }))
      .toJS();
  }

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

  getChartScrollBar() {
    return {
      'graph': 'g1',
      'scrollbarHeight': 20,
      'backgroundAlpha': 0,
      'selectedBackgroundAlpha': 0.1,
      'selectedBackgroundColor': '#888888',
      'graphFillAlpha': 0,
      'graphLineAlpha': 0.5,
      'selectedGraphFillAlpha': 0,
      'selectedGraphLineAlpha': 1,
      'autoGridCount': true,
      'color': '#AAAAAA'
    }
  }

  getChartCursor() {
    return {
      'categoryBalloonDateFormat': 'JJ:NN, DD MMMM',
      'cursorPosition': 'mouse'
    }
  }

  getCategoryAxis() {
    return {
      'parseDates': true,
      'axisColor': '#DADADA',
      'minorGridEnabled': true
    }
  }

  getLegend() {
    return {
      'useGraphSettings': true
    };
  }

  render() {
    const {investment, title, subtitle} = this.props;

    return (
      <Container title={title} subtitle={subtitle}>
        <AsyncPanel asyncResult={investment.get('fetchInvestmentsResult')}>
          <AmCharts.React
            pathToImages='images/amcharts/'
            type='serial'
            theme='light'
            graphs={this.getGraphMetadata()}
            valueAxes={this.getValueAxes()}
            dataProvider={this.getPortfolioChartData()}
            chartCursor={this.getChartCursor()}
            categoryField='day'
            categoryAxis={this.getCategoryAxis()}
            synchronizeGrid={false}
            legend={this.getLegend()}
            chartScrollbar={this.getChartScrollBar()}/>
        </AsyncPanel>
      </Container>
    )
  }
}
