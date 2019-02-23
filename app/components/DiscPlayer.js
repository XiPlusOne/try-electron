// @flow
import React from 'react';
import Rod from './Rod';
import createPainter from '../utils/rodPainter';
import getDecoder from '../utils/flac';
import PlayerControl from './PlayerControl';
import Player from './Player';
import styles from './DiscPlayer.less';

const rodStyles = { top: 35 };
const painter = createPainter();
const decoder = getDecoder({
  readData: (view: DataView, index: number) => view.getUint8(index),
  sliceData: (view: DataView, start: number, end: number) =>
    new DataView(view.buffer.slice(start, end))
});

type Props = {
  isDiscSpinning: boolean,
  discStartSpin: () => void,
  discStopSpin: () => void,
  isRodOn: boolean,
  rodOn: () => void,
  rodOff: () => void,
  discPic: string,
  changeDisc: string => void,
  soundTrack: string,
  changeSoundTrack: string => void,
  title: string,
  changeTitle: string => void,
  duration: number,
  changeDuration: number => void,
  currentTime: number,
  changeCurrentTime: number => void
};

export default class DiscPlayer extends React.PureComponent<Props> {
  toggleRunning = () => {
    const { isRodOn, rodOn, rodOff, discStopSpin, discPic } = this.props;

    if (isRodOn) {
      // 探针移开时音乐立即停止播放
      rodOff();
      discStopSpin();
    } else if (discPic) {
      rodOn();
    } else {
      // eslint-disable-next-line
      alert('请先上传音轨文件，现在只支持flac格式');
    }
  };

  musicEnd = () => {
    const { rodOff, discStopSpin } = this.props;

    rodOff();
    discStopSpin();
  };

  metaLoad = (e: any) => {
    const { changeDuration } = this.props;

    changeDuration(e.target.duration);
  };

  playTimeUpdate = (e: any) => {
    const { changeCurrentTime } = this.props;

    changeCurrentTime(e.target.currentTime);
  };

  onRodOn = () => {
    const { discStartSpin } = this.props;

    discStartSpin();
  };

  onChangeDisc = (e: SyntheticInputEvent<HTMLInputElement>) => {
    const {
      changeDisc,
      changeSoundTrack,
      changeTitle,
      rodOff,
      discStopSpin,
      isRodOn
    } = this.props;

    if (isRodOn) {
      rodOff();
      discStopSpin();
    }

    const file = e.target.files[0];
    if (file.type !== 'audio/flac') {
      // 暂时只支持flac
      return;
    }
    changeTitle(file.name);
    const soundTrackUrl = URL.createObjectURL(file);
    changeSoundTrack(soundTrackUrl);
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);

    reader.onload = function onload(event) {
      const bytes = new DataView(event.target.result);
      const pic = decoder(bytes).pictures.filter(n => n.pictureType === 3)[0];

      if (!pic) {
        // 类型为3才是封面，见https://xiph.org/flac/format.html#metadata_block_picture
        return;
      }

      const blob = new Blob([pic.picture.buffer], {
        type: pic.mimeType,
        size: pic.picSize
      });
      const url = URL.createObjectURL(blob);
      changeDisc(url);
    };
  };

  render() {
    const {
      isDiscSpinning,
      isRodOn,
      discPic,
      soundTrack,
      title,
      duration,
      currentTime
    } = this.props;

    return (
      <div className={styles.container}>
        <header>
          <span>{title}</span>
          <Rod
            isRodOn={isRodOn}
            rodOnCallback={this.onRodOn}
            style={rodStyles}
            painter={painter}
          />
        </header>

        <main>
          <div className={styles.inner}>
            {discPic ? (
              <img
                src={discPic}
                className={isDiscSpinning ? styles.spinning : styles.paused}
                alt="the disc"
              />
            ) : null}
          </div>

          <label htmlFor="iconUpload" className={styles['icon-up']}>
            <input type="file" id="iconUpload" onChange={this.onChangeDisc} />
          </label>
        </main>

        <footer>
          <PlayerControl
            onToggleCallback={this.toggleRunning}
            playing={isRodOn}
            currentTime={currentTime}
            duration={duration}
          />
        </footer>

        <Player
          onMusicEnd={this.musicEnd}
          isPlaying={isRodOn}
          soundTrack={soundTrack}
          onMetaLoad={this.metaLoad}
          onTimeUpdate={this.playTimeUpdate}
        />
      </div>
    );
  }
}
