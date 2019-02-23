// @flow
import React from 'react';

type Props = {
  onMusicEnd: () => void,
  onMetaLoad: () => void,
  onTimeUpdate: () => void,
  isPlaying: boolean,
  soundTrack: string
};

export default class Player extends React.PureComponent<Props> {
  refAudio: $Call<typeof React.createRef>;

  constructor(props: Props) {
    super(props);

    this.refAudio = React.createRef();
  }

  componentDidUpdate(prevProps: Props) {
    if (!this.initiatated) {
      // Chrome浏览器上必须等待用户点击后才可以初始化
      this.initiatated = true;

      const audioContext = new AudioContext();
      const { current } = this.refAudio;
      if (current) {
        const track = audioContext.createMediaElementSource(current);
        track.connect(audioContext.destination);
      }
    }

    const { isPlaying } = this.props;
    const { isPlaying: wasPlaying } = prevProps;

    if (isPlaying === wasPlaying) {
      return;
    }

    if (isPlaying) this.playMusic();
    else this.pauseMusic();
  }

  initiatated = false;

  playMusic = () => {
    const { current } = this.refAudio;
    if (current) {
      current.play();
    }
  };

  pauseMusic = () => {
    const { current } = this.refAudio;
    if (current) {
      current.pause();
    }
  };

  render() {
    const { onMusicEnd, onMetaLoad, onTimeUpdate, soundTrack } = this.props;

    return (
      <audio
        src={soundTrack}
        preload="auto"
        ref={this.refAudio}
        onEnded={onMusicEnd}
        onLoadedMetadata={onMetaLoad}
        onTimeUpdate={onTimeUpdate}
      >
        <track default kind="captions" label="Hello World!" />
      </audio>
    );
  }
}
