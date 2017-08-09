import {List} from 'immutable'

const getSymbols = data => data
  .matchWith({
    Just: ({value: aggregates}) => aggregates.map((_, symbol) => symbol).toList(),
    Nothing: () => List()
  });

const getValueAxes = data => getSymbols(data)
  .map((symbol, id) => ({id}))
  .toJS();

const getGraphMetadata = data => getSymbols(data)
  .map(symbol => ({
    graph: 'g1',
    valueAxis: 0,
    title: symbol,
    valueField: symbol,
    fillAlphas: 0,
  }))
  .toJS();

const getChartScrollBar = () => ({
  graph: 'g1',
  scrollbarHeight: 20,
  dragIconHeight: 25,
  backgroundAlpha: 0,
  selectedBackgroundAlpha: 0.1,
  selectedBackgroundColor: '#888888',
  graphFillAlpha: 0,
  graphLineAlpha: 0.5,
  selectedGraphFillAlpha: 0,
  selectedGraphLineAlpha: 1,
  autoGridCount: true,
  color: '#AAAAAA'
});

const getChartCursor = () => ({
  categoryBalloonDateFormat: 'JJ:NN, DD MMMM',
  cursorPosition: 'mouse'
});

const getCategoryAxis = () => ({
  parseDates: true,
  minorGridEnabled: false
});

const getLegend = () => ({
  useGraphSettings: true,
  color: 'rgba(255, 255, 255, 0.54)',
});

export const getChartConfig = data => ({
  color: 'rgba(255, 255, 255, 0.54)',
  graphs: getGraphMetadata(data),
  valueAxes: getValueAxes(data),
  chartCursor: getChartCursor(),
  categoryField: 'day',
  categoryAxis: getCategoryAxis(),
  synchronizeGrid: false,
  legend: getLegend(),
  chartScrollbar: getChartScrollBar()
})

export const getAggregatePortfolioChartConfig = () => ({
  color: 'rgba(255, 255, 255, 0.54)',
  graphs: [{
    graph: 'g1',
    fillAlphas: 0.4,
    valueAxis: 0,
    title: 'Portfolio',
    valueField: 'total'
  }],
  valueAxes: [{
    position: 'left',
    title: 'Aggregate Value'
  }],
  chartCursor: getChartCursor(),
  categoryField: 'day',
  categoryAxis: getCategoryAxis(),
  chartScrollbar: getChartScrollBar()
})
