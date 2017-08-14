import React from 'react'
import {Field, reduxForm} from 'redux-form'
import {currencyOptions} from '../../../data/constants/currencies'
import {renderDropdown} from '../helpers'

const CurrencySelectorForm = () => {
  return (
    <form>
       <Field
        name='currency'
        component={renderDropdown}
        custom={{options: currencyOptions, value: 'GBP'}}
        type='dropdown'
        label='Currency' />
    </form>
  )
}

export default reduxForm({
  form: 'currencySelector',
  initialValues: {currency: 'GBP'}
})(CurrencySelectorForm)
