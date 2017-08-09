import React, {Component} from 'react'
import {Row, Col} from 'react-flexbox-grid'
import {autobind} from 'core-decorators'
import ButtonGroup from '../button/ButtonGroup'

const TypeOneButtons = [{
  label: 'Total',
  type: 'total'
}, {
  label: 'Change',
  type: 'change'
}, {
  label: 'Cash',
  type: 'cash'
}];

const TypeTwoButtons = [{
  label: 'Aggregate',
  type: 'aggregate'
}, {
  label: 'Breakdown',
  type: 'breakdown'
}];

class ChartButtonGroup extends Component {
  @autobind
  onChartTypeOneSelected(type) {
    this.chartTypeSelected(type, this.props.typeTwoSelectedBtn);
  }

  @autobind
  onChartTypeTwoSelected(type) {
    this.chartTypeSelected(this.props.typeOneSelectedBtn, type);
  }

  chartTypeSelected(typeOne, typeTwo) {
    this.props.onChartSelected({typeOne, typeTwo});
  }

  render() {
    const {typeOneSelectedBtn, typeTwoSelectedBtn} = this.props;

    return (
      <Row between='xs' className='full'>
        <Col xs={6} className='chart-type-1__selection'>
          <ButtonGroup
            buttons={TypeOneButtons}
            selected={typeOneSelectedBtn}
            onBtnClick={this.onChartTypeOneSelected} />
        </Col>
        <Col xs={4} className='chart-type-2__selection'>
          <ButtonGroup
            buttons={TypeTwoButtons}
            selected={typeTwoSelectedBtn}
            onBtnClick={this.onChartTypeTwoSelected} />
        </Col>
      </Row>
    );
  }
}

export default ChartButtonGroup
