// @flow
export const DISC_START_SPIN = 'DISC_START_SPIN';
export const DISC_STOP_SPIN = 'DISC_STOP_SPIN';
export const ROD_ON = 'ROD_ON';
export const ROD_OFF = 'ROD_OFF';
export const CHANGE_DISC = 'CHANGE_DISC';
export const CHANGE_SOUNDTRACK = 'CHANGE_SOUNDTRACK';
export const CHANGE_TITLE = 'CHANGE_TITLE';
export const CHANGE_DURATION = 'CHANGE_DURATION';
export const CHANGE_CURRENT_TIME = 'CHANGE_CURRENT_TIME';

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

export function changeDisc(discPic: string) {
  return {
    type: CHANGE_DISC,
    data: discPic
  };
}

export function changeSoundTrack(soundTrack: string) {
  return {
    type: CHANGE_SOUNDTRACK,
    data: soundTrack
  };
}

export function changeTitle(title: string) {
  return {
    type: CHANGE_TITLE,
    data: title
  };
}

export function changeDuration(duration: number) {
  return {
    type: CHANGE_DURATION,
    data: duration
  };
}

export function changeCurrentTime(currentTime: number) {
  return {
    type: CHANGE_CURRENT_TIME,
    data: currentTime
  };
}
