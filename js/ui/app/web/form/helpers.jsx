import React from 'react';
import TextField from 'material-ui/TextField';
import ContentEditable from 'react-contenteditable';

const renderErrorIfNeeded = field => field.meta.touched && field.meta.error
  ? <span className="form-validation__error">{field.meta.error}</span>
  : null;

export const renderInput = field => {
  const error = renderErrorIfNeeded(field);
  const props = error ? {error: Boolean(error)} : [];

  return <div>
    <TextField
      {...field.input}
      type={field.type}
      id={field.name}
      {...props}
      label={field.label} />
    {renderErrorIfNeeded(field)}
  </div>
}

export const renderTextArea = field => <ContentEditable html={field.content} className="form__content-editable"/>;
