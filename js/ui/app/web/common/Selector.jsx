import React from 'react'
import {Field, reduxForm} from 'redux-form'
import {renderDropdown} from '../form/helpers'

const SelectorForm = (form, initialValues, fieldName, options, selected) => {
  const Form = () => {
    console.log('>>>>', selected)
    return (
      <form>
        <Field
          name={fieldName}
          component={renderDropdown}
          custom={{options, selected}}
          type='dropdown'
          label={fieldName}/>
      </form>
    )
  }

  return reduxForm({
    form,
    initialValues,
  })(Form);
}

export default SelectorForm
