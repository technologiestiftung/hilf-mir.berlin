import { useWindowSize } from './useWindowSize'

export const useIsMobile = (): boolean => {
  const { width } = useWindowSize()
  return Boolean(width && width <= 768)
}
