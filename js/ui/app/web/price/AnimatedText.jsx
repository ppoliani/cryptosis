import React, {Component} from 'react'
import classnames from 'classnames'
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
      'animated-text': true,
      'animated-text--up': change > 0,
      'animated-text--down': change < 0
    });

    return (
      <span className={classList}>{this.props.text}</span>
    )
  }
}


export default AnimatedText
