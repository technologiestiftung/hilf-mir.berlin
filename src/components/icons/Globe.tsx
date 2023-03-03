import { FC, SVGAttributes } from 'react'

export const Globe: FC<{
  className?: SVGAttributes<SVGSVGElement>['className']
}> = ({ className = '' }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <g fill="none" fillRule="evenodd">
      <path d="M0 0h24v24H0z" />
      <circle stroke="currentColor" strokeWidth="3" cx="12" cy="12" r="10.5" />
      <path
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.667 9.129h18.666M2.667 14.871h18.666M11.444 2a18.889 18.889 0 0 0 0 20M12.556 2a18.889 18.889 0 0 1 0 20"
      />
    </g>
  </svg>
)
