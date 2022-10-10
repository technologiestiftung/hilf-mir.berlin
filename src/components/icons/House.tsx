import { FC } from 'react'

export const House: FC<{
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
          d="m12 4.024 9.577 8.21V22.5H2.423V12.233L12 4.024Z"
          stroke="currentColor"
          strokeWidth="3"
        />
        <path
          d="M11.5 14.577V20.5H7.885v-5.923H11.5Z"
          stroke="currentColor"
          fill="currentColor"
        />
      </g>
    </svg>
  )
}
