const vanityNumberHandler = require('../lambda/vanity-numbers/index').handler;
jest.setTimeout(10000);
describe('Testing Vanity Numbers Converter', () => {
  test('it should generate an array of 5 vanity numbers', (done) => {
    const phoneNumber = '+14168254772';

    vanityNumberHandler({phoneNumber, isTestCase: true})
      .then((vanityNumberTest) => {
        expect(Array.isArray(vanityNumberTest)).toBeTruthy();
        expect(vanityNumberTest).toBeTruthy();
        expect(vanityNumberTest.length).toBe(5);
        return done();
      })
      .catch((error) => {
        console.log(error);
      });
  });

  test('the last digit should end with an alphabet', (done) => {
    const phoneNumber = '+14168254772';

    vanityNumberHandler({phoneNumber, isTestCase: true})
      .then((vanityNumberTest) => {
        console.log('vanityNumberTest 2 - for check of last 4 digits', vanityNumberTest);
        vanityNumberTest.forEach((num) => {
          expect(isNaN(parseInt(num[num.length - 1]))).toBeTruthy();
        });
        return done();
      })
      .catch((error) => {
        console.log(error);
      });
  });

  test('the vanity numbers in the array should be unique (no repetition)', (done) => {
    const phoneNumber = '+14168254772';

    vanityNumberHandler({phoneNumber, isTestCase: true})
      .then((vanityNumberTest) => {
        const uniqueArray = (arr) => {
          const noDuplicates = new Set(arr);
          return arr.length === noDuplicates.size;
        };
        expect(uniqueArray(vanityNumberTest)).toBeTruthy();
        return done();
      })
      .catch((error) => {
        console.log(error);
      });
  });
});
