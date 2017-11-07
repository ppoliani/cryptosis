import {removeItem} from '../storage'
import config from '../config'

export const login = (source, token) => fetch(
  'POST',
  `${config.API_URL}/login`, 
  {},
  false,
  {'X-Auth-Source': source, 'X-Auth-Token': token}
)

export const logout = () => {
  removeItem(config.ACCESS_TOKEN_KEY);
  window.location.href = '/login';
}
