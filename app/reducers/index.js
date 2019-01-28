// @flow
import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import discPlayer from './discPlayer';

export default function createRootReducer(history: History) {
  return combineReducers({
    router: connectRouter(history),
    discPlayer
  });
}
