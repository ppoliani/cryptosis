import React, {Component} from 'react';
import * as d3Shape from 'd3-shape';
import {
  StyleSheet,
  Text,
  View,
  ART,
  LayoutAnimation,
  Dimensions,
  TouchableWithoutFeedback,
  TouchableOpacity
} from 'react-native';
import AnimShape from './Shape';
import Theme from './theme';

const {
  Surface,
  Group,
  Rectangle,
  Shape,
} = ART;


const ARC_WIDTH = 40;

class Pie extends Component {
  state = {
    highlightedIndex: 0
  }

  constructor(props) {
    super(props);
    this.handleTextOnPress = this.handleTextOnPress.bind(this);
  }

  value = item =>  item.number;
  label = item => item.name
  color = index => Theme.colors[index]

  createPieChart = (index) => {
    const radius = this.getPieRadius();
    const innerRadius = this.getInnerRadius();

    var arcs = d3Shape.pie()
        .value(this.value)
        (this.props.data);

    var hightlightedArc = d3Shape.arc()
      .outerRadius(radius + 20)
      .padAngle(.05)
      .innerRadius(innerRadius);

    var arc = d3Shape.arc()
      .outerRadius(radius)
      .padAngle(.035)
      .innerRadius(innerRadius);

    this.arcData = arcs;
    var arcData = arcs[index];
    var path = (this.state.highlightedIndex == index) ? hightlightedArc(arcData) : arc(arcData);

     return {
       path,
       color: this.color(index),
     };
  }

  getPieCenter() {
    const marginTop = _styles.container.marginTop;
    const marginLeft = _styles.container.marginLeft;
    const centerX = this.props.pieHeight / 2 + marginLeft;
    const centerY = this.props.pieHeight / 2 + marginTop;

    return [centerX, centerY];
  }

  getPieRadius() {
    return this.props.pieWidth / 2;
  }

  getInnerRadius() {
    return this.getPieRadius() - ARC_WIDTH;
  }

  getTextPosition() {
    return [
      this.getInnerRadius() / 2 + _styles.container.marginLeft + ARC_WIDTH / 2,
      this.getInnerRadius() / 2 + _styles.container.marginTop + ARC_WIDTH / 2,
    ]
  }

  isPointWithinAnArc(x, y) {
    const [cx, cy] = this.getPieCenter();
    const radius = this.getPieRadius();
    const innerRadius = this.getInnerRadius();
    const dist = ((x - cx) ** 2) + ((y - cy) ** 2);

    return dist <= radius ** 2 && dist >= innerRadius ** 2;
  }

  handleTextOnPress = ()  => {
    console.log('Text clicked')
  }

  handleSurfaceClick(event) {
    const {locationX: x, locationY: y} = event.nativeEvent
    const [cx, cy] = this.getPieCenter();
    const diffY = y - cy;
    const diffX = x - cx;
    const angle = Math.atan2(diffY, diffX);

    // Don't ask why I did this for the following case? Just trial and fail
    // it looks like the top left quarter has some subtleties in the way we calculate the angle
    const normalizedAngle = diffY < 0 && diffX < 0
      ? angle + (Math.PI * 2) + Math.PI / 2
      : angle + (Math.PI / 2)

    if(this.isPointWithinAnArc(x, y)) {
      const index = this.arcData.findIndex(a => normalizedAngle >= a.startAngle && normalizedAngle <= a.endAngle)
      this.setState({...this.state, highlightedIndex: index});
      this.props.onItemSelected(index);
    }
  }

  getTextStyles() {
    const [left, top] = this.getTextPosition()
    return Object.assign({}, _styles.floatingTextStyle, {left, top});
  }

  renderShape() {
    return this.props
      .data
      .map((item, index) =>
        (
          <AnimShape
            key={'pie_shape_' + index}
            color={this.color(index)}
            d={() => this.createPieChart(index)} />
        )
    )
  }

  render() {
    const {width, height, pieWidth, pieHeight, data, renderContent} = this.props;
    const [x, y] = this.getPieCenter();
    const selectedValue = this.props.data[this.state.highlightedIndex];

    return (
      <View width={width} height={height} style={{backgroundColor: 'transparent'}}>
        <View style={this.getTextStyles()}
          width={pieWidth / 2}
          height={pieHeight / 2}>
            {renderContent(selectedValue)}
        </View>
        <TouchableOpacity
          activeOpacity={1}
          onPress={(e) => this.handleSurfaceClick(e)}>
            <Surface width={width} height={height + 10}>
              <Group x={x} y={y}>
                {this.renderShape()}
              </Group>
            </Surface>
        </TouchableOpacity>
      </View>
    );
  }
}

const _styles = {
  container: {
    marginTop: 40,
    marginLeft: 25,
    backgroundColor: 'transparent'
  },
  label: {
    fontSize: 15,
    marginTop: 5,
    fontWeight: 'normal',
  },

  floatingTextStyle: {
    position: 'absolute',
    flex:1,
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center',
    alignItems: 'center',
    zIndex: 100
  }
};

const styles = StyleSheet.create(_styles);

export default Pie;
