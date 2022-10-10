import { FC } from 'react'

export const Info: FC<{
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
        <circle
          stroke="currentColor"
          strokeWidth="3"
          cx="12"
          cy="12"
          r="10.5"
        />
        <path
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="square"
          strokeLinejoin="round"
          d="M12 7h.01M10 11h2v6h2"
        />
      </g>
    </svg>
  )
}
