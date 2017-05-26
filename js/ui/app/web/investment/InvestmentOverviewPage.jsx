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
import {renderInvestmentValue, renderPrice} from '../common/InvestmentValueHelpers';
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
        Just: ({value: investment}) => {
          const invst = investment.toJS();
          const currency = invst.currency;

          return (
            <List>
            <Subheader>Type</Subheader>
            <ListItem>{invst.investmentType}</ListItem>
            <Subheader>Date</Subheader>
            <ListItem>{dateformat(invst.date, 'MM/DD/YYYY')}</ListItem>
            <Subheader>Quantity</Subheader>
            <ListItem>{invst.quantity}</ListItem>
            <Subheader>Price</Subheader>
            <ListItem>{renderPrice(invst.price, currency)}</ListItem>
            <Subheader>Expenses</Subheader>
            <ListItem>{renderPrice(invst.expenses, currency)}</ListItem>
            <Subheader>Status</Subheader>
            <ListItem>{renderInvestmentValue(investmentId, investmentData, currency)}</ListItem>
            <Subheader>Broker</Subheader>
            <ListItem>{invst.broker}</ListItem>
            <Subheader>Asset Life</Subheader>
            <ListItem>{invst.assetLife}</ListItem>
            <Subheader>Lower Limit</Subheader>
            <ListItem>{invst.lowerLimit}%</ListItem>
            <Subheader>Upper Limit</Subheader>
            <ListItem>{invst.upperLimit}%</ListItem>
            <Subheader>Currency</Subheader>
            <ListItem>{invst.currency}</ListItem>
            <Subheader>Notes</Subheader>
            <ListItem>{invst.notes}</ListItem>
          </List>
          )
        },
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
