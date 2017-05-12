import React from 'react';
import TextField from 'material-ui/TextField';
import DatePicker from 'material-ui/DatePicker';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

const getError = field => field.meta.touched && field.meta.error
  ? field.meta.error
  : null;

export const renderInput = (field) => {
  let props = {
    id: field.name,
    floatingLabelText: field.label,
    hintText: field.label,
    type: field.type,
    errorText: getError(field)
  }

  if(field.custom.multiline) {
    props = Object.assign({}, props, {
      multiLine: true,
      floatingLabelText: null,
      rows: 2
    });
  }

  return <div>
    <TextField
      {...field.input}
      {...props} />
  </div>
}

export const renderDatePicker = field =>  {
  const props = {
    id: field.name,
    hintText: field.label,
    value: field.input.value || {}
  }

  const onChange = (_, value) => field.input.onChange(value);

  return (
    <DatePicker
      {...field.input}
      {...props}
      onChange={onChange} />
  );
};

export const renderDropdown = field => {
  const props = {
    id: field.name,
    hintText: field.label
  }

  const onChange = (_, __, value) => {
    field.input.onChange(value);
  }

 return (
  <SelectField
    {...field.input}
    {...props}
    onChange={onChange}>
        {
          field.custom.options.map(
            o => <MenuItem value={o.value} key={o.value} primaryText={o.text} />
          )
        }
    </SelectField>
 );
};
