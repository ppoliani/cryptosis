import React from 'react'
import Snackbar from 'material-ui/Snackbar'
import Spinner from '../common/Spinner'
import mixin from './index'

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
  }
})
