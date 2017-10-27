import React, {Component} from 'react' 
import {StyleSheet} from 'react-native'
import {View, Text} from 'native-base'
import Carousel from 'react-native-snap-carousel' 
import LinearGradient from 'react-native-linear-gradient';

class PortfolioSummary extends Component {
  state = {
    entries: [
      {value: 'Profit'},
      {value: 'Exposure'},
      {value: 'Cash'},
      {value: 'Total Value'}
    ]
  }

  _renderItem ({item, index}) {
    return (
      <LinearGradient 
        style={[styles.center, styles.slide]} 
        start={{x: 0.0, y: 0.25}} end={{x: 0.5, y: 1.0}}
        colors={['#2C3E50', '#FD746C']}> 
          <Text>{item.value}</Text>
      </LinearGradient>
    );
  }

  render () {
    return (
      <View style={[styles.center, styles.container]}>
        <Carousel
          ref={(c) => { this._carousel = c; }}
          data={this.state.entries}
          renderItem={this._renderItem}
          sliderWidth={300}
          itemWidth={250} 
          itemHeight={100}
          loop={true}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  center: {
    justifyContent: 'center',
    alignItems: 'center'
  },

  slide: {
    width: 250,
    height: 100
  }
});

export default PortfolioSummary
