import React from 'react';
import RodCreator from './Rod';
import PlayerControl from './PlayerControl';
import discPic from '../../resources/bg.jpg';
import styles from './DiscPlayer.scss';

const rodStyles = { top: 35 };
const Rod = RodCreator();

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
export default class DiscPlayer extends React.PureComponent {
  props: Props;

  constructor(props: Props) {
    super(props);

    // todo 这个应该下方到一个组件里，总控组件不直接操作dom
    this.refAudio = React.createRef();
    this.toggleRunning = this.toggleRunning.bind(this);
    this.onRodOn = this.onRodOn.bind(this);
    this.playMusic = this.playMusic.bind(this);
    this.pauseMusic = this.pauseMusic.bind(this);
    this.musicEnd = this.musicEnd.bind(this);
  }

  componentDidMount() {
    const audioContext = new AudioContext();
    const track = audioContext.createMediaElementSource(this.refAudio.current);
    track.connect(audioContext.destination);
  }

  toggleRunning() {
    const { isRodOn, rodOn, rodOff, discStopSpin } = this.props;

    if (isRodOn) {
      // 探针移开时音乐立即停止播放
      rodOff();
      discStopSpin();
      this.pauseMusic();
    } else {
      rodOn();
      this.playMusic();
    }
  }

  playMusic() {
    this.refAudio.current.play();
  }

  pauseMusic() {
    this.refAudio.current.pause();
  }

  musicEnd() {
    const { rodOff, discStopSpin } = this.props;

    rodOff();
    discStopSpin();
  }

  onRodOn() {
    const { discStartSpin } = this.props;

    discStartSpin();
  }

  render() {
    const { isDiscSpinning, isRodOn } = this.props;

    return (
      <div className={styles.container}>
        <header>
          <span>
            Baldur's Gate Enhanced Edition Official Soundtrack - 01. Main Theme
          </span>
          <Rod
            // todo 这里的变化应该上提
            isRodOn={isRodOn}
            rodOnCallback={this.onRodOn}
            style={rodStyles}
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

          <audio
            src="D:\Projects\try-electron\resources\bg.flac"
            preload="auto"
            ref={this.refAudio}
            onEnded={this.musicEnd}
          >
            <track default kind="captions" label="Hello World!" />
          </audio>
        </footer>
      </div>
    );
  }
}
