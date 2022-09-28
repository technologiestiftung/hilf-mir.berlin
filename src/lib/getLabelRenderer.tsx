import { GristLabelType } from '@common/types/gristData'
import classNames from './classNames'

interface RenderLabelsArgsType {
  activeFilters: number[]
  onLabelClick?: (activeFilters: number[]) => void
  className?: string
}

type GetLabelRendererType = (
  config: RenderLabelsArgsType
) => (label: GristLabelType) => JSX.Element

export const getLabelRenderer: GetLabelRendererType = ({
  activeFilters,
  onLabelClick = () => undefined,
  className = '',
}) =>
  function renderLabel(label) {
    const isActive = !!activeFilters.find(
      (activeFilter) => `${activeFilter}` === label.fields.key
    )
    const newFilters = isActive
      ? activeFilters.filter((f) => `${f}` !== label.fields.key)
      : [...activeFilters, label.id]
    return (
      <li key={label.fields.key} className="inline-block">
        <button
          onClick={() => onLabelClick(newFilters)}
          className={classNames(
            className,
            `py-1.5 border text-lg flex gap-2 text-left leading-6 pl-2 group`,
            isActive && `bg-red border-red text-white font-bold pr-2.5`,
            !isActive && ` border-gray-20 pr-3`,
            `focus:outline-none focus:ring-2 focus:ring-red`,
            `focus:ring-offset-2 focus:ring-offset-white`
          )}
        >
          {label.fields.icon && (
            <img
              src={`/images/icons/filters/${label.fields.icon}.svg`}
              alt={`Icon for "${label.fields.text}" label`}
              style={{
                filter: isActive ? `invert(1)` : ``,
              }}
            />
          )}
          <span>{label.fields.text}</span>
        </button>
      </li>
    )
  }
