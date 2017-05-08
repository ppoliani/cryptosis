import React from 'react';
import TextField from 'material-ui/TextField';
import DatePicker from 'material-ui/DatePicker';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

const getError = field => field.meta.touched && field.meta.error
  ? field.meta.error
  : null;

export const renderInput = field => {
  let props = {
    id: field.name,
    floatingLabelText: field.label,
    hintText: field.label,
    type: field.type,
    errorText: getError(field)
  }

  if(field.custom.multiline) {
    props = Object.assign({}, props, { multiLine: true, rows: 2 });
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
    hintText: field.label
  }

  delete field.input.value;

  return <DatePicker
    {...field.input}
    {...props} />;
};

export const renderDropdown = field => (
  <SelectField
    floatingLabelText={field.label}
    value={-1}
    {...field.input}>
      <MenuItem value={-1} primaryText="Please select" />
      {
        field.custom.options.map(
          o => <MenuItem value={o.value} key={o.value} primaryText={o.text} />
        )
      }
  </SelectField>
);
