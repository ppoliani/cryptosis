import React from 'react';
import {Field, reduxForm} from 'redux-form';
import Layout from 'material-ui/Layout';
import Button from 'material-ui/Button';
import {renderInput, renderTextArea} from './helpers';
import {pipe, partial} from '../../helpers/fn';

const getFieldRenderer = field => {
  switch(field.type) {
    case 'text':
      return renderInput;
    case 'textarea':
      return renderTextArea;
    default:
      throw new Error('No such field type');
  }
}

const createFields = fields => fields.map(
  field => <Layout item key={field.name} xs={12/fields.length}>
      <Field
        name={field.name}
        label={field.label}
        component={getFieldRenderer(field)}
        content={field.content}
        validate={field.validate}
        type={field.type}/>
    </Layout>
)

const getLastIndex = arr => arr.length === 0 ? 0 : arr.length - 1;
const getLastEntry = arr => {
  return arr[arr.length - 1] || getLastEntry(addNewNestedArray(arr))
};
const addNewNestedArray = arr => [...arr, []];

const groupFields = (numOfCols, fields) => fields.reduce(
  (acc, field, index) => {
    const lastEntry = getLastEntry(acc);

    if(field.stretch) {
      acc[getLastIndex(acc) + 1] = [field];
    }
    else if(lastEntry.length < numOfCols) {
      acc[getLastIndex(acc)] = [...lastEntry, field];
    }
    else {
      acc[getLastIndex(acc) + 1] = [field];
    }

    return acc;
  },
  []
)

const renderColumns = (numOfCols, groupedFields) => groupedFields.map(
  (group, i) => <Layout container direction="row" key={i}>
    {createFields(group)}
  </Layout>
);

export default create = ({numOfCols, fields, handleSubmit}) => <form onSubmit={handleSubmit}>
  {
    pipe(
      partial(renderColumns, numOfCols),
      groupFields(numOfCols, fields)
    )
  }
  <Layout container>
    <Layout item xs={12}>
      <Button type="submit" raised primary className="right">Submit</Button>
    </Layout>
  </Layout>
</form>
