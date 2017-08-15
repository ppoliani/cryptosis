import React, {Component} from 'react'
import {connect} from 'react-redux'
import {autobind} from 'core-decorators'
import {loadNews} from '../../data/news/newsActions'
import Spinner from '../spinner/Spinner'

class NewsFeed extends Component {
  componentDidMount() {
    this.props.loadNews();
  }

  @autobind
  renderNews({data: feeds}) {
    console.log(feeds)
  }

  render() {
    return (
      <div class='btcwdgt-forum' bw-entries='10'></div>
    )
  }
}

const mapStateToProps = state => ({
  news: state.news
});

const mapDispatchToProps = dispatch => ({
  loadNews: (dispatch) ['∘'] (loadNews)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NewsFeed)

