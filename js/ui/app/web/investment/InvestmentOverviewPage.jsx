import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Map} from 'immutable';
import {Row, Col} from 'react-flexbox-grid';
import dateformat from 'date-fns/format';
import {List} from 'material-ui/List';
import ListItem from '../common/ListItem';
import Subheader from 'material-ui/Subheader';
import {identity} from 'folktale/core/lambda';
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
            <ListItem first='Type' second={invst.investmentType} />
            <ListItem first='Position Type' second={invst.positionType} />
            <ListItem first='Date' second={dateformat(invst.date, 'MM/DD/YYYY')} />
            <ListItem first='Quantity' second={invst.quantity} />
            <ListItem first='Price' second={renderPrice(invst.price, currency)} />
            <ListItem first='Expenses' second={renderPrice(invst.expenses, currency)} />
            <ListItem first='Value' second={renderInvestmentValue(investmentId, investmentData, currency)} />
            <ListItem first='Broker' second={invst.broker} />
            <ListItem first='Asset Life' second={invst.assetLife} />
            <ListItem first='Currency' second={invst.currency} />
            <ListItem first='Notes' second={invst.notes} />
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
  getInvestment: (dispatch) ['∘'] (getInvestment),
  startInvestmentCurrentValueStream: (dispatch) ['∘'] (startInvestmentCurrentValueStream)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(InvestmentOverviewPage);
