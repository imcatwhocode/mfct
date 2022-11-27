import { BLOCK_SIZE, SECTOR_SIZE } from '../constants';

export function splitBuffer(buffer: Uint8Array, chunkSize: number) {
  if (chunkSize <= 0) { throw new TypeError('Chunk size must be positive integer'); }

  const result = [];
  const len = buffer.length;

  let i = 0;
  while (i < len) {
    result.push(buffer.slice(i, (i += chunkSize)));
  }

  return result;
}

export function splitSectors(buffer: Uint8Array, sectorSize = SECTOR_SIZE) {
  return splitBuffer(buffer, sectorSize).map((sector) => splitBuffer(sector, BLOCK_SIZE));
}
