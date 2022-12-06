import { useWindowSize } from './useWindowSize'

export const MOBILE_BREAKPOINT = 1024

export const useIsMobile = (): boolean => {
  const { width } = useWindowSize()
  return Boolean(width && width <= MOBILE_BREAKPOINT)
}
