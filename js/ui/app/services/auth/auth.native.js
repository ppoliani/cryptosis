import {removeItem} from '../storage'
import config from '../config'

export const logout = () => {
  removeItem(config.ACCESS_TOKEN_KEY)
    .bimap(
      error => {
        console.log('Could not logout', error);
      },
      () => {
        console.log('Redirecting to login page...')
      }
    )
    .run();
}
