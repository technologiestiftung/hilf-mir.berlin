import { FC } from 'react'

export const List: FC<{
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
          fill="currentColor"
          d="M2 5h3v3H2zM2 11h3v3H2zM2 17h3v3H2zM7 5h15v3H7zM7 11h15v3H7zM7 17h15v3H7z"
        />
      </g>
    </svg>
  )
}
