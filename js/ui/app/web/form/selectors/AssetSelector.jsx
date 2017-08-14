import React from 'react'
import {Field, reduxForm} from 'redux-form'
import {renderDropdown} from '../helpers'

const AssetSelectorForm = ({options, value}) => {
  return (
    <form>
       <Field
        name='asset'
        component={renderDropdown}
        custom={{options, value}}
        type='dropdown'
        label='Asset' />
    </form>
  )
}

export default reduxForm({
  form: 'assetSelector',
  initialValues: {}
})(AssetSelectorForm)
