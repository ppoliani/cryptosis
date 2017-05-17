import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Row, Col} from 'react-flexbox-grid';
import pureComponent from '../mixins/pureComponent';

@pureComponent
class InvestmentOverviewPage extends Component {
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

const mapDispatchToProps = dispatch => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(InvestmentOverviewPage);
