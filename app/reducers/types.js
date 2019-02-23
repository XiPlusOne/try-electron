import type { Dispatch as ReduxDispatch, Store as ReduxStore } from 'redux';

export type StateType = {
  +discPlayer: {
    +isDiscSpinning: boolean,
    +isRodOn: boolean,
    +discPic: string,
    +soundTrack: string,
    +title: string,
    +duration: number,
    +currentTime: number
  }
};

export type Action = {
  type: string
};

export type GetState = () => counterStateType;

export type Dispatch = ReduxDispatch<Action>;

export type Store = ReduxStore<GetState, Action>;
