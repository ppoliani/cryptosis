import {List} from 'immutable'

const colors = ['#FF0F00', '#FF6600', '#FF9E01', '#FCD202', '#F8FF01', '#B0DE09', '#04D215'];
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
  color: 'rgba(255, 255, 255, 0.54)'
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
  chartCursor: getChartCursor(),
  categoryField: 'day',
  categoryAxis: getCategoryAxis(),
  chartScrollbar: getChartScrollBar()
})

export const extendWithColors = chartData => chartData.map((d, i) => Object.assign(d, {color: colors[i]}))

export const getAssetAllocationChartConfig = currency => ({
  valueField: 'value',
  titleField: 'asset',
  depth3D: 15,
  balloonText: `[[title]]<br><span style='font-size:14px'><b>${currency}[[value]]</b> ([[percents]]%)</span>`,
  angle: 35,
  labelsEnabled: true,
  marginTop: 0,
  marginBottom: 0,
  marginLeft: 0,
  marginRight: 0,
  pullOutRadius: 0,
  autoMargins: false,
  color: 'rgba(255, 255, 255, 0.54)',
})

export const getColumnChartConfig = currency => ({
  valueField: 'value',
  color: 'rgba(255, 255, 255, 0.54)',
  graphs: [{
    balloonText: `[[category]]<br><b>${currency}[[value]]</b>`,
    fillColorsField: 'color',
    fillAlphas: 0.9,
    lineAlpha: 0.2,
    type: 'column',
    valueField: 'value'
  }],
})
