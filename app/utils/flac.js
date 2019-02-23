// flac的格式详情请见请见https://xiph.org/flac/format.html

// 从二进制字节流中读取数据，默认是对数组的操作方式
function readDataImpl(data, index) {
  return data[index];
}

// 从二进制字节流中分割一部分，不可以修改原字节流，只能返回一个新的同类型数据
// 默认的实现就是操作数组
function sliceDataImpl(data, start, end) {
  return data.slice(start, end);
}

export default function getDecoder({
  readData = readDataImpl,
  sliceData = sliceDataImpl
} = {}) {
  return function decoder(data) {
    if (String.fromCodePoint.apply(null, fromTo(data, 0, 4)) !== 'fLaC') {
      throw Error('This is not a flac file');
    }
    let nextMetaBlock = null;
    const pictures = [];

    do {
      nextMetaBlock = getNextMetaBlock(
        data,
        nextMetaBlock ? nextMetaBlock.nextIndex : 4
      );

      switch (nextMetaBlock.blockType) {
        case 6:
          pictures.push(
            parsePictureBody(
              data,
              nextMetaBlock.nextIndex - nextMetaBlock.bodyLength
            )
          );
          break;
        default:
          break;
      }
    } while (nextMetaBlock.lastMetaFlag !== '1');

    return { pictures };
  };

  function getNextMetaBlock(data, index) {
    const firstByte = num2bit(readData(data, index));
    const lastMetaFlag = firstByte.substring(0, 1);
    const blockType = parseInt(firstByte.substring(1, 8), 2);
    const bodyLength = readByte(fromTo(data, index + 1, index + 4));

    return {
      lastMetaFlag,
      blockType,
      bodyLength,
      nextIndex: index + 4 + bodyLength
    };
  }

  function parsePictureBody(data, start) {
    let index = start;
    const pictureType = readByte(fromTo(data, index, (index += 4)));

    const mimeTypeLength = readByte(fromTo(data, index, (index += 4)));

    const mimeType = String.fromCodePoint.apply(
      null,
      fromTo(data, index, (index += mimeTypeLength))
    );

    const descLength = readByte(fromTo(data, index, (index += 4)));

    const desc = String.fromCodePoint.apply(
      null,
      fromTo(data, index, (index += descLength))
    );

    const width = readByte(fromTo(data, index, (index += 4)));
    const height = readByte(fromTo(data, index, (index += 4)));

    const colorDepth = readByte(fromTo(data, index, (index += 4)));
    const colorIndex = readByte(fromTo(data, index, (index += 4)));

    const picSize = readByte(fromTo(data, index, (index += 4)));

    const picture = sliceData(data, index, index + picSize);

    return {
      pictureType,
      mimeType,
      desc,
      width,
      height,
      colorDepth,
      colorIndex,
      picSize,
      picture
    };
  }

  function fromTo(data, start, end) {
    const ary = [];

    for (let i = start; i < end; i += 1) {
      ary.push(readData(data, i));
    }

    return ary;
  }
}

function num2bit(num) {
  return num.toString(2).padStart(8, '0');
}

function readByte(bytes, radix = 2) {
  return parseInt(bytes.map(num2bit).join(''), radix);
}
