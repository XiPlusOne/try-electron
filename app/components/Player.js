// @flow
import React from 'react';

type Props = {
  onMusicEnd: () => void,
  isPlaying: boolean
};

export default class Player extends React.Component<Props> {
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

  // 这个组件一旦创建就不再更新
  // TODO 寻找一种更好的实现
  shouldComponentUpdate(nextProps: Props) {
    const { isPlaying } = this.props;
    const { isPlaying: willBePlaying } = nextProps;

    if (isPlaying === willBePlaying) {
      return false;
    }

    if (willBePlaying) this.playMusic();
    else this.pauseMusic();

    return false;
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
        src="D:\Projects\try-electron\resources\bg.flac"
        preload="auto"
        ref={this.refAudio}
        onEnded={onMusicEnd}
      >
        <track default kind="captions" label="Hello World!" />
      </audio>
    );
  }
}
