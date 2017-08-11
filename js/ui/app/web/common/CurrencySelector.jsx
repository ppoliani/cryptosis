import React from 'react'
import {Field, reduxForm} from 'redux-form'
import {currencyOptions} from '../../data/constants/currencies'
import {renderDropdown} from '../form/helpers'

const CurrencySelectorForm = () => {
  return (
    <form>
       <Field 
        name='currency'
        component={renderDropdown}
        custom={{options: currencyOptions, selected: 'GBP'}}
        type='dropdown'
        label='Currency' />
    </form>
  )
}

export default reduxForm({
  form: 'currencySelector',
  initialValues: {currency: 'GBP'}
})(CurrencySelectorForm)
