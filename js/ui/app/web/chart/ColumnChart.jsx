import React, {PureComponent} from 'react'
import AmCharts from '@amcharts/amcharts3-react'
import AsyncPanel from '../panel/AsyncPanel'
import Container from '../common/Container'
import {getColumnChartConfig, extendWithColors} from '../../services/chart'
import AsyncData  from '../../data/core/AsyncData'

class ColumnChart extends PureComponent {
  state = {
    chartStatus: AsyncData.Loading()
  };

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
    const {title, subtitle, chartData, currency} = this.props;

    return (
      <Container title={title} subtitle={subtitle}>
        <AsyncPanel asyncResult={this.state.chartStatus}>
          <div className='chart-container'>
            <AmCharts.React
              pathToImages='/images/'
              type='serial'
              categoryField='asset'
              theme='light'
              listeners={this.getChartsListeners()}
              dataProvider={chartData}
              {...getColumnChartConfig(currency)}/>
            </div>
        </AsyncPanel>
      </Container>
    );
  }
}

export default ColumnChart
