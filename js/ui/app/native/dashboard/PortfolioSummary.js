import React, {Component} from 'react' 
import {connect} from 'react-redux'
import {View, Text} from 'native-base'
import Carousel from 'react-native-snap-carousel' 
import LinearGradient from 'react-native-linear-gradient'
import styles from './styles';
import {startPortfolioStream} from '../../data/stream/portfolioValueStream'
import {
  getTotalExposure,
  getTotalPortfolioValue,
  getTotalCash,
  getTotalInvested,
  getCapitalGain
} from '../../../../common/metrics/portfolio'

const DEFAULT_CURRENCY = 'GBP';

class PortfolioSummary extends Component {
  state = {
    entries: [
      {value: 'Profit'},
      {value: 'Exposure'},
      {value: 'Cash'},
      {value: 'Total Value'}
    ]
  }

  componentDidMount() {
    this.subscribe(DEFAULT_CURRENCY);
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  subscribe(currency) {
    const {startPortfolioStream} = this.props;
    startPortfolioStream(currency);
  }

  unsubscribe() {
    const {stream} = this.props;

    return stream
      .get('portfolioSubscription')
      .matchWith({
        Just: ({value}) => value.unsubscribe(),
        Nothing: identity
      });
  }

  getData() {
    const {portfolio} = this.props;

    const portfolioValue = getTotalPortfolioValue(portfolio);
    const exposure = getTotalExposure(portfolio);
    const totalCash = getTotalCash(portfolio);
    const totalInvested = getTotalInvested(portfolio);
    const capitalGain = getCapitalGain(portfolio);

    return [
      {title: 'Total Value', value: portfolioValue},
      {title: 'Capital Gain', value: capitalGain},
      {title: 'Exposure', value: exposure},
      {title: 'Total Invested', value: totalInvested},
      {title: 'Cash', value: totalCash}
    ];
  }

  renderItem ({item, index}) {
    return (
      <LinearGradient 
        style={[styles.center, styles.slide]} 
        start={{x: 0.0, y: 0.25}} end={{x: 0.5, y: 1.0}}
        colors={['#2C3E50', '#FD746C']}> 
          <Text>{item.title}</Text>
          <Text>{item.value}</Text>
      </LinearGradient>
    );
  }

  render () {
    return (
      <View style={[styles.center, styles.container]}>
        <Carousel
          ref={(c) => {this.carousel = c;}}
          data={this.getData()}
          renderItem={this.renderItem}
          sliderWidth={300}
          itemWidth={250} 
          itemHeight={100}
          loop={true}
        />
      </View>
    );
  }
}

const mapStateToProps = state => ({
  stream: state.stream,
  portfolio: state.portfolio,
  transaction: state.transaction
});

const mapDispatchToProps = dispatch => ({
  startPortfolioStream: (dispatch) ['∘'] (startPortfolioStream)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PortfolioSummary)
