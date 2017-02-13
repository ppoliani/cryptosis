import { handleActions } from 'redux-actions';
import { SET_IS_SEARCHING } from './searchActions';

const setIsSearching = (state, action) => state.set('isLoading', action.payload);

export default handleActions({
  [SET_IS_SEARCHING]: setIsSearching
});
