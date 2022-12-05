import { FC, SVGAttributes } from 'react'

export const Accessible: FC<{
  className?: SVGAttributes<SVGSVGElement>['className']
}> = ({ className = '' }) => (
  <svg
    width="24"
    height="24"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <g fill="none" fillRule="evenodd">
      <circle
        cx="18.422"
        cy="4.353"
        r="1"
        fill="currentColor"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="3"
      />
      <path
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="3"
        d="M9.0954574,9.43506825 C6.48920361,9.38998911 4.20927688,11.1806568 3.6354845,13.7233627 C3.06169211,16.2660686 4.35165619,18.8623254 6.72469294,19.9408835 C9.09772969,21.0194416 11.9019603,20.2840185 13.4402699,18.1796909"
      />
      <polyline
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="3"
        points="20.775 19.824 16.069 13.941 11.363 13.941 14.893 8.059 10.187 4.529 5.481 5.706"
      />
    </g>
  </svg>
)
