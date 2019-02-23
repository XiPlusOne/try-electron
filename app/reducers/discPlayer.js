// @flow
import { combineReducers } from 'redux';
import {
  DISC_START_SPIN,
  DISC_STOP_SPIN,
  ROD_ON,
  ROD_OFF,
  CHANGE_DISC,
  CHANGE_SOUNDTRACK,
  CHANGE_TITLE,
  CHANGE_DURATION,
  CHANGE_CURRENT_TIME
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

function discPic(state: string = '', action: Action) {
  switch (action.type) {
    case CHANGE_DISC:
      return action.data;
    default:
      return state;
  }
}

function soundTrack(state: string = '', action: Action) {
  switch (action.type) {
    case CHANGE_SOUNDTRACK:
      return action.data;
    default:
      return state;
  }
}

function title(state: string = '', action: Action) {
  switch (action.type) {
    case CHANGE_TITLE:
      return action.data;
    default:
      return state;
  }
}

function duration(state: number = 0, action: Action) {
  switch (action.type) {
    case CHANGE_DURATION:
      return action.data;
    default:
      return state;
  }
}

function currentTime(state: number = 0, action: Action) {
  switch (action.type) {
    case CHANGE_CURRENT_TIME:
      return action.data;
    default:
      return state;
  }
}

export default combineReducers({
  isDiscSpinning,
  isRodOn,
  discPic,
  soundTrack,
  title,
  duration,
  currentTime
});
