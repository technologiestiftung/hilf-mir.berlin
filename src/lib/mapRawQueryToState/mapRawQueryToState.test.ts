import { mapRawQueryToState } from '.'

describe('mapRawQueryToState', () => {
  test('happy path', () => {
    const testLat = 12.452632
    const testLng = 13.123456
    const testZoom = 10
    const testFilters = [1, 2, 3, 4]

    const queryState = mapRawQueryToState({
      latitude: `${testLat}`,
      longitude: `${testLng}`,
      zoom: `${testZoom}`,
      filters: testFilters.map((id) => id.toString()),
    })

    expect(queryState.latitude).toBe(testLat)
    expect(queryState.longitude).toBe(testLng)
    expect(queryState.zoom).toBe(testZoom)
    expect(queryState.filters).toMatchObject(testFilters)
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
      }).filters
    ).toBe(undefined)
  })

  test('should return undefined when filters is not an array', () => {
    expect(
      mapRawQueryToState({
        filters: '{}',
      }).filters
    ).toBe(undefined)
  })
  test('should return an array of numbers for filters', () => {
    expect(
      mapRawQueryToState({
        filters: ['1', '2', '3', '4'],
      }).filters
    ).toMatchObject([1, 2, 3, 4])
  })

  test('should return undefined if the filters array could not be parsed', () => {
    expect(
      mapRawQueryToState({
        filters: '[1,null,undefined,aa]',
      }).filters
    ).toBe(undefined)
  })
  test('should filter out filter items that are not valid', () => {
    expect(
      mapRawQueryToState({
        filters: ['1', 'null', 'aa'],
      }).filters
    ).toMatchObject([1])
  })
})
