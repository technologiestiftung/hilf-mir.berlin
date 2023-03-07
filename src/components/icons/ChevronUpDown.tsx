import { FC } from 'react'

export const ChevronUpDown: FC<{
  className?: string
}> = ({ className = '' }) => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <g fill="none" fillRule="evenodd">
        <polyline
          stroke="currentColor"
          strokeWidth="3"
          points="7.014 5 17.153 5 17.153 15"
          transform="rotate(-45 12.084 10)"
        />
        <polyline
          stroke="currentColor"
          strokeWidth="3"
          points="7.014 9 17.153 9 17.153 19"
          transform="rotate(135 12.084 14)"
        />
      </g>
    </svg>
  )
}
