/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { useEffect } from 'react'

export const useMatomo = (): void => {
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const _paq = (window._paq = window._paq || [])
    /* tracker methods like "setCustomDimension" should be called before "trackPageView" */
    _paq.push(['trackPageView'])
    _paq.push(['enableLinkTracking'])
    _paq.push(['requireCookieConsent'])
    ;(function () {
      const u = 'https://piwik.technologiestiftung-berlin.de/'
      _paq.push(['setTrackerUrl', u + 'matomo.php'])
      _paq.push(['setSiteId', '28'])
      const d = document,
        g = d.createElement('script'),
        s = d.getElementsByTagName('script')[0]
      g.async = true
      g.src = u + 'matomo.js'
      s.parentNode?.insertBefore(g, s)
    })()
  }, [])
}
