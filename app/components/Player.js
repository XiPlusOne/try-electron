// @flow
import React from 'react';
import soundTrack from '../../resources/bg.flac';

type Props = {
  onMusicEnd: () => void,
  isPlaying: boolean
};

export default class Player extends React.PureComponent<Props> {
  refAudio: $Call<typeof React.createRef>;

  constructor(props: Props) {
    super(props);

    this.refAudio = React.createRef();
  }

  componentDidMount() {
    const audioContext = new AudioContext();
    const { current } = this.refAudio;
    if (current) {
      const track = audioContext.createMediaElementSource(current);
      track.connect(audioContext.destination);
    }
  }

  componentDidUpdate(prevProps: Props) {
    const { isPlaying } = this.props;
    const { isPlaying: wasPlaying } = prevProps;

    if (isPlaying === wasPlaying) {
      return;
    }

    if (isPlaying) this.playMusic();
    else this.pauseMusic();
  }

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
    const { onMusicEnd } = this.props;

    return (
      <audio
        src={soundTrack}
        preload="auto"
        ref={this.refAudio}
        onEnded={onMusicEnd}
      >
        <track default kind="captions" label="Hello World!" />
      </audio>
    );
  }
}
