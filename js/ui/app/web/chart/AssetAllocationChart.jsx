import React, {PureComponent} from 'react'
import AmCharts from '@amcharts/amcharts3-react'
import AsyncPanel from '../panel/AsyncPanel'
import Container from '../common/Container'
import {getAssetAllocationChartConfig} from '../../services/chart'
import AsyncData  from '../../data/core/AsyncData'
import {round} from '../../services/utils'

class AssetAllocationChart extends PureComponent {
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
    const {title, subtitle, chartData} = this.props;

    return (
      <Container title={title} subtitle={subtitle}>
        <AsyncPanel asyncResult={this.state.chartStatus}>
          <div className='chart-container'>
            <AmCharts.React
              pathToImages='/images/'
              type='pie'
              theme='light'
              listeners={this.getChartsListeners()}
              dataProvider={chartData}
              {...getAssetAllocationChartConfig()}/>
            </div>
        </AsyncPanel>
      </Container>
    );
  }
}

export default AssetAllocationChart
