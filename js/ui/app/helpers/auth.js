import fetch from '../helpers/api';

export const login = ({source, token}) => fetch(process.env.API_URL, 'POST');
