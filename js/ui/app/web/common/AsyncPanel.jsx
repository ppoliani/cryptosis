import React, {Component} from 'react';
import Snackbar from 'material-ui/Snackbar';
import {Row, Col} from 'react-flexbox-grid';
import classnames from 'classnames';
import Spinner from '../common/Spinner';

export default class AsyncPanel extends Component {
  renderActionStatus(asyncResult) {
    return asyncResult.matchWith({
      Empty: () => null,
      Loading: () => <Spinner />,
      Success: () => null,
      Failure: () => null
    });
  }

  shouldFadeOut(asyncResult) {
    return asyncResult.matchWith({
      Empty: () => false,
      Loading: () => true,
      Success: () => false,
      Failure: () => false
    });
  }

  render() {
    const {children, asyncResult} = this.props;
    const classList = {'fade-out': this.shouldFadeOut(asyncResult)};

    return (
      <Row>
        <Col xs className={classnames(classList)} style={{height: '300px'}}>
          {children}
        </Col>
        {this.renderActionStatus(asyncResult)}
      </Row>
    );
  }
}
