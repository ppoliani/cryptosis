import fetch from '../helpers/api';

export const login = (source, token) => fetch(
  'POST',
  `${process.env.API_URL}/login`,
  {},
  false,
  {'X-Auth-Source': source, 'X-Auth-Token': token}
);
