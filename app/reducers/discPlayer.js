// @flow
import { combineReducers } from 'redux';
import {
  DISC_START_SPIN,
  DISC_STOP_SPIN,
  ROD_ON,
  ROD_OFF
} from '../actions/discPlayer';
import type { Action } from './types';

function isDiscSpinning(state: boolean = false, action: Action) {
  switch (action.type) {
    case DISC_START_SPIN:
      return true;
    case DISC_STOP_SPIN:
      return false;
    default:
      return state;
  }
}

function isRodOn(state: boolean = false, action: Action) {
  switch (action.type) {
    case ROD_ON:
      return true;
    case ROD_OFF:
      return false;
    default:
      return state;
  }
}

export default combineReducers({
  isDiscSpinning,
  isRodOn
});
