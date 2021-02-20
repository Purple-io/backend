import fuzzysort from 'fuzzysort';
import Filter from 'bad-words';
/*
Using fuzzy or fuzzy search, write the code where given a message, asterick out the banned wrods

banned = ["XYZ", "name"]
message = "My nama is XYZ"
result = My **** is ***
*/

let message = 'the fucking president is doanaald mctrumpy you b1tch suck my c0ck!! i love whtie supremacy';
const banned = ["donald","trump","white"];

console.log("Banned words: " + banned);
console.log("Message Before: " + message);

const replace = [];

const words = message.split(' ');
for(const word of words){
  for (const ban of banned){
    const results = fuzzysort.single(ban, word, {
      allowTypo: true
    });
    if(results){
      replace.push(word);
      replace.push(ban);
    }
  } 
}

var filter = new Filter();
filter.addWords(...replace);
message = filter.clean(message);

console.log("Message After: " + message);





