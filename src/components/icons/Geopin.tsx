import { FC, SVGAttributes } from 'react'

export const Geopin: FC<{
  className?: SVGAttributes<SVGSVGElement>['className']
}> = ({ className = '' }) => (
  <svg
    width="24"
    height="29"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <g transform="translate(0 1)" fill="none" fillRule="evenodd">
      <path d="M0 0h24v24H0z" />
      <circle
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        cx="12"
        cy="11"
        r="4"
      />
      <path
        d="m11.982 24.979-7.053-6.986a9.922 9.922 0 0 1 0-14.078c3.905-3.887 10.237-3.887 14.142 0a9.922 9.922 0 0 1 0 14.078l-7.089 6.986Z"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </g>
  </svg>
)
