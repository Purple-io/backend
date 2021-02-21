import fuzzysort from 'fuzzysort';
import Filter from 'bad-words';

export const censor = (message, banned) => {
  let temp = []
  banned = temp.concat(banned);
  const replace = [];

  const origSize = banned.length;
  for (let i = 0; i < origSize; i++) {
    const word = banned[i];
    for (let j = 0; j < word.length; j++) {
      banned.push(word.substring(0, j) + word.substring(j + 1));
    }
  }

  const words = message.split(' ');
  for (let word of words) {
    for (let ban of banned) {
      const results = fuzzysort.single(ban, word, {
        allowTypo: true,
      });
      if (results) {
        replace.push(word);
      }
    }
  }

  var filter = new Filter();
  filter.addWords(...replace);
  message = filter.clean(message);
  return message;
};

// console.log(banned);
// console.log(message);
// console.log(censor(message, banned));
