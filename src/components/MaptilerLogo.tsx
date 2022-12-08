import { FC } from 'react'

export const MapTilerLogo: FC = () => {
  return (
    <div className="fixed left-0 lg:left-sidebarW pl-3 bottom-1.5 pointer-events-none">
      <a href="https://www.maptiler.com" className="pointer-events-auto">
        <img
          src="https://api.maptiler.com/resources/logo.svg"
          alt="MapTiler Logo"
        />
      </a>
    </div>
  )
}
