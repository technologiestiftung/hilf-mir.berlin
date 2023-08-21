import React from 'react'
import { Button } from './Button'

function FilterSubmitButton() {
  return (
    <Button
      scheme="primary"
      size="large"
      className={classNames('w-full @md:w-max @md:min-w-[324px]', 'group')}
      href="/map"
      query={latitude && longitude ? { latitude, longitude } : {}}
      tag="a"
      onClick={() => {
        onSubmit()
      }}
      icon={
        textSearchLoading ? (
          <Spinner className={classNames('animate-spin')} />
        ) : (
          <Arrow
            className={classNames(
              'transition-transform group-hover:translate-x-0.5 group-disabled:group-hover:translate-x-0'
            )}
          />
        )
      }
      disabled={filteredFacilitiesCount === 0 || fieldsDisabled}
      tooltip={
        filteredFacilitiesCount === 0 && (
          <span>{texts.filtersButtonTextFilteredNoResultsHint}</span>
        )
      }
    >
      {getSubmitText({
        texts,
        isLoading: textSearchLoading,
        count: filteredFacilitiesCount,
        total,
      })}
    </Button>
  )
}

export default FilterSubmitButton
