import { handleActions } from 'redux-actions';
import { SET_IS_LOADING } from './searchActions';
import state from '../state';

const setIsloading = (state, action) => state.set('isLoading', action.payload);

export default handleActions({
  [SET_IS_LOADING]: setIsloading
}, state.search);
