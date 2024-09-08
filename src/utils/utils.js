function processNumbers(numbers) {
  // Map each number in the array to a new number based on the described rules
  let processedNumbers = numbers.map((number) => {
    if (number % 2 === 0) {
      // If the number is even, divide by 2 and add 1
      return number / 2 + 1;
    } else {
      // If the number is odd, divide by 2 and add 0.5
      return number / 2 + 0.5;
    }
  });

  return processedNumbers;
}

module.exports = {
  processNumbers
};
