import {handleActions} from 'redux-actions';
import Maybe from 'folktale/data/maybe'
import {Map, fromJS} from 'immutable';
import {SET_USER_PROFILE} from './profileActions';

const handleSetUserProfile = (state, action) => state.set('info', Maybe.fromNullable(fromJS(action.payload)));

const ProfileData = Map({
  info: Maybe.Nothing()
});

export default handleActions({
  [SET_USER_PROFILE]: handleSetUserProfile
}, ProfileData);
