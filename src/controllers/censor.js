import fuzzysort from 'fuzzysort';
import Filter from 'bad-words';

// let message = 'the fucking president is doald mctrumpy you b1tch suck my c0ck!! i love whtie supremacy';
// const banned = ["donald","trump","white"];

export const censor = (message, banned) => {
  const replace = [];


  const origSize = banned.length;
  for(let i = 0;i<origSize;i++){
    const word = banned[i];
    for(let j = 0;j<word.length;j++){
      banned.push(word.substring(0, j) + word.substring(j+1));
    }
  }
  
  const words = message.split(' ');
  for(const word of words){
    for (const ban of banned){
      const results = fuzzysort.single(ban, word, {
        allowTypo: true
      });
      if(results){
        replace.push(word);
      }
    } 
  }
  
  var filter = new Filter();
  filter.addWords(...replace);
  message = filter.clean(message);
  return message;
}

// console.log(banned);
// console.log(message);
// console.log(censor(message, banned));








