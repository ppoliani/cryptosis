import React, {Component} from 'react';
import {connect} from 'react-redux';
import {compose} from 'folktale/core/lambda';
import {Grid, Row, Col} from 'react-flexbox-grid';
import Button from 'material-ui/FlatButton';
import {autobind} from 'core-decorators'
import pureComponent from '../mixins/pureComponent';
import PageWithPanel from '../common/PageWithPanel';
import AyncPanel from '../common/AsyncPanel';
import InvestmentForm from './form/InvestmentForm';
import {savePosition} from '../../data/position/positionActions';

@pureComponent
class InvestmentPage extends Component {
  constructor(props, state) {
    super(props, state);

    this.state = {
      isPanelOpen: false
    };
  }

  @autobind
  togglePanel() {
    this.setState({isPanelOpen: !this.state.isPanelOpen});
  }

  @autobind
  onInvestmentSave(position) {
    this.props.savePosition(position);
  }

  getPanelContent() {
    return (
      <AyncPanel asyncResult={this.props.savePositionResult}>
        <Col xs={12}>
          <h1>New Investment</h1>
          <InvestmentForm onSubmit={this.onInvestmentSave}/>
        </Col>
      </AyncPanel>
    );
  }

  render() {
    return (
      <PageWithPanel
        PanelContent={this.getPanelContent()}
        togglePanel={this.togglePanel}
        isPanelOpen={this.state.isPanelOpen}>
          <Row>
            <Col xs>
              <Button type="submit" className="right" onClick={this.togglePanel}>New</Button>
            </Col>
          </Row>
          <Row>
            <Col xs>
              Here will be the table with all investements
            </Col>
          </Row>
      </PageWithPanel>
    );
  }
}

const mapStateToProps = state => state.position.toObject();
const mapDispatchToProps = dispatch => ({
  savePosition: compose(dispatch, savePosition)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(InvestmentPage);
