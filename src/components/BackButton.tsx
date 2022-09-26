import classNames from '@lib/classNames'
import { useTexts } from '@lib/TextsContext'
import { DOMAttributes, FC } from 'react'
import { Arrow } from './icons/Arrow'

export const BackButton: FC<{
  onClick: DOMAttributes<HTMLButtonElement>['onClick']
}> = ({ onClick }) => {
  const texts = useTexts()
  return (
    <div className="p-2 sticky bg-white top-0 z-10">
      <button
        className={classNames(
          `flex gap-2 p-3 md:p-8 items-center`,
          `transition-colors hover:text-red`,
          `focus:outline-none focus:ring-2 focus:ring-red`,
          `focus:ring-offset-2 focus:ring-offset-white`
        )}
        onClick={onClick}
        aria-label={texts.backText}
      >
        <Arrow orientation="left" className="scale-75" />
        <span className="font-bold text-lg">{texts.backText}</span>
      </button>
    </div>
  )
}
