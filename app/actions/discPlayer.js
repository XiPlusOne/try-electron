// @flow
export const DISC_START_SPIN = 'DISC_START_SPIN';
export const DISC_STOP_SPIN = 'DISC_STOP_SPIN';
export const ROD_ON = 'ROD_ON';
export const ROD_OFF = 'ROD_OFF';

export function discStartSpin() {
  return {
    type: DISC_START_SPIN
  };
}

export function discStopSpin() {
  return {
    type: DISC_STOP_SPIN
  };
}

export function rodOn() {
  return {
    type: ROD_ON
  };
}

export function rodOff() {
  return {
    type: ROD_OFF
  };
}
