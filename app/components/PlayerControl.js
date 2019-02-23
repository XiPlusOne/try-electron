// @flow
import React from 'react';
import { timeFromInt } from 'time-number';
import styles from './PlayerControl.less';

type Props = {
  playing: boolean,
  duration?: number,
  currentTime?: number,
  onToggleCallback: () => void
};

const processedTimeFromInt = (function hof(func) {
  return function processed(time) {
    const formatedTime = func(time);

    const ary = formatedTime.split(':');

    if (ary.length < 3) return formatedTime;

    ary.shift();

    return ary.join(':');
  };
})(timeFromInt);

export default class PlayerControl extends React.PureComponent<Props> {
  static defaultProps = {
    duration: 0,
    currentTime: 0
  };

  onToggle = () => {
    const { onToggleCallback } = this.props;

    if (typeof onToggleCallback === 'function') onToggleCallback();
  };

  render() {
    const { playing, duration, currentTime } = this.props;
    const percentage = currentTime && duration ? currentTime / duration : 0;

    return (
      <div className={styles.player}>
        <p className={styles.currentTime}>
          {processedTimeFromInt(currentTime)}
        </p>
        <div className={styles.progress}>
          <div
            className={styles.handle}
            style={{ left: `${percentage * 100}%` }}
          />
        </div>
        <p className={styles.totleTime}>{processedTimeFromInt(duration)}</p>
        <b className={`${styles.switch} ${styles.reverse}`} />
        <button
          type="button"
          onClick={this.onToggle}
          className={`${styles.toggle} ${
            playing ? styles.playing : styles.paused
          }`}
        />
        <b className={styles.switch} />
      </div>
    );
  }
}
