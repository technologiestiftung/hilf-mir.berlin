export type ViewportProps = Partial<{
  width: number
  height: number
  latitude: number
  longitude: number
  zoom: number
  bearing: number
  pitch: number
  altitude: number
  maxZoom: number
  minZoom: number
  maxPitch: number
  minPitch: number
  transitionDuration: number | 'auto'
  transitionEasing: (t: number) => number
  transitionInterpolator: unknown
  transitionInterruption: number
}>

export type URLViewportType = Pick<
  ViewportProps,
  'latitude' | 'longitude' | 'zoom'
>
