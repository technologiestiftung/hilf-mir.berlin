export const splitString = (input: string, separator: string): string[] => {
  if (!separator) {
    console.warn('Please provide a separator character for splitting the input')
  }

  return input.split(separator)
}
