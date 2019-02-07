import { spy } from 'sinon';
import React from 'react';
import Enzyme, { shallow, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import renderer from 'react-test-renderer';
import Rod from '../../app/components/Rod';

Enzyme.configure({ adapter: new Adapter() });

describe('Rod component', () => {
  const painter = {
    paint() {}
  };

  it('should match exact snapshot', () => {
    const rod = <Rod painter={painter} />;
    const tree = renderer.create(rod).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('should painter should paint a rod', () => {
    const spyPainter = {
      paint: spy()
    };
    const component = mount(<Rod painter={spyPainter} />);

    expect(spyPainter.paint.called).toBe(true);
    component.unmount();
  });

  it('should canvas should has a class named on if rod is on', () => {
    const component = shallow(<Rod painter={painter} isRodOn />);

    const canvas = component.find('canvas').at(0);
    expect(canvas.hasClass('on')).toBe(true);
  });

  it('should canvas should has a class named off if rod is not on', () => {
    const component = shallow(<Rod painter={painter} isRodOn={false} />);

    const canvas = component.find('canvas').at(0);
    expect(canvas.hasClass('off')).toBe(true);
  });

  it('should canvas should call rodOnCallback if rod is on after transition is over', () => {
    const rodOnCallback = spy();
    const component = shallow(
      <Rod painter={painter} rodOnCallback={rodOnCallback} isRodOn />
    );

    const canvas = component.find('canvas').at(0);
    canvas.simulate('transitionend');
    expect(rodOnCallback.called).toBe(true);
  });

  it('should canvas should call rodOffCallback if rod is not on after transition is over', () => {
    const rodOffCallback = spy();
    const component = shallow(
      <Rod painter={painter} rodOffCallback={rodOffCallback} isRodOn={false} />
    );

    const canvas = component.find('canvas').at(0);
    canvas.simulate('transitionend');
    expect(rodOffCallback.called).toBe(true);
  });
});
