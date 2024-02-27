export const formatViews = (numberString) => {
  const number = parseFloat(numberString);
  if (isNaN(number)) {
    // throw new Error("Invalid input: not a number");
    // console.log(number);
    return null;
  }
  const suffixes = ["", "K", "M", "B", "T"];
  const tier = (Math.log10(Math.abs(number)) / 3) | 0;

  if (tier === 0) return number;

  const suffix = suffixes[tier];
  const scale = Math.pow(10, tier * 3);

  const scaledNumber = number / scale;

  // Use toFixed to limit the number of decimal places
  return scaledNumber.toFixed(1) + suffix;
};
