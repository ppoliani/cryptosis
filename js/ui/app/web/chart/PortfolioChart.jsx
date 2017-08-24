import React, {PureComponent} from 'react'
import {List as ListIm, Map} from 'immutable'
import AmCharts from '@amcharts/amcharts3-react'
import AsyncPanel from '../panel/AsyncPanel'
import Container from '../common/Container'
import AsyncData from '../../data/core/AsyncData'
import {getChartConfig} from '../../services/chart'
import './chart.scss'

export default class PortfolioChart extends PureComponent {
  state = {
    chartStatus: AsyncData.Loading()
  };

  // create all records for a given symbol
  // i.e. [{ETH: 1000, day: 1233}, ...]
  getPortfolioChartData() {
    const createChartRecordsForSymbol = (priceList, symbol) => priceList.map(p =>
      Map({
        [symbol]: p.getIn(['value', this.props.historicProperty]).toFixed(2),
        day: new Date(p.get('day')),
      })
    );

    const aggregate = ({value: aggregates}) => aggregates.reduce(
      (acc, priceList, symbol) => acc.mergeWith(
        mergeLists,
        createChartRecordsForSymbol(priceList, symbol)
      ),
      ListIm()
    )
    .toJS();

    // merge list with data for each day for a specific symbol
    // i.e. [{ETH: 1000, day: 1233}, ...] and [{BTC: 1000, day: 1233}, ...]
    // -> [{ETH: 1000, BTC: 1000, day: 1233}, ...]
    const mergeLists = (l1, l2) => l1
        ? l1.merge(l2)
        : l2;

    const {lastNDaysData} = this.props;

    return lastNDaysData
      .matchWith({
        Just: aggregate,
        Nothing: () => {}
      });
  }

  getEntirePortfolioChartData() {
    const {lastNDaysData, historicProperty} = this.props;

    const mergeLists = (l1, l2) => {
      return l1
        ? l1
        : l2
    }

    const aggregate = ({value: aggregates}) => {
      const [first, ...rest] = aggregates.values()

      first.mergeWith(
        (oldVal, newVal) => {
          return Map({
            day: oldVal.get('day'),
            value: oldVal.getIn(['value', historicProperty]) + newVal.getIn(['value', historicProperty])
          })
        },
        ...rest
      )
    }

    return lastNDaysData
      .matchWith({
        Just: aggregate,
        Nothing: () => {}
      });
  }

  getChartsListeners() {
    return [{
      event: 'rendered',
      method: () => this.state.chartStatus.matchWith({
        Empty: () => {},
        Loading: () => {
          this.setState({chartStatus: AsyncData.Success()})
        },
        Success: () => {},
        Failure: () => {}
      })
    }]
  }

  render() {
    const {title, subtitle, lastNDaysData} = this.props;

    return (
      <Container title={title} subtitle={subtitle}>
        <AsyncPanel asyncResult={this.state.chartStatus}>
          <div className='chart-container'>
            <AmCharts.React
              pathToImages='/images/'
              type='serial'
              theme='light'
              listeners={this.getChartsListeners()}
              dataProvider={this.getEntirePortfolioChartData()}
              {...getChartConfig(lastNDaysData)}/>
            </div>
        </AsyncPanel>
      </Container>
    )
  }
}
