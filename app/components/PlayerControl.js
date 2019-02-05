import React from 'react';
import styles from './PlayerControl.less';

type Props = {
  playing: boolean,
  onToggleCallback: () => void
};

export default class PlayerControl extends React.PureComponent {
  props: Props;

  constructor(props) {
    super(props);

    this.onToggle = this.onToggle.bind(this);
  }

  onToggle() {
    const { onToggleCallback } = this.props;

    if (typeof onToggleCallback === 'function') onToggleCallback();
  }

  render() {
    const { playing } = this.props;

    return (
      <div className={styles.player}>
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
