// @flow
import {
  DISC_START_SPIN,
  DISC_STOP_SPIN,
  ROD_ON,
  ROD_OFF
} from '../actions/discPlayer';
import type { Action } from './types';

type State = {
  isDiscSpinning: boolean,
  isRodOn: boolean
};

export default function discPlayer(
  state: State = {
    isDiscSpinning: false,
    isRodOn: false
  },
  action: Action
) {
  switch (action.type) {
    case DISC_START_SPIN:
      return {
        ...state,
        isDiscSpinning: true
      };
    case DISC_STOP_SPIN:
      return {
        ...state,
        isDiscSpinning: false
      };
    case ROD_ON:
      return {
        ...state,
        isRodOn: true
      };
    case ROD_OFF:
      return {
        ...state,
        isRodOn: false
      };
    default:
      return state;
  }
}
