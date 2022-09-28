import { FC, SVGAttributes } from 'react'

export const Email: FC<{
  className?: SVGAttributes<SVGSVGElement>['className']
}> = ({ className = '' }) => (
  <svg
    width="26"
    height="26"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <g fill="none" fillRule="evenodd">
      <path d="M1 1h24v24H1z" />
      <path
        d="M13 18a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z"
        stroke="currentColor"
        strokeWidth="3.24"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="m18 13.014-.111 1.833a3.055 3.055 0 0 0 6.111 0v-1.833a11 11 0 1 0-6.722 10.12"
        stroke="currentColor"
        strokeWidth="3.24"
        strokeLinejoin="round"
      />
    </g>
  </svg>
)
