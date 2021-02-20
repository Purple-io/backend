import fuzzysort from 'fuzzysort';
import Filter from 'bad-words';

// let message = 'the fucking president is doanaald mctrumpy you b1tch suck my c0ck!! i love whtie supremacy';
// const banned = ["donald","trump","white"];

export const censor = (message, banned) => {
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
  return message;
}








