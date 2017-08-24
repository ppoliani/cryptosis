import React, {PureComponent} from 'react'
import widgetTheme from './widgetTheme'

// That's how crypto compare code knows about the theme :(
window.cccTheme = widgetTheme;

class Widget extends PureComponent {
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
