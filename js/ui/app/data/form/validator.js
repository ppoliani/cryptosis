export const required = value => value !== undefined ? undefined : 'Required';
export const date = value => /^[0-9]{2}[\/][0-9]{2}[\/][0-9]{4}$/g.test(value) ? undefined : 'Please enter correct date (dd/mm/yyy)';
export const number = value => /^-?\d*(\.\d+)?$/.test(value) ? undefined : 'Please enter a numeric value';
