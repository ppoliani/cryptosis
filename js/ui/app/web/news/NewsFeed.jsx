import React, {Component} from 'react'

class NewsFeed extends Component {
  componentDidMount() {
    window.cccTheme =
      {"General":{"background":"#333","borderColor":"#121212"},"PoweredBy":{"textColor":"#EEE","linkColor":"#ffcc66"},"Data":{"priceColor":"#FFF","infoValueColor":"#FFF","borderColor":"#333"},"NewsItem":{"color":"#FFF","borderColor":"#444"},"Conversion":{"background":"#000","color":"#CCC"}};
    const s = document.createElement('script');
    s.src = 'https://widgets.cryptocompare.com/serve/v1/coin/feed?fsym=BTC&tsym=GBP&feedType=CoinTelegraph';
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

export default NewsFeed
