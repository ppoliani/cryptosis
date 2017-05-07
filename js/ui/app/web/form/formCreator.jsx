import React from 'react';
import {Field, reduxForm} from 'redux-form';
import {Grid, Row, Col} from 'react-flexbox-grid';
import Button from 'material-ui/RaisedButton';
import {renderInput, renderTextArea, renderDropdown} from './helpers';
import {pipe, partial} from '../../helpers/fn';

const getFieldRenderer = field => {
  switch(field.type) {
    case 'text':
    case 'email':
      return renderInput;
    case 'textarea':
      return renderTextArea;
    case 'dropdown':
      return renderDropdown;
    default:
      throw new Error('No such field type');
  }
}

const createFields = fields => fields.map(
  field => <Col key={field.name} xs={12/fields.length}>
      <Field
        name={field.name}
        label={field.label}
        component={getFieldRenderer(field)}
        custom={{options: field.options, content: field.content}}
        validate={field.validate}
        type={field.type}/>
    </Col>
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
  (group, i) => <Row key={i}>
    {createFields(group)}
  </Row>
);

const createForm = (numOfCols, fields) => props => {
  const formProps = {
    numOfCols,
    fields
  };

  return (
    <Row>
      <form onSubmit={props.handleSubmit}>
        {
          pipe(
            partial(renderColumns, numOfCols),
            groupFields(numOfCols, fields)
          )
        }
        <Row>
          <Button type="submit" primary className="right">Submit</Button>
        </Row>
      </form>
    </Row>
  );
};


export default (name, numOfCols, fields) => reduxForm({
  form: name
})(createForm(numOfCols, fields))
