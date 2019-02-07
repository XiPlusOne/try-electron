// @flow
import React from 'react';
import styles from './Rod.less';

type Props = {
  painter: {
    paint: HTMLCanvasElement => void
  },
  style?: {},
  isRodOn?: boolean,
  rodOnCallback?: ?() => void,
  rodOffCallback?: ?() => void
};

export default class Rod extends React.PureComponent<Props> {
  refCanvas: $Call<typeof React.createRef>;

  static defaultProps = {
    style: null,
    isRodOn: false,
    rodOnCallback: null,
    rodOffCallback: null
  };

  constructor(props: Props) {
    super(props);

    this.refCanvas = React.createRef();
  }

  componentDidMount() {
    const { painter } = this.props;
    const { current } = this.refCanvas;
    if (current) {
      painter.paint(current);
    }
  }

  onTransitionEnd = () => {
    const { isRodOn, rodOnCallback, rodOffCallback } = this.props;

    if (typeof rodOnCallback === 'function' && isRodOn) {
      rodOnCallback();
    }

    if (typeof rodOffCallback === 'function' && !isRodOn) {
      rodOffCallback();
    }
  };

  render() {
    const { isRodOn, style } = this.props;

    return (
      <div className={styles.probe} style={style}>
        <b />
        <canvas
          ref={this.refCanvas}
          className={isRodOn ? styles.on : styles.off}
          onTransitionEnd={this.onTransitionEnd}
        />
      </div>
    );
  }
}
