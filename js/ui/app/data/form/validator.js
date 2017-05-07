export const required = value => value ? undefined : 'Required';
export const date = value => /^[0-9]{2}[\/][0-9]{2}[\/][0-9]{4}$/g.test(value) ? undefined : 'Please enter correct date (dd/mm/yyy)';
