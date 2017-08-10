import React, {Component} from 'react'
import classnames from 'classnames'
import {Row, Col} from 'react-flexbox-grid'
import './animatedText.scss'

class AnimatedText extends Component {
  state = {
    change: 0
  };

  componentWillReceiveProps(nextProps) {
    this.setState({
      change:  nextProps.value - this.props.value
    });
  }

  render() {
    const change = this.state.change;

    const classList = classnames({
      'center': true,
      'animated-text': true,
      'animated-text--up': change > 0,
      'animated-text--down': change < 0
    });

    return (
      <Row middle='xs' center='xs' className={classList}>
        <Col>{this.props.text}</Col>
        <Col className='arrow'></Col>
      </Row>
    )
  }
}


export default AnimatedText
