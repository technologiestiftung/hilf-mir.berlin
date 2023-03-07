import { FC, SVGAttributes } from 'react'

export const Phone: FC<{
  className?: SVGAttributes<SVGSVGElement>['className']
}> = ({ className = '' }) => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 28 28"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <defs>
      <path
        d="m8.47 0 2.824 7.059-3.53 2.117a15.53 15.53 0 0 0 7.06 7.06l2.117-3.53L24 15.529v5.647A2.824 2.824 0 0 1 21.176 24C9.78 23.307.693 14.22 0 2.824A2.824 2.824 0 0 1 2.824 0H8.47Z"
        id="a"
      />
    </defs>
    <g
      transform="translate(2 2)"
      stroke="currentColor"
      fill="none"
      fillRule="evenodd"
      strokeLinecap="round"
    >
      <path
        strokeWidth="2"
        d="m9.148-1 3.39 8.478-3.444 2.067a14.53 14.53 0 0 0 5.36 5.361l2.068-3.445L25 14.852v6.324a3.812 3.812 0 0 1-1.12 2.704A3.812 3.812 0 0 1 21.176 25c-6.01-.363-11.358-2.917-15.309-6.867A23.534 23.534 0 0 1-.998 2.884C-1 1.768-.572.812.12.12A3.812 3.812 0 0 1 2.824-1h6.324Z"
      />
      <use strokeWidth="3" xlinkHref="#a" />
    </g>
  </svg>
)
