import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Map} from 'immutable';
import {Row, Col} from 'react-flexbox-grid';
import dateformat from 'date-fns/format';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import {compose, identity} from 'folktale/core/lambda';
import Maybe from 'folktale/data/maybe';
import AsyncPanel from '../common/AsyncPanel';
import Container from '../common/Container';
import pureComponent from '../mixins/pureComponent';
import {getInvestment} from '../../data/investment/investmentActions';
import {getPercentageChange} from '../../../../common/core/utils';
import {renderInvestmentValue} from '../common/InvestmentValueHelpers';
import {startInvestmentCurrentValueStream} from '../../data/stream/investmentValueStream';

const DEFAULT_CURRENCY = 'GBP';

@pureComponent
class InvestmentOverviewPage extends Component {
  constructor(props, state) {
    super(props, state);
    const {getInvestment, match: {params}} = this.props;

    this.subscriptionStarted = false;
    this.getMaybeInvestment()
      .matchWith({
        Just:identity,
        Nothing: () => getInvestment(params.id)
      })
  }

  componentWillUnmount() {
    const {stream} = this.props;

    stream
      .get('investmentCurrentValueSubscription')
      .matchWith({
        Just: ({value}) => value.unsubscribe(),
        Nothing: identity
      });
  }

  componentDidUpdate() {
    // subscribe only once; once we have the investement data so we
    // can decide which currency we need to stream for
    if(!this.subscriptionStarted) {
      this.getMaybeInvestment()
        .matchWith({
          Just: ({value}) => this.subscribe(value.get('currency')),
          Nothing: identity
        })
    }

  }

  subscribe(currency) {
    this.props.startInvestmentCurrentValueStream(currency);
    this.subscriptionStarted = true;
  }

  getMaybeInvestment() {
    const {investment, match: {params}} = this.props;
    return Maybe.fromNullable(investment.getIn(['investments', params.id]));
  }

  getInvestmentsData = () => this.props.portfolio
    .get('investmentValues')
    .matchWith({
      Just: ({value}) => value,
      Nothing: () => Map()
    });

  renderDetails() {
    const investmentData = this.getInvestmentsData();
    const investmentId = this.props.match.params.id;

    return this.getMaybeInvestment()
      .matchWith({
        Just: ({value: investment}) => (
          <List>
            <Subheader>Type</Subheader>
            <ListItem>{investment.get('investmentType')}</ListItem>
            <Subheader>Date</Subheader>
            <ListItem>{dateformat(investment.get('date'), 'MM/DD/YYYY')}</ListItem>
            <Subheader>Quantity</Subheader>
            <ListItem>{investment.get('quantity')}</ListItem>
            <Subheader>Price</Subheader>
            <ListItem>{investment.get('price')}</ListItem>
            <Subheader>Expenses</Subheader>
            <ListItem>{investment.get('expenses')}</ListItem>
            <Subheader>Status</Subheader>
            <ListItem>{renderInvestmentValue(investmentId, investmentData)}</ListItem>
            <Subheader>Broker</Subheader>
            <ListItem>{investment.get('broker')}</ListItem>
            <Subheader>Asset Life</Subheader>
            <ListItem>{investment.get('assetLife')}</ListItem>
            <Subheader>Lower Limit</Subheader>
            <ListItem>{investment.get('lowerLimit')}%</ListItem>
            <Subheader>Upper Limit</Subheader>
            <ListItem>{investment.get('upperLimit')}%</ListItem>
            <Subheader>Currency</Subheader>
            <ListItem>{investment.get('currency')}</ListItem>
            <Subheader>Notes</Subheader>
            <ListItem>{investment.get('notes')}</ListItem>
          </List>
        ),
        Nothing: () => []
      })
  }

  render() {
    return(
      <Container title='Investment' subtitle='Summary'>
        <AsyncPanel asyncResult={this.props.investment.get('saveInvestmentResult')}>
          {this.renderDetails()}
        </AsyncPanel>
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  form: state.form,
  portfolio: state.portfolio,
  stream: state.stream,
  investment: state.investment
});

const mapDispatchToProps = dispatch => ({
  getInvestment: compose(dispatch, getInvestment),
  startInvestmentCurrentValueStream: compose(dispatch, startInvestmentCurrentValueStream)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(InvestmentOverviewPage);
