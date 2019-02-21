// @flow
import React from 'react';
import Rod from './Rod';
import createPainter from '../utils/rodPainter';
import extract from '../utils/flac';
import PlayerControl from './PlayerControl';
import Player from './Player';
import styles from './DiscPlayer.less';

const rodStyles = { top: 35 };
const painter = createPainter();

type Props = {
  discStartSpin: () => void,
  discStopSpin: () => void,
  rodOn: () => void,
  rodOff: () => void,
  changeDisc: string => void,
  changeSoundTrack: string => void,
  changeTitle: string => void,
  isDiscSpinning: boolean,
  isRodOn: boolean,
  discPic: string,
  soundTrack: string,
  title: string
};

// TODO 进度条功能
// TODO 从磁盘读取音轨并播放，同时可以提取歌词、封面等信息（如果可能做到的话）
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
      alert('请先上传音轨文件，现在只支持flac格式');
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
      const bytes = new Uint8Array(event.target.result);
      const pic = extract(bytes).pictures.filter(n => n.pictureType === 3)[0];

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
    const { isDiscSpinning, isRodOn, discPic, soundTrack, title } = this.props;
    console.log(title);

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
          <input type="file" onChange={this.onChangeDisc} />
        </main>

        <footer>
          <PlayerControl
            onToggleCallback={this.toggleRunning}
            playing={isRodOn}
          />
        </footer>

        <Player
          onMusicEnd={this.musicEnd}
          isPlaying={isRodOn}
          soundTrack={soundTrack}
        />
      </div>
    );
  }
}
