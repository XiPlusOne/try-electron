// @flow
// todo 进行单元测试

type Radian = number;
type Size = number;

type Coordinate = {
  x: number,
  y: number
};

type Config = {
  // 画布的宽度
  canvasWidth?: Size,
  // 画布的高度
  canvasHeight?: Size,
  // 探针与纵轴之间的弧度差
  radian?: Radian,
  // 探针第一段的长度(px)
  rodFirstSectionLength?: Size,
  // 探针第二段的长度(px)
  rodSecondSectionLength?: Size,
  // 探针的宽度(px)
  rodWidth?: Size,
  // 探针弯曲的弧度
  curveRadian?: Radian,
  // 探针弯曲的半径(px)
  curveRadius?: Size,
  // 针头第一段宽度
  pinheadFirstSectionWidth?: Size,
  // 针头第一段长度
  pinheadFirstSectionLength?: Size,
  // 针头第二段宽度
  pinheadSecondSectionWidth?: Size,
  // 针头第二段长度
  pinheadSecondSectionLength?: Size
};

export default function createPainter({
  canvasWidth = 600,
  canvasHeight = 250,
  radian = Math.PI / 4,
  rodFirstSectionLength = 100,
  rodSecondSectionLength = 60,
  rodWidth = 7.5,
  curveRadian = Math.PI / 6,
  curveRadius = 100,
  pinheadFirstSectionWidth = 15,
  pinheadFirstSectionLength = 40,
  pinheadSecondSectionWidth = 22.5,
  pinheadSecondSectionLength = 20
}: Config = {}) {
  return {
    paint(canvas: HTMLCanvasElement) {
      /* eslint-disable */
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
      /* eslint-enable */

      const ctx: CanvasRenderingContext2D = canvas.getContext('2d');

      // 绘制弯曲的把手
      ctx.beginPath();

      const firstSectionLeftLineStart: Coordinate = {
        x: canvasWidth / 2 - rodWidth / 2,
        y: 0
      };
      ctx.moveTo(firstSectionLeftLineStart.x, firstSectionLeftLineStart.y);

      const firstSectionLeftLineEnd: Coordinate = {
        x:
          firstSectionLeftLineStart.x +
          Math.sin(radian) * rodFirstSectionLength,
        y:
          firstSectionLeftLineStart.y + Math.cos(radian) * rodFirstSectionLength
      };

      const curveCenter: Coordinate = {
        x: firstSectionLeftLineEnd.x + Math.cos(radian) * curveRadius,
        y: firstSectionLeftLineEnd.y - Math.sin(radian) * curveRadius
      };

      ctx.arc(
        curveCenter.x,
        curveCenter.y,
        curveRadius,
        Math.PI - radian,
        Math.PI - radian - curveRadian,
        true
      );

      const curveLeftLineEnd: Coordinate = {
        x: curveCenter.x - Math.cos(radian + curveRadian) * curveRadius,
        y: curveCenter.y + Math.sin(radian + curveRadian) * curveRadius
      };

      const secondSectionLeftLineEnd: Coordinate = {
        x:
          curveLeftLineEnd.x +
          Math.sin(radian + curveRadian) * rodSecondSectionLength,
        y:
          curveLeftLineEnd.y +
          Math.cos(radian + curveRadian) * rodSecondSectionLength
      };
      ctx.lineTo(secondSectionLeftLineEnd.x, secondSectionLeftLineEnd.y);

      const curveRightLineEnd: Coordinate = {
        x:
          curveCenter.x -
          Math.cos(radian + curveRadian) * (curveRadius - rodWidth),
        y:
          curveCenter.y +
          Math.sin(radian + curveRadian) * (curveRadius - rodWidth)
      };
      const secondSectionRightLineEnd: Coordinate = {
        x:
          curveRightLineEnd.x +
          Math.sin(radian + curveRadian) * rodSecondSectionLength,
        y:
          curveRightLineEnd.y +
          Math.cos(radian + curveRadian) * rodSecondSectionLength
      };
      ctx.lineTo(secondSectionRightLineEnd.x, secondSectionRightLineEnd.y);

      ctx.arc(
        curveCenter.x,
        curveCenter.y,
        curveRadius - rodWidth,
        Math.PI - radian - curveRadian,
        Math.PI - radian
      );

      const firstSectionRightLineStart: Coordinate = {
        x: canvasWidth / 2 + rodWidth / 2,
        y: 0
      };
      ctx.lineTo(firstSectionRightLineStart.x, firstSectionRightLineStart.y);
      ctx.lineTo(firstSectionLeftLineStart.x, firstSectionLeftLineStart.y);

      ctx.fillStyle = '#fff';
      ctx.fill();

      // 绘制针头第一段
      ctx.beginPath();

      const pinheadFirstSectionLeftTopCorner: Coordinate = {
        x:
          secondSectionRightLineEnd.x +
          Math.cos(radian + curveRadian) *
            (pinheadFirstSectionWidth / 2 - rodWidth / 2),
        y:
          secondSectionRightLineEnd.y -
          Math.sin(radian + curveRadian) *
            (pinheadFirstSectionWidth / 2 - rodWidth / 2)
      };
      ctx.moveTo(
        pinheadFirstSectionLeftTopCorner.x,
        pinheadFirstSectionLeftTopCorner.y
      );
      const pinheadFirstSectionLeftBottomCorner: Coordinate = {
        x:
          secondSectionRightLineEnd.x -
          Math.cos(radian + curveRadian) *
            (pinheadFirstSectionWidth / 2 + rodWidth / 2),
        y:
          secondSectionRightLineEnd.y +
          Math.sin(radian + curveRadian) *
            (pinheadFirstSectionWidth / 2 + rodWidth / 2)
      };
      ctx.lineTo(
        pinheadFirstSectionLeftBottomCorner.x,
        pinheadFirstSectionLeftBottomCorner.y
      );
      const pinheadFirstSectionRightBottomCorner: Coordinate = {
        x:
          pinheadFirstSectionLeftBottomCorner.x +
          Math.sin(radian + curveRadian) * pinheadFirstSectionLength,
        y:
          pinheadFirstSectionLeftBottomCorner.y +
          Math.cos(radian + curveRadian) * pinheadFirstSectionLength
      };
      ctx.lineTo(
        pinheadFirstSectionRightBottomCorner.x,
        pinheadFirstSectionRightBottomCorner.y
      );
      const pinheadFirstSectionRightTopCorner: Coordinate = {
        x:
          pinheadFirstSectionLeftTopCorner.x +
          Math.sin(radian + curveRadian) * pinheadFirstSectionLength,
        y:
          pinheadFirstSectionLeftTopCorner.y +
          Math.cos(radian + curveRadian) * pinheadFirstSectionLength
      };
      ctx.lineTo(
        pinheadFirstSectionRightTopCorner.x,
        pinheadFirstSectionRightTopCorner.y
      );

      ctx.fill();

      // 绘制针头第二段
      ctx.beginPath();

      const pinheadSecondSectionLeftTopCorner: Coordinate = {
        x:
          pinheadFirstSectionRightTopCorner.x +
          Math.cos(radian + curveRadian) *
            (pinheadSecondSectionWidth / 2 - pinheadFirstSectionWidth / 2),
        y:
          pinheadFirstSectionRightTopCorner.y -
          Math.sin(radian + curveRadian) *
            (pinheadSecondSectionWidth / 2 - pinheadFirstSectionWidth / 2)
      };
      ctx.moveTo(
        pinheadSecondSectionLeftTopCorner.x,
        pinheadSecondSectionLeftTopCorner.y
      );
      const pinheadSecondSectionLeftBottomCorner: Coordinate = {
        x:
          pinheadFirstSectionRightTopCorner.x -
          Math.cos(radian + curveRadian) *
            (pinheadSecondSectionWidth / 2 + pinheadFirstSectionWidth / 2),
        y:
          pinheadFirstSectionRightTopCorner.y +
          Math.sin(radian + curveRadian) *
            (pinheadSecondSectionWidth / 2 + pinheadFirstSectionWidth / 2)
      };
      ctx.lineTo(
        pinheadSecondSectionLeftBottomCorner.x,
        pinheadSecondSectionLeftBottomCorner.y
      );
      const pinheadSecondSectionRightBottomCorner: Coordinate = {
        x:
          pinheadSecondSectionLeftBottomCorner.x +
          Math.sin(radian + curveRadian) * pinheadSecondSectionLength,
        y:
          pinheadSecondSectionLeftBottomCorner.y +
          Math.cos(radian + curveRadian) * pinheadSecondSectionLength
      };
      ctx.lineTo(
        pinheadSecondSectionRightBottomCorner.x,
        pinheadSecondSectionRightBottomCorner.y
      );
      const pinheadSecondSectionRightTopCorner: Coordinate = {
        x:
          pinheadSecondSectionLeftTopCorner.x +
          Math.sin(radian + curveRadian) * pinheadSecondSectionLength,
        y:
          pinheadSecondSectionLeftTopCorner.y +
          Math.cos(radian + curveRadian) * pinheadSecondSectionLength
      };
      ctx.lineTo(
        pinheadSecondSectionRightTopCorner.x,
        pinheadSecondSectionRightTopCorner.y
      );

      ctx.fill();
    }
  };
}
