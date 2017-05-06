import React from 'react'
import {connect} from 'react-redux'
import {submit} from 'redux-form'
import Button from 'material-ui/Button';

export default formName => connect()(
  ({dispatch}) =>
    <Button
      raised
      primary
      className="right"
      onClick={() => {
        dispatch(submit(formName))}
      }>Submit
    </Button>
);

