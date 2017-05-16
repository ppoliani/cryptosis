import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Grid, Row, Col} from 'react-flexbox-grid';
import {compose, identity} from 'folktale/core/lambda';
import Container from '../common/Container';
import AsyncPanel from '../common/AsyncPanel';
import {getPartialInvestments} from '../../data/investment/investmentActions';
import {startPortfolioStream} from '../../data/stream/streamActions';

class Overview extends Component {
  componentDidMount() {
    const {startPortfolioStream, getPartialInvestments} = this.props;
    getPartialInvestments();
    startPortfolioStream();
  }

  componentWillUnmount() {
    const {stream} = this.props;

    stream
      .get('portfolioSubscription')
      .matchWith({
        Just: ({value}) => value.unsubscribe(),
        Nothing: identity
      });
  }

  renderPortfolioValue() {
    const {investment} = this.props;

    return (
      <Container title='Portfolio' subtitle='Total Value'>
        <AsyncPanel asyncResult={investment.get('fetchInvestmentsResult')}>
          Total portfolio value
        </AsyncPanel>
      </Container>
    );
  }

  render() {
    return (
      <Grid fluid>
       <Row>
          <Col xs>
            <p>Dashboard</p>
          </Col>
        </Row>
        <Row>
          <Col xs>
            {this.renderPortfolioValue()}
          </Col>
        </Row>
      </Grid>
    );
  }
}

const mapStateToProps = state => ({
  stream: state.stream,
  investment: state.investment
});

const mapDispatchToProps = dispatch => ({
  getPartialInvestments: compose(dispatch, getPartialInvestments),
  startPortfolioStream: compose(dispatch, startPortfolioStream)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Overview);
