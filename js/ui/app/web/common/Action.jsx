import React from 'react';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

export default props => (
  <SelectField
    floatingLabelText={props.text}
    onChange={props.handleChange}>
      {
        props.values.map(v => (
          <MenuItem value={v} primaryText={v} />
        ))
      }
  </SelectField>
)
