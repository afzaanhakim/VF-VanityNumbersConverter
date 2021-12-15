require('dotenv').config(); // load environment variables into process.env

const checkWordPackage = require('check-if-word'); // package to check if word is a valid word
words = checkWordPackage('en'); // validates if words are real
const {NUMBERS_NEEDED, MAX_ATTEMPTS} = process.env;

const numberList = {
  0: [
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'I',
    'J',
    'K',
    'L',
    'M',
    'N',
    'O',
    'P',
    'Q',
    'R',
    'S',
    'T',
    'U',
    'V',
    'W',
    'X',
    'Y',
    'Z'
  ], //wildcards
  1: [
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'I',
    'J',
    'K',
    'L',
    'M',
    'N',
    'O',
    'P',
    'Q',
    'R',
    'S',
    'T',
    'U',
    'V',
    'W',
    'X',
    'Y',
    'Z'
  ], //wildcards
  2: ['A', 'B', 'C'],
  3: ['D', 'E', 'F'],
  4: ['G', 'H', 'I'],
  5: ['J', 'K', 'L'],
  6: ['M', 'N', 'O'],
  7: ['P', 'Q', 'R', 'S'],
  8: ['T', 'U', 'V'],
  9: ['W', 'X', 'Y', 'Z']
};

const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// function takes a set of digits and converts them into letters. It then checks if the resulting combination is a valid englihs word
function searchForDigitCombinations(digits, numberOfCompletedAttempts) {
  console.log('Searching for digit combinations, so far completed ', numberOfCompletedAttempts, 'attempts');
  if (numberOfCompletedAttempts < MAX_ATTEMPTS) {
    const word = generateRandomLetterCombinations(digits);

    const isWord = words.check(word);
    if (isWord) {
      console.log('✅ Found valid english word', word);
      return word;
    } else {
      console.log('❌', word, 'is not a valid English word, trying again...');
      return searchForDigitCombinations(digits, (numberOfCompletedAttempts += 1));
    }
  } else {
    console.log('Max attempts reached for digits:', digits, numberOfCompletedAttempts);
    return null;
  }
}

function generateRandomLetterCombinations(digits) {
  let word = '';
  for (let num of digits) {
    let newChar = numberList[num][getRandomInt(0, numberList[num].length - 1)];
    word += newChar;
  }
  return word;
}

// generates a vanity number and check if number exists, if number does not exist it adds the number to array, else calls recursively until reached max tries

const insertNovelVanityNumber = function (array, cCode, midDigits, lastDigits, tries) {
  if (tries < 1000) {
    let newVanityNumber = assembleVanityNumber(cCode, midDigits, lastDigits);
    if (newVanityNumber) {
      if (!array.includes(newVanityNumber)) {
        array.push(newVanityNumber);
      } else {
        let secondAttemptAtSameVanityNumber = cCode + midDigits + newVanityNumber.slice(7, newVanityNumber.length);
        if (!array.includes(secondAttemptAtSameVanityNumber)) {
          array.push(secondAttemptAtSameVanityNumber);
        } else {
          return insertNovelVanityNumber(array, cCode, midDigits, lastDigits, tries++);
        }
      }
    } else {
      return insertNovelVanityNumber(array, cCode, midDigits, lastDigits, 5);
    }
  }
};

const assembleVanityNumber = function (cCode, midDigits, lastDigits) {
  console.log('Assembling vanity number...');
  const sevenLetterCombo = searchForDigitCombinations(midDigits + lastDigits, 0);
  if (sevenLetterCombo) {
    const oneWordVanityNumber = cCode + sevenLetterCombo;
    console.log('Found 7 letter combinations', oneWordVanityNumber);
    return oneWordVanityNumber;
  } else {
    const threeLetterCombo = searchForDigitCombinations(midDigits, 0);
    if (threeLetterCombo) {
      console.log('Got three letter combo to add to word: ', threeLetterCombo);

      const fourLetterCombo = searchForDigitCombinations(lastDigits, 0);

      if (fourLetterCombo) {
        const twoWordVanityNumber = cCode + threeLetterCombo + fourLetterCombo;
        console.log('Assembled two word vanity number: ', twoWordVanityNumber);
        return twoWordVanityNumber;
      } else {
        const randomLetterCombinations = generateRandomLetterCombinations(lastDigits);
        let normalFourLetterWordAbbreviation = cCode + midDigits + randomLetterCombinations;
        console.log('Found four letter random word', normalFourLetterWordAbbreviation);
        return normalFourLetterWordAbbreviation;
      }
    } else {
      const fourLetterCombo = searchForDigitCombinations(lastDigits, 0);

      if (fourLetterCombo) {
        const newFourLetterVanityNumber = cCode + midDigits + fourLetterCombo;
        console.log('Assembled four letter word vanity number: ', newFourLetterVanityNumber);
        return newFourLetterVanityNumber;
      } else {
        const randomLetterCombinations = generateRandomLetterCombinations(lastDigits);
        let randomFourLetterVanityNumber = cCode + midDigits + randomLetterCombinations;
        return randomFourLetterVanityNumber;
      }
    }
  }
};

exports.handler = function (event) {
  const startTime = Date.now();
  const phoneNumber = event.phoneNumber.replace('+', '');
  const cCode = phoneNumber.slice(0, 4); // Country code
  const midDigits = phoneNumber.slice(4, 7); // Middle digits of phone number
  const lastDigits = phoneNumber.slice(7, phoneNumber.length); // last four digits of a phone number (US, CAN)

  const convertedNumbers = []; // Final list for all unique and valid vanity numbers to return

  for (let i = 0; i < NUMBERS_NEEDED; i++) {
    insertNovelVanityNumber(convertedNumbers, cCode, midDigits, lastDigits, 0);
    console.log(`Inserted ${i} vanity number: `, convertedNumbers);
  }

  const endTime = Date.now();
  console.log('Function took ', endTime - startTime, 'ms to return');
  return convertedNumbers;
};

/* uncomment for local testing */

// const test = exports.handler({ phoneNumber: '+15198259920' });

// console.log(test);

module.exports = {
  generateRandomLetterCombinations,
  assembleVanityNumber,
  insertNovelVanityNumber,
  searchForDigitCombinations
};
