# Vanity Number Converter

### Description
 - The Vanity Number service lets you generate 5 unique vanity numbers out of which the IVR speaks 3. The best vanity numbers are ones that comprise of One Word (Seven Letters eg.+1416-784-9933 -> +1416-QUIZZED ) or Two Words (3 letter Word and 4 letter word eg. +1416-228-2255 -> +1416-BAT-BALL ) or One Word (4 letter word 14163912255 -> 1416391BALL). In case a valid word cannot be generated in any of the variations, then the system will convert the last four digits to letters.

### Testing the application

-  To generate a new vanity number you can call +1(833)433-1451. When you call the first time the system will take a minute to generate your Vanity Numbers. You can call back again to hear your Vanity Numbers.

### Implementation 
To handle the generation of Vanity Numbers, when a caller calls the Connect contact center, the system will call a AWS Lambda function `caller-lookup` to query the Caller table in DynamoDB and determine if they have called before. 
If the user has called before, the IVR will speak 3 Vanity Numbers for the user that are already in the table.
If the user is calling for the first time, the Lambda `invoke-vanity-converter` invokes the Lambda `vanity-numbers` asynchronously using the AWS SDK. The purpose for this is to avoid the 8 second timeout limit that Amazon Connect places for Lambda invocation. 

The `vanity-numbers` function takes callers phone number and attempts to make a seven letter word with the last seven digits of the phone number and verify it using the `check-if-word` npm package. If a valid seven letter word cannot be generated, the function attempts to find two words (3 letters and 4 letters) and check if both words are actual words using the package. If the first condition of finding a 3 letter word is not met, then the function attempts to find just a 4 letter word. When both searches for a 3 letter word and 4 letter word are true, a vanity number with two valid words is generated (for eg. +1416-BAT-BALL).  If the final condition of finding a 4 letter word is unmet, it returns random letter as the final four letters which may not be one full word. I have also incorporatd [SSML](https://docs.aws.amazon.com/polly/latest/dg/supportedtags.html) tags while the vanity numbers to improve the IVR experience when the IVR speaks words to make the response more clear. 

Once we have five numbers, the handler makes a request to insert the five numbers into the DynamoDB Callers table.  


### Potential Improvements

 - A UI that would enable users to get their Vanity Numbers by inserting their phone numbers
 - A better approach for finding words where number combinations do not result to a valid word. I have used  a fallback solution of generating random alphabet which could be interpreted as abbreviations.
 - Additional unit and integration testing to provide better coverage
 - An option for the caller to hear the definitions of the words in the Vanity Number for better clarity. 


### Contact flow:

 ![Connect Contact Flow](https://github.com/afzaanhakim/VF-VanityNumbersConverter/blob/feature/vanity-number-converter-refactor/public/ContactFlow.png?raw=true)

 ### To test the generation of Vanity Numbers:

   1. Clone the repository:
     `git clone https://github.com/afzaanhakim/VF-VanityNumbersConverter.git`

   2. `cd` into the root of the repository.
      
   3. Run `npm install` to install dependencies.

   4. Run `npm run test` to run test suite.

 