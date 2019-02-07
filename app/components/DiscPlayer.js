// @flow
import React from 'react';
import Rod from './Rod';
import createPainter from '../utils/rodPainter';
import PlayerControl from './PlayerControl';
import Player from './Player';
import discPic from '../../resources/bg.jpg';
import styles from './DiscPlayer.less';

const rodStyles = { top: 35 };
const painter = createPainter();

type Props = {
  discStartSpin: () => void,
  discStopSpin: () => void,
  rodOn: () => void,
  rodOff: () => void,
  isDiscSpinning: boolean,
  isRodOn: boolean
};

// todo 进度条功能
// todo 从磁盘读取音轨并播放，同时可以提取歌词、封面等信息（如果可能做到的话）
export default class DiscPlayer extends React.PureComponent<Props> {
  toggleRunning = () => {
    const { isRodOn, rodOn, rodOff, discStopSpin } = this.props;

    if (isRodOn) {
      // 探针移开时音乐立即停止播放
      rodOff();
      discStopSpin();
    } else {
      rodOn();
    }
  };

  musicEnd = () => {
    const { rodOff, discStopSpin } = this.props;

    rodOff();
    discStopSpin();
  };

  onRodOn = () => {
    const { discStartSpin } = this.props;

    discStartSpin();
  };

  render() {
    const { isDiscSpinning, isRodOn } = this.props;
    const title =
      "Baldur's Gate Enhanced Edition Official Soundtrack - 01. Main Theme";

    return (
      <div className={styles.container}>
        <header>
          <span>{title}</span>
          <Rod
            // todo 这里的变化应该上提
            isRodOn={isRodOn}
            rodOnCallback={this.onRodOn}
            style={rodStyles}
            painter={painter}
          />
        </header>

        <main>
          <div className={styles.inner}>
            <img
              src={discPic}
              className={isDiscSpinning ? styles.spinning : styles.paused}
              alt="the disc"
            />
          </div>
        </main>

        <footer>
          <PlayerControl
            onToggleCallback={this.toggleRunning}
            playing={isRodOn}
          />
        </footer>

        <Player onMusicEnd={this.musicEnd} isPlaying={isRodOn} />
      </div>
    );
  }
}
