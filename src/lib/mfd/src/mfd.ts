import {
  BLOCK_SIZE,
  MFC_1K_BLOCKS,
  MFC_2K_BLOCKS,
  SECTOR_BLOCKS,
  SECTOR_EXT_SIZE,
} from './constants';
import { type IMFD } from './types';
import byteToBitmap from './utils/byte-to-bitmap';
import { splitSectors } from './utils/split';

class MFD implements IMFD {
  private readonly content: Uint8Array;

  private readonly type: 'MFC_1K' | 'MFC_2K' | 'MFC_4K';

  constructor(content: Buffer | Uint8Array) {
    this.content = new Uint8Array(content);
    switch (content.length) {
      case 1024:
        this.type = 'MFC_1K';
        break;
      case 2048:
        this.type = 'MFC_2K';
        break;
      case 4096:
        this.type = 'MFC_4K';
        break;
      default:
        throw new TypeError(`Unsupported MFD file size: ${content.length}`);
    }
  }

  getSectorTrailerData(index: number) {
    const sector = this.getSector(index);
    const block = index < MFC_1K_BLOCKS ? sector[3] : sector[15];

    const accessBits = block.slice(6, 10);
    const [C13, C12, C11, C10] = byteToBitmap(accessBits[1]);
    const [C33, C32, C31, C30, C23, C22, C21, C20] = byteToBitmap(
      accessBits[2],
    );

    return {
      keyA: block.slice(0, 6),
      keyB: block.slice(10, 16),
      accessBits: new Set([
        { C1: C10, C2: C20, C3: C30 },
        { C1: C11, C2: C21, C3: C31 },
        { C1: C12, C2: C22, C3: C32 },
        { C1: C13, C2: C23, C3: C33 },
      ]),
    };
  }

  getSectors() {
    if (this.type === 'MFC_1K' || this.type === 'MFC_2K') {
      return splitSectors(this.content);
    }

    // MFC 4K sectors [0:31] consists of four blocks each
    const sectors = splitSectors(
      this.content.slice(0, BLOCK_SIZE * SECTOR_BLOCKS * MFC_2K_BLOCKS),
    );

    // ... and sectors [32:39] consists of sixteen blocks each
    splitSectors(
      this.content.slice(BLOCK_SIZE * SECTOR_BLOCKS * MFC_2K_BLOCKS),
      SECTOR_EXT_SIZE,
    ).forEach((sector) => sectors.push(sector));
    return sectors;
  }

  getSector(index: number) {
    // Yeah, I know, it might be better, but I've kept things DRY.
    // Computational complexity of MFD.getSectors() is very low, so it's permissible
    return this.getSectors()[index];
  }

  getManufacturerBlock() {
    const block = this.getSector(0)[0];
    return {
      uid: block.slice(0, 4),
      bcc: block[4],
      sak: block[5],
      ataq: block[6],
      data: block.slice(7, 16),
    };
  }
}

export default MFD;
