import { FC } from 'react'

export const Cross: FC<{
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
        <path d="M0 0h24v24H0z" />
        <path
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="square"
          d="m3.5 3.5 16.971 16.971M20.5 3.5 3.529 20.471"
        />
      </g>
    </svg>
  )
}
