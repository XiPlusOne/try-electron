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
});
