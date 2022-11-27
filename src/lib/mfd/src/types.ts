export type Block = Uint8Array;
export type Sector = Block[];

export type ManufacturerBlock = {
  uid: Uint8Array;
  bcc: number;
  sak: number;
  ataq: number;
  data: Uint8Array;
};

export type AccessBitsTuple = {
  C1: boolean;
  C2: boolean;
  C3: boolean;
};

export type AccessBits = Set<AccessBitsTuple>;

export type SectorTrailer = {
  keyA: Uint8Array;
  keyB: Uint8Array;
  accessBits: AccessBits;
};

export interface IMFD {
  getSector: (index: number) => Sector | undefined;
  getSectors: () => Sector[];
  getManufacturerBlock: () => ManufacturerBlock;
  getSectorTrailerData: (index: number) => SectorTrailer;
}
