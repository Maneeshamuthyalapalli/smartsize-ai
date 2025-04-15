// Function to convert inches to centimeters
export const inchesToCm = (inches: number): number => {
  return Math.round(inches * 2.54 * 10) / 10
}

// Function to determine a general size category based on measurements
export const getSizeCategory = (upperBodyWidth: number): string => {
  if (upperBodyWidth < 38) return "XS-S"
  if (upperBodyWidth < 42) return "M"
  if (upperBodyWidth < 46) return "L"
  return "XL+"
}

// Function to get a general fit recommendation
export const getFitRecommendation = (upperBodyWidth: number, midsection: number): string => {
  const difference = upperBodyWidth - midsection

  if (difference > 10) return "tapered fit"
  if (difference > 6) return "regular fit"
  return "relaxed fit"
}
