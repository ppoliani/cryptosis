import React, {Component} from 'react'
import {Row, Col} from 'react-flexbox-grid'
import {autobind} from 'core-decorators'
import AssetAllocationChart from './AssetAllocationChart'
import ColumnChart from './ColumnChart'
import ButtonGroup from '../button/ButtonGroup'
import {round} from '../../services/utils'

const buttons = [{
  label: 'Coins Allocation',
  type: 'value'
}, {
  label: 'Total Holdings',
  type: 'holdings'
}];

class AssetAllocationContainer extends Component {
  state = {
    selectedBtn: 'value'
  };

  @autobind
  onChartSelected(selectedBtn) {
    this.setState({selectedBtn});
  }

  getValueChartData(prop) {
    const {portfolioAgg} = this.props;
    
    const mapChartData = ({value: total}) => 
      total.get(prop)
        .map((value, asset) => ({
          asset,
          value: round(value)
        }))
        .toList()
        .toJS();

    return portfolioAgg.matchWith({
      Just: mapChartData,
      Nothing: () => []
    });
  }

  renderValueChart() {
    return (
      <AssetAllocationChart
        title='Portfolio'
        subtitle='Coins Allocation'
        currency={this.props.currency}
        chartData={this.getValueChartData('assetsValues')} />
    )
  }

  renderHoldingsChart() {

    return (
      <ColumnChart 
        title='Portfolio'
        subtitle='Holdings'
        currency={this.props.currency}
        chartData={this.getValueChartData('assetsValues')}  />
    )
  } 

  renderChart() {
    return this.state.selectedBtn === 'value'
      ? this.renderValueChart()
      : this.renderHoldingsChart();;
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
        <Row className='row-spacing' end='xs'>
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
