import React, {Component} from 'react'
import {Row, Col} from 'react-flexbox-grid'
import {autobind} from 'core-decorators'
import ChartButtonGroup from './ChartButtonGroup'
import PortfolioChart from './PortfolioChart'
import AggregatePortfolioChart from './AggregatePortfolioChart'
import './chart.scss'
 
const ChartProps = {
  total: {
    historicProperty: 'totalValue',
    subtitle: 'Total (last 30 days)'
  },
  capitalGain: {
    historicProperty: 'capitalGain',
    subtitle: 'Capital Gain (last 30 days)'
  } 
}

class ChartContainer extends Component {
  state = {
    typeOneSelectedBtn: 'total',
    typeTwoSelectedBtn: 'aggregate'
  };

  @autobind
  onChartSelected({typeOne, typeTwo}) {
    this.setState({
      typeOneSelectedBtn: typeOne,
      typeTwoSelectedBtn: typeTwo
    })
  }

  renderAggregateChart() {
    const {typeOneSelectedBtn} = this.state;

    return (
      <AggregatePortfolioChart
        title='Portfolio'
        subtitle={ChartProps[typeOneSelectedBtn].subtitle}
        historicProperty={ChartProps[typeOneSelectedBtn].historicProperty}
        lastNDaysData={this.props.lastNDaysData} />
    );
  }

  renderBreakdownChart() {
    const {typeOneSelectedBtn} = this.state;

    return (
      <PortfolioChart
        title='Portfolio'
        subtitle={ChartProps[typeOneSelectedBtn].subtitle}
        historicProperty={ChartProps[typeOneSelectedBtn].historicProperty}
        lastNDaysData={this.props.lastNDaysData} />
    );
  }

  renderChart() {
    const {typeTwoSelectedBtn} = this.state;

    return typeTwoSelectedBtn === 'aggregate'
       ? this.renderAggregateChart()
       : this.renderBreakdownChart();
  }

  render() {
    const {typeOneSelectedBtn, typeTwoSelectedBtn} = this.state;

    return (
      <Col className='row-spacing'>
        <Row className='row-spacing'>
          <ChartButtonGroup
            typeOneSelectedBtn={typeOneSelectedBtn}
            typeTwoSelectedBtn={typeTwoSelectedBtn}
            onChartSelected={this.onChartSelected}/>
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

export default ChartContainer
