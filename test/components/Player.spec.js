import { spy } from 'sinon';
import React from 'react';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import renderer from 'react-test-renderer';
import Player from '../../app/components/Player';

Enzyme.configure({ adapter: new Adapter() });

/* eslint-disable */
class AudioContext {
  createMediaElementSource() {
    return new MediaElementAudioSourceNode();
  }
}

class MediaElementAudioSourceNode {
  connect() {}
}
/* eslint-enable */

// todo 完善这个组件的单元测试
describe('Player component', () => {
  beforeAll(() => {
    if (typeof global.AudioContext !== 'function') {
      global.AudioContext = AudioContext;
    }

    if (typeof global.MediaElementAudioSourceNode !== 'function') {
      global.MediaElementAudioSourceNode = MediaElementAudioSourceNode;
    }
  });

  afterAll(() => {
    if (global.AudioContext === AudioContext) {
      delete global.AudioContext;
    }

    if (global.MediaElementAudioSourceNode === MediaElementAudioSourceNode) {
      delete global.MediaElementAudioSourceNode;
    }
  });

  it('should match exact snapshot', () => {
    const onMusicEnd = spy();
    const player = <Player isPlaying={false} onMusicEnd={onMusicEnd} />;
    const tree = renderer.create(player).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
