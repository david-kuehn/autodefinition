const Dictionary = require("oxford-dictionary-api");
const fs = require('fs');
var readline = require('line-by-line'),
    rl = new readline('words.txt');

const app_id = "394bf90d";
const app_key = "0ca33a253069a18972cb8a543af3da65";
var dict = new Dictionary(app_id, app_key);
var dictCallsInMinute = 0;

// Creates blank file
fs.writeFile('definitions.txt', '');

rl.on('line', async function (line) {
  // If the line does not denote a new section
  if (!line.includes('Section')) {
    // Pause the reader
    rl.pause();
    console.log(dictCallsInMinute);
    if (dictCallsInMinute == 60){
      console.log("Max dictionary calls per minute reached. Waiting 1 minute...");
      await sleep(61000);
      console.log("Proceeding");
      lookUpWord(line);

      dictCallsInMinute = 0;
    }
    else {
      lookUpWord(line);
    }
  }
  // If it is a new section
  else {
    fs.appendFile('definitions.txt', line + '\n', function (err) {
      // If there's an error adding the definition, log it
      if (err) throw err;
    });
  }
});

function lookUpWord (line) {
  // Search for the definition of the current line
  dict.find(line, function(error, data) {
    dictCallsInMinute++;

    // Set the definition as blank in case no definition can be found
    var def = '';

    // If there's an error with the definition search, log it
    if (error) {
      if (error != "No such entry found")
        return console.log(error);
    }
    else {
      // Otherwise, set the definition
      def = data.results[0].lexicalEntries[0].entries[0].senses[0].definitions[0];
    }

    // Add the word and its definition to definitions.txt
    fs.appendFile('definitions.txt', line + '- ' + def + '\n', function (err) {
      // If there's an error adding the definition, log it
      if (err) throw err;

      // Go to the next line
      rl.resume();
    });
  });
}

function sleep(ms){
    return new Promise(resolve=>{
        setTimeout(resolve,ms)
    })
}
