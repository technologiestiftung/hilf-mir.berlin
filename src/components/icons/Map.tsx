import { FC } from 'react'

export const Map: FC<{
  className?: string
}> = ({ className = '' }) => {
  return (
    <svg
      width="24"
      height="24"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <g fill="none" fillRule="evenodd">
        <path d="M0 1h24v23H0z" />
        <path
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="square"
          d="m8.5 3 7 3.563L22.5 3v15.438L15.5 22l-7-3.563L1.5 22V6.562zM8.5 4.5V18M15.5 7.5V21"
        />
      </g>
    </svg>
  )
}
