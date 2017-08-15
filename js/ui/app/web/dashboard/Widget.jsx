import React, {Component} from 'react'
import pureComponent from '../mixins/pureComponent'

// That's how crypto compare code knows about the theme :(
window.cccTheme =
    {"General":{"background":"#333","borderColor":"#121212"},"PoweredBy":{"textColor":"#EEE","linkColor":"#ffcc66"},"Data":{"priceColor":"#FFF","infoValueColor":"#FFF","borderColor":"#333"},"NewsItem":{"color":"#FFF","borderColor":"#444"},"Conversion":{"background":"#000","color":"#CCC"}};

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
