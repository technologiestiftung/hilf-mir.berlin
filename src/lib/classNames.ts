export default function classNames(
  ...classes: unknown[] | unknown[][]
): string {
  const flatClasses = classes.map((className) => {
    if (typeof className === 'string') return className
    if (Array.isArray(className)) return classNames(...(className as string[]))
    return ''
  })
  return flatClasses.filter(Boolean).join(' ')
}
