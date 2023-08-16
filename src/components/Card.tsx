import classNames from '@lib/classNames'
import { FC, ReactNode } from 'react'

interface CardPropsType {
  title: string | ReactNode
  header?: ReactNode
  footer?: ReactNode
  className?: string
  id?: string
}

export const Card: FC<CardPropsType> = ({
  className = '',
  id = '',
  title,
  header: headerContent,
  footer,
  children,
}) => {
  return (
    <div
      id={id}
      className={classNames(
        className,
        'block',
        'flex flex-col gap-1 bg-white',
        'px-5 py-5',
        'border border-gray-20',
        `justify-between`
      )}
    >
      <div className="flex flex-col">
        <header className={classNames(`flex flex-col pb-2`)}>
          <h2 className={classNames(`font-bold text-xl`)}>{title}</h2>
          {headerContent && <header>{headerContent}</header>}
        </header>
        {children}
      </div>
      {footer && <footer className="mt-[2vh] w-full">{footer}</footer>}
    </div>
  )
}
