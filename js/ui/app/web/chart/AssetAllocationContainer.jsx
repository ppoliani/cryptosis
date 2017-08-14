import React, {Component} from 'react'
import {Row, Col} from 'react-flexbox-grid'
import {autobind} from 'core-decorators'
import AssetAllocationChart from './AssetAllocationChart'
import ButtonGroup from '../button/ButtonGroup'
import {round} from '../../services/utils'

const buttons = [{
  label: 'Value',
  type: 'value'
}, {
  label: 'Exposure',
  type: 'exposure'
}];

class AssetAllocationContainer extends Component {
  state = {
    selectedBtn: 'value'
  };

  @autobind
  onChartSelected(selectedBtn) {
    this.setState({selectedBtn});
  }

  getValueChartData() {
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

  getExposureChartData() {
    const {totalValue} = this.props;
    const mapChartData = ({value: total}) => total.get('totalExposure')
      .map((v, k) => ({
        crypto: k,
        value: round(v)
      }))
      .toList()
      .toJS();

    return totalValue.matchWith({
      Just: mapChartData,
      Nothing: () => []
    });
  }

  renderValueChart() {
    return (
      <AssetAllocationChart
        title='Portfolio Overview'
        subtitle='Current Value'
        chartData={this.getValueChartData()} />
    )
  }

  renderExposureChart() {
    return (
      <AssetAllocationChart
        title='Portfolio Overview'
        subtitle='Current Exposure'
        chartData={this.getExposureChartData()} />
    )
  }

  renderChart() {
    return this.state.selectedBtn === 'value'
      ? this.renderValueChart()
      : this.renderExposureChart();
  }

  renderButtonGroup() {
    return (
      <Col>
        <ButtonGroup
          buttons={buttons}
          selected={this.state.selectedBtn}
          onBtnClick={this.onChartSelected} />
      </Col>
    )
  }

  render() {
    return (
      <Col className='row-spacing'>
        <Row className='row-spacing' end="xs">
          {this.renderButtonGroup()}
        </Row>
        <Row between='xs'>
          <Col xs>
            {this.renderChart()}
          </Col>
        </Row>
      </Col>
    )
  }
}

export default AssetAllocationContainer
