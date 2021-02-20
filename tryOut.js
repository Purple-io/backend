import fuzzy from 'fuzzy';
import FuzzySearch from 'fuzzy-search';

let message = 'My name is XYkZ';
var list = message.split(' ');
console.log(list);

var results = fuzzy.filter('XYZ', list);
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
