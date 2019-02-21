// flac的格式详情请见请见https://xiph.org/flac/format.html

export default function extract(data) {
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
}

function getNextMetaBlock(data, index) {
  const firstByte = num2bit(data[index]);
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

  const picture = data.slice(index, index + picSize);

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

function num2bit(num) {
  return num.toString(2).padStart(8, '0');
}

function fromTo(data, start, end) {
  const ary = [];

  for (let i = start; i < end; i += 1) {
    ary.push(data[i]);
  }

  return ary;
}

function readByte(bytes, radix = 2) {
  return parseInt(bytes.map(num2bit).join(''), radix);
}
