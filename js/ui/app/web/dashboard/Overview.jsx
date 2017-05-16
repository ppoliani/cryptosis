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

  getTotalInvested() {
    return this.props.portfolio
      .get('total')
      .matchWith({
        Just: ({value: total}) => Math.floor(total.get('totalAssets').reduce((acc, v) => acc + v, 0)),
        Nothing: () => 0
      });
  }

  getTotalPortfolioValue() {
    return this.props.portfolio
      .get('total')
      .matchWith({
        Just: ({value: total}) => Math.floor(total.get('currentValue').reduce((acc, v) => acc + v, 0)),
        Nothing: () => 0
      });
  }

  renderPortfolioValue() {
    const {investment} = this.props;

    return (
      <Container title='Portfolio' subtitle=''>
        <AsyncPanel asyncResult={investment.get('fetchInvestmentsResult')}>
          <h2>Total Invested: £{this.getTotalInvested()}</h2>
          <h2>Total Portfolio Value: £{this.getTotalPortfolioValue()}</h2>
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
  portfolio: state.portfolio,
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
