import React from 'react';
import styles from './Rod.less';

type Props = {
  painter: {
    paint: HTMLCanvasElement => void
  },
  style?: Object,
  isRodOn?: boolean,
  rodOnCallback?: () => void,
  rodOffCallback?: () => void
};

export default class Rod extends React.PureComponent {
  props: Props;

  static defaultProps = {
    style: null,
    isRodOn: false,
    rodOnCallback: null,
    rodOffCallback: null
  };

  constructor(props) {
    super(props);

    this.refCanvas = React.createRef();
    this.onTransitionEnd = this.onTransitionEnd.bind(this);
  }

  componentDidMount() {
    const { painter } = this.props;

    painter.paint(this.refCanvas.current);
  }

  onTransitionEnd() {
    const { isRodOn, rodOnCallback, rodOffCallback } = this.props;

    if (typeof rodOnCallback === 'function' && isRodOn) {
      rodOnCallback();
    }

    if (typeof rodOffCallback === 'function' && !isRodOn) {
      rodOffCallback();
    }
  }

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
