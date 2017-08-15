import fetch from './api'
import {removeItem} from '../services/storage'

export const login = (source, token) => fetch(
  'POST',
  `${process.env.API_URL}/login`,
  {},
  false,
  {'X-Auth-Source': source, 'X-Auth-Token': token}
)

export const logout = () => {
  removeItem(process.env.ACCESS_TOKEN_KEY);
  window.location.href = '/login';
}
