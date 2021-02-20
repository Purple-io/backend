import fuzzy from 'fuzzy';
import FuzzySearch from 'fuzzy-search';

/*
Using fuzzy or fuzzy search, write the code where given a message, asterick out the banned wrods

banned = ["XYZ", "name"]
message = "My nama is XYZ"
result = My **** is ***
*/

let message = 'My name is XYZ';
var list = message.split(' ');
console.log(list);

var results = fuzzy.filter('XYkZ', list);
var matches = results.map((el) => el.string);

console.log('ran');
console.log(results);
console.log(matches);

const people = [
  {
    name: {
      firstName: 'XYZ',
      lastName: 'Bowen',
    },
    state: 'Seattle',
  },
];

const searcher = new FuzzySearch(people, ['name.firstName', 'state'], {
  caseSensitive: true,
});
const result = searcher.search('XYkZ');
console.log(result);
