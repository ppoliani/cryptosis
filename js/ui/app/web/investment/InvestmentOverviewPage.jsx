import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Row, Col} from 'react-flexbox-grid';
import {compose} from 'folktale/core/lambda';
import pureComponent from '../mixins/pureComponent';
import {getInvestment} from '../../data/investment/investmentActions';

@pureComponent
class InvestmentOverviewPage extends Component {
  constructor(props, state) {
    super(props, state);

    const {investment, getInvestment, match: {params}} = this.props;
    const investments = investment.get('investments');
    const investmentId = params.id;

    if(!investments.has(investmentId)) {
      getInvestment(investmentId)
    }
  }

  render() {
    return(
       <Row>
        <Col xs>
          Investment Detail {this.props.match.params.id}
        </Col>
      </Row>
    );
  }
}

const mapStateToProps = state => ({
  investment: state.investment
});

const mapDispatchToProps = dispatch => ({
  getInvestment: compose(dispatch, getInvestment)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(InvestmentOverviewPage);
