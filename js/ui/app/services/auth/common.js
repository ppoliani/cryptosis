import fetch from '../api'
import config from '../config'

export const login = (source, token) => fetch(
  'POST',
  `${config.API_URL}/login`,
  {},
  false,
  {'X-Auth-Source': source, 'X-Auth-Token': token}
)
