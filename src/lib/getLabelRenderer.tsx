import { GristLabelType } from '@common/types/gristData'
import { Label } from '@components/Label'

interface RenderLabelsArgsType {
  onLabelClick?: (activeFilters: number[]) => void
  activeFilters: number[]
  className?: string
  withInteractiveLabels?: boolean
}

type GetLabelRendererType = (
  config: RenderLabelsArgsType
) => (label: GristLabelType) => JSX.Element

export const getLabelRenderer: GetLabelRendererType = ({
  onLabelClick = () => undefined,
  activeFilters,
  className = '',
  withInteractiveLabels = true,
}) =>
  function renderLabel(label) {
    const isActive = !!activeFilters.find((f) => f === label.id)
    const newFilters = isActive
      ? activeFilters.filter((f) => f !== label.id)
      : [...activeFilters, label.id]
    return (
      <Label
        label={label}
        key={label.id}
        isActive={isActive}
        onClick={() => onLabelClick(newFilters)}
        className={className}
        isInteractive={withInteractiveLabels}
      />
    )
  }
