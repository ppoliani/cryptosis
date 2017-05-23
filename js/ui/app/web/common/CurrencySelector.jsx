import React from 'react';
import {Field, reduxForm} from 'redux-form';
import {renderDropdown} from '../form/helpers';

const options = [{
  value: 'gbp',
  text: 'GBP'
}, {
  value: 'euro',
  text: 'Euro'
}]

const CurrencySelectorForm = () => {
  return (
    <form>
       <Field
        name="currency"
        component={renderDropdown}
        custom={{options, selected: 'gbp'}}
        type='dropdown'
        label='Currency' />
    </form>
  )
}

export default reduxForm({
  form: 'currencySelector',
  initialValues: {currency: 'gbp'}
})(CurrencySelectorForm)
