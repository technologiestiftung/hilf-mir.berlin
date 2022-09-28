import { mapRawQueryToState } from '.'

describe('mapRawQueryToState', () => {
  test('happy path', () => {
    const testLat = 12.452632
    const testLng = 13.123456
    const testZoom = 10
    const testTags = [1, 2, 3, 4]

    const queryState = mapRawQueryToState({
      latitude: `${testLat}`,
      longitude: `${testLng}`,
      zoom: `${testZoom}`,
      tags: testTags.map((id) => id.toString()),
    })

    expect(queryState.latitude).toBe(testLat)
    expect(queryState.longitude).toBe(testLng)
    expect(queryState.zoom).toBe(testZoom)
    expect(queryState.tags).toMatchObject(testTags)
  })

  test('should rerun undefined with invalid numbers', () => {
    const queryState = mapRawQueryToState({
      latitude: 'absc',
      longitude: '[absc,1,null]',
      zoom: 'NaN',
    })

    expect(queryState.latitude).toBe(undefined)
    expect(queryState.longitude).toBe(undefined)
    expect(queryState.zoom).toBe(undefined)
    expect(
      mapRawQueryToState({
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignoressss
        latitude: {},
      }).tags
    ).toBe(undefined)
  })

  test('should return undefined when tags is not an array', () => {
    expect(
      mapRawQueryToState({
        tags: '{}',
      }).tags
    ).toBe(undefined)
  })
  test('should return an array of numbers for tags', () => {
    expect(
      mapRawQueryToState({
        tags: ['1', '2', '3', '4'],
      }).tags
    ).toMatchObject([1, 2, 3, 4])
  })

  test('should return undefined if the tags array could not be parsed', () => {
    expect(
      mapRawQueryToState({
        tags: '[1,null,undefined,aa]',
      }).tags
    ).toBe(undefined)
  })
  test('should filter out tags that are not valid', () => {
    expect(
      mapRawQueryToState({
        tags: ['1', 'null', 'aa'],
      }).tags
    ).toMatchObject([1])
  })
})
