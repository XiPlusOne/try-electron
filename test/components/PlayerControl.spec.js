import { spy } from 'sinon';
import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import renderer from 'react-test-renderer';
import PlayerControl from '../../app/components/PlayerControl';

Enzyme.configure({ adapter: new Adapter() });

describe('PlayerControl component', () => {
  it('should match exact snapshot', () => {
    const onToggleCallback = spy();
    const playerControl = (
      <PlayerControl playing={false} onToggleCallback={onToggleCallback} />
    );
    const tree = renderer.create(playerControl).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('should toggle button should call onToggleCallback', () => {
    const onToggleCallback = spy();
    const component = shallow(
      <PlayerControl playing={false} onToggleCallback={onToggleCallback} />
    );

    const toggleButton = component.find('button').at(0);
    expect(toggleButton.hasClass('paused')).toBe(true);
    toggleButton.simulate('click');
    expect(onToggleCallback.called).toBe(true);
  });

  it('should toggle button should have a class named paused', () => {
    const component = shallow(<PlayerControl playing={false} />);
    const toggleButton = component.find('button').at(0);

    expect(toggleButton.hasClass('paused')).toBe(true);
  });

  it('should toggle button should have a class named playing', () => {
    const component = shallow(<PlayerControl playing />);
    const toggleButton = component.find('button').at(0);

    expect(toggleButton.hasClass('playing')).toBe(true);
  });
});
