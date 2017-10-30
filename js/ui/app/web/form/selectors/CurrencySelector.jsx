import React from 'react'
import {Field, reduxForm} from 'redux-form'
import {currencyOptions} from '../../../data/constants/currencies'
import {renderDropdown} from '../helpers'

// TODO: ignore these two curencies in the overview, for the time being
const currencies = currencyOptions.filter(c => c.value !== 'ETH' && c.value !== 'BTC');

const CurrencySelectorForm = ({value}) => {
  return (
    <form>
       <Field
        name='currency'
        component={renderDropdown}
        custom={{options: currencies, value}}
        type='dropdown'
        label='Currency' />
    </form>
  )
}

export default reduxForm({
  form: 'currencySelector',
  initialValues: {currency: 'GBP'}
})(CurrencySelectorForm)
