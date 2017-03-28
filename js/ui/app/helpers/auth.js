import fetch from '../helpers/api';

export const login = (source, token, authResponse) => fetch(
  `${process.env.API_URL}/login`,
  'POST',
  {...authResponse},
  {'X-Auth-Source': source, 'X-Auth-Token': token}
);
