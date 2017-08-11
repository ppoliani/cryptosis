import React, {Component} from 'react'
import AmCharts from '@amcharts/amcharts3-react'
import pureComponent from '../mixins/pureComponent'
import AsyncPanel from '../panel/AsyncPanel'
import Container from '../common/Container'
import {getAssetAllocationChartConfig} from '../../services/chart'
import AsyncData  from '../../data/core/AsyncData'
import {round} from '../../services/utils'

@pureComponent
class AssetAllocationChart extends Component {
  state = {
    chartStatus: AsyncData.Loading()
  };

  getChartData() {
    const {totalValue} = this.props;
    const mapChartData = ({value: total}) => total.get('totalExposure')
      .map((v, k) => ({
        crypto: k,
        value: round(total.getIn(['currentValue', k]))
      }))
      .toList()
      .toJS();

    return totalValue.matchWith({
      Just: mapChartData,
      Nothing: () => []
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
    return (
      <Container title='Asset' subtitle='Allocation'>
        <AsyncPanel asyncResult={this.state.chartStatus}>
          <div className='chart-container'>
            <AmCharts.React
              pathToImages='/images/'
              type='pie'
              theme='light'
              listeners={this.getChartsListeners()}
              dataProvider={this.getChartData()}
              {...getAssetAllocationChartConfig()}/>
            </div>
        </AsyncPanel>
      </Container>
    );
  }
}

export default AssetAllocationChart
