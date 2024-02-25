export default (value, places) => {
  if (!Number.isFinite(value)) {
    throw new Error('Value must be a finite number')
  }
  if (!Number.isInteger(places) || places < 0) {
    throw new Error('Precision must be a non-negative integer')
  }
  return parseFloat(value.toFixed(places))
}