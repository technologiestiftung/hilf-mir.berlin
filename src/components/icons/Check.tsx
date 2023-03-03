import { FC } from 'react'

export const Check: FC<{
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
      <polyline
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        points="1.54 13.361 10.968 21.797 22.795 5.239"
      />
    </svg>
  )
}
