import React, {Component} from 'react'
import {Row, Col} from 'react-flexbox-grid'
import {autobind} from 'core-decorators'
import AssetAllocationChart from './AssetAllocationChart'
import ButtonGroup from '../button/ButtonGroup'
import {round} from '../../services/utils'

const buttons = [];

class AssetAllocationContainer extends Component {
  state = {
    selectedBtn: 'value'
  };

  @autobind
  onChartSelected(selectedBtn) {
    this.setState({selectedBtn});
  }

  getValueChartData() {
    const {portfolioAgg} = this.props;
    
    const mapChartData = ({value: total}) => 
      total.get('assetsValues')
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
        title='Portfolio Overview'
        subtitle='Current Value'
        chartData={this.getValueChartData()} />
    )
  }

  renderChart() {
    return this.renderValueChart();
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
