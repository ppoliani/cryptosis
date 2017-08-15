import React, {Component} from 'react'
import pureComponent from '../mixins/pureComponent'
import widgetTheme from './widgetTheme'

// That's how crypto compare code knows about the theme :(
window.cccTheme = widgetTheme;

@pureComponent
class Widget extends Component {
  componentDidMount() {
    this.addScript();
  }

  componentDidUpdate() {
    this.container.querySelector('script').remove();
    this.container.querySelector('.ccc-widget').remove();
    this.addScript();
  }

  addScript() {
    const s = document.createElement('script');
    s.src = this.props.src;
    s.async = true;
    this.container.appendChild(s);
  }

  render() {
    return (
      <div
        className='widget-tab-container'
        ref={container => { this.container = container; }}>
      </div>
    )
  }
}

export default Widget
