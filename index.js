const fs = require('fs')
const util = require('util')

const readFile = util.promisify(fs.readFile)

const sampleFile = './sample.mp4'

const chunkTypes = ['ftyp', 'mdat', 'moov', 'pnot', 'udta', 'uuid', 'moof', 'free', 'skip', 'jP2 ', 'wide', 'load', 'ctab', 'imap', 'matt', 'kmat', 'clip', 'crgn', 'sync', 'chap', 'tmcd', 'scpt', 'ssrc', 'PICT']
const getUncorruptedSize = (mp4) => {
  const len = mp4.length
  let offset = 0
  while (offset + 7 < len) {
    let chunkSize = 0
    let chunkType = ''
    for (let i = 0; i < 4; i++) {
      chunkSize = (chunkSize << 8) | mp4[offset + i]
      chunkType += String.fromCharCode(mp4[offset + 4 + i])
    }
    if (!chunkTypes.includes(chunkType) || offset + chunkSize > len) {
      return offset
    }
    offset += chunkSize
  }
  return offset
}

const getUncorruptedPart = (mp4) => {
  const uncorruptedSize = getUncorruptedSize(mp4)
  return new Uint8Array(uncorruptedSize).map((zero, i) => mp4[i])
}

const main = async () => {
  const mp4String = await readFile(sampleFile, 'binary')
  const mp4StringWithExtraBytes = mp4String + 'lorem ipsum'
  const mp4StringWithFewerBytes = mp4String.substr(0, mp4String.length - 10)

  const mp4 = {
    original: Buffer.from(mp4String, 'binary'),
    extraBytes: Buffer.from(mp4StringWithExtraBytes, 'binary'),
    fewerBytes: Buffer.from(mp4StringWithFewerBytes, 'binary')
  }

  for (const [k, v] of Object.entries(mp4)) {
    const uncorruptedSize = getUncorruptedSize(v)
    const fileSize = v.length
    const uncorruptedFile = getUncorruptedPart(v)
    console.log(`# ${k}: Uncorrupted size: ${uncorruptedSize}, file size: ${fileSize}`)
  }
}

main()
