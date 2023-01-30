export const splitString = (
  input: string,
  separator: string
): string | string[] => {
  if (!separator) {
    console.error(
      'Please provide a separator character for splitting the input'
    )
    return input
  }

  return input.split(separator)
}
