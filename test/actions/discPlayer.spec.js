import * as actions from '../../app/actions/discPlayer';

describe('actions', () => {
  it('should discStartSpin should create discStartSpin action', () => {
    expect(actions.discStartSpin()).toMatchSnapshot();
  });

  it('should discStopSpin should create discStopSpin action', () => {
    expect(actions.discStopSpin()).toMatchSnapshot();
  });

  it('should rodOn should create rodOn action', () => {
    expect(actions.rodOn()).toMatchSnapshot();
  });

  it('should rodOff should create rodOff action', () => {
    expect(actions.rodOff()).toMatchSnapshot();
  });

  it('should changeDisc should create changeDisc action', () => {
    expect(actions.changeDisc('233')).toMatchSnapshot();
  });

  it('should changeSoundTrack should create changeSoundTrack action', () => {
    expect(actions.changeSoundTrack('233')).toMatchSnapshot();
  });

  it('should changeTitle should create changeTitle action', () => {
    expect(actions.changeTitle('233')).toMatchSnapshot();
  });
});
