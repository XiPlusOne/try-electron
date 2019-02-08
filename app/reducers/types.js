import type { Dispatch as ReduxDispatch, Store as ReduxStore } from 'redux';

export type StateType = {
  +discPlayer: {
    +isDiscSpinning: boolean,
    +isDiscSpinning: boolean
  }
};

export type Action = {
  type: string
};

export type GetState = () => counterStateType;

export type Dispatch = ReduxDispatch<Action>;

export type Store = ReduxStore<GetState, Action>;
