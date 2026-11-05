import {
  getNearestSnapIndex,
  getSnapInputRange,
  resolveSnapOffsets,
} from '../components/ImageCarousel/helpers';

describe('ImageCarousel helpers', () => {
  it('returns no offsets until the container is measured', () => {
    expect(
      resolveSnapOffsets({
        itemCount: 3,
        containerWidth: 0,
        cardWidth: 100,
        cardSpacing: 10,
      }),
    ).toEqual([]);
  });

  it('clamps first and last offsets to the scrollable range', () => {
    const offsets = resolveSnapOffsets({
      itemCount: 3,
      containerWidth: 300,
      cardWidth: 100,
      cardSpacing: 10,
    });

    expect(offsets[0]).toBe(0);
    expect(offsets[2]).toBe(30);
  });

  it('finds the nearest snap index', () => {
    expect(getNearestSnapIndex([0, 110, 220], 100)).toBe(1);
    expect(getNearestSnapIndex([], 100)).toBe(0);
  });

  it('builds a strictly increasing input range', () => {
    expect(getSnapInputRange([0, 0, 50], 0, 110)).toEqual([-110, 0, 110]);
    expect(getSnapInputRange([0, 50], 1, 110)).toEqual([0, 50, 160]);
  });
});
