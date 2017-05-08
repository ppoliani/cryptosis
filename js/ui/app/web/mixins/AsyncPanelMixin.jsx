import React from 'react';
import Snackbar from 'material-ui/Snackbar';
import Spinner from '../common/Spinner';
import mixin from './index';

export default mixin({
  renderNotification(asyncResult, successMessage, errorMessage) {
    return asyncResult.matchWith({
      Empty: () => null,
      Loading: () => null,
      Success: () => <Snackbar
        open={true}
        message={successMessage}
        autoHideDuration={4000}
      />,
      Failure: ({error}) => <Snackbar
        open={true}
        message={errorMessage}
        autoHideDuration={4000}
      />
    });
  },

  renderActionStatus(asyncResult) {
    return asyncResult.matchWith({
      Empty: () => null,
      Loading: () => <Spinner />,
      Success: () => null,
      Failure: () => null
    });
  },

  shouldFadeOut(asyncResult) {
    return asyncResult.matchWith({
      Empty: () => false,
      Loading: () => true,
      Success: () => false,
      Failure: () => false
    });
  }
})
