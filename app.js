const Dictionary = require("oxford-dictionary-api");
const fs = require('fs');
var readline = require('line-by-line'),
    rl = new readline('words.txt');

const app_id = "394bf90d";
const app_key = "0ca33a253069a18972cb8a543af3da65";
var dict = new Dictionary(app_id, app_key);

// Creates blank file
fs.writeFile('definitions.txt', '');

rl.on('line', function (line) {
  rl.pause();
  dict.find(line, function(error, data) {
    if (error) {
      return console.log(error);
    }

    console.log(`Line from file: ${line}`);
    console.log(data.results[0].lexicalEntries[0].entries[0].senses[0].definitions[0]);
    fs.appendFile('definitions.txt', line + '- ' + data.results[0].lexicalEntries[0].entries[0].senses[0].definitions[0] + '\n', function (err) {
      if (err) throw err;

      // Go to the next line
      rl.resume();
    });
  });
});

function lookUpWord (word, callback) {
  dict.find(word, function(error, data) {
    if (error) {
      return console.log(error);
    }

    console.log(data.results[0].lexicalEntries[0].entries[0].senses[0].definitions[0]);
  });

  if(callback) callback();
}
