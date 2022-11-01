import { FC } from 'react'

export const Blast: FC<{
  className?: string
}> = ({ className = '' }) => {
  return (
    <svg
      width="24"
      height="24"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M7.197 0 12.7 6.323 22.059.9l-5.045 9.903L24 12l-6.75 4.724L24 24l-10.646-4.62-6.791 4.437v-5.955L0 18.4l4.387-6.087L0 6.97l6.882.918L7.197 0Zm4.632 10.258L9.893 7.667l-.145 3.63-4.82-1.04 4.07 2.514L4.11 16.33 9 15.25l-.6 4.86 3.52-3.376 3.232.699-1.961-2.183 3.113-1.526-2.949-1.221 3.895-6.18-5.42 3.935Z"
        fill="currentColor"
        fillRule="nonzero"
      />
    </svg>
  )
}
