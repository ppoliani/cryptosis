import React, {Component} from 'react';
import {List as ListIm, Map} from 'immutable';
import identity from 'folktale/core/lambda/identity';
import AmCharts from '@amcharts/amcharts3-react';
import pureComponent from '../mixins/pureComponent';
import AsyncPanel from '../common/AsyncPanel';
import Container from '../common/Container';
import Spinner from '../common/Spinner';
import AsyncData, {AsyncDataAll} from '../../data/core/AsyncData';
import {getChartConfig} from '../../helpers/chart';
import './chart.scss';

@pureComponent
export default class PortfolioChart extends Component {
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
    )

    // merge list with data for each day for a specific symbol
    // i.e. [{ETH: 1000, day: 1233}, ...] and [{BTC: 1000, day: 1233}, ...]
    // -> [{ETH: 1000, BTC: 1000, day: 1233}, ...]
    const mergeLists = (oldVal, newVal) => oldVal
        ? oldVal.merge(newVal)
        : newVal;

    const {portfolio, assetLife} = this.props;

    return portfolio
      .getIn(['last30Days', assetLife])
      .matchWith({
        Just: ({value: aggregates}) => aggregates.reduce(
            (acc, priceList, symbol) => acc.mergeWith(
              mergeLists,
              createChartRecordsForSymbol(priceList, symbol)
            ),
            ListIm()
          )
          .toJS(),
        Nothing: () => {}
      })
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
    const {title, subtitle, portfolio, assetLife} = this.props;
    const last30Days = portfolio.getIn(['last30Days', assetLife]);

    return (
      <Container title={title} subtitle={subtitle}>
        <AsyncPanel asyncResult={this.state.chartStatus}>
          <div className='chart-container'>
            <AmCharts.React
              pathToImages='/images/'
              type='serial'
              theme='light'
              listeners={this.getChartsListeners()}
              dataProvider={this.getPortfolioChartData()}
              {...getChartConfig(last30Days)}/>
            </div>
        </AsyncPanel>
      </Container>
    )
  }
}
