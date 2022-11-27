export default function byteToBitmap(x: number) : boolean[] {
  const result = [] as boolean[];
  for (let i = 7; i >= 0; i -= 1) {
    // eslint-disable-next-line no-bitwise
    result.push(!!((x >> i) & 1));
  }
  return result;
}
