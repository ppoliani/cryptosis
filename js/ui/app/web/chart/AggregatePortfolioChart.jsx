import React, {PureComponent} from 'react'
import {List as ListIm, Map} from 'immutable'
import AmCharts from '@amcharts/amcharts3-react'
import AsyncPanel from '../panel/AsyncPanel'
import Container from '../common/Container'
import AsyncData  from '../../data/core/AsyncData'
import {getAggregatePortfolioChartConfig} from '../../services/chart'
import './chart.scss'

export default class AggregatePortfolioChart extends PureComponent {
  state = {
    chartStatus: AsyncData.Loading()
  };

  getChartData() {
    const {lastNDaysData, historicProperty} = this.props;

    const aggregate = ({value: aggregates}) => {
      const [first, ...rest] = aggregates.values();

      const getValue = obj =>  {
        const val = obj.getIn(['value', historicProperty]);

        return val !== undefined
            ? val
            : obj.get('total');
      };

      return first
        .map(data => Map({
          day: data.get('day'),
          total: getValue(data)
        }))
        .mergeWith(
          (oldVal, newVal) => Map({
            day: oldVal.get('day'),
            total: getValue(oldVal) + getValue(newVal)
          }),
          ...rest
        )
        .toJS();
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
    const {title, subtitle} = this.props;

    return (
      <Container title={title} subtitle={subtitle}>
        <AsyncPanel asyncResult={this.state.chartStatus}>
          <div className='chart-container'>
            <AmCharts.React
              pathToImages='/images/'
              type='serial'
              theme='light'
              listeners={this.getChartsListeners()}
              dataProvider={this.getChartData()}
              {...getAggregatePortfolioChartConfig()}/>
            </div>
        </AsyncPanel>
      </Container>
    )
  }
}
