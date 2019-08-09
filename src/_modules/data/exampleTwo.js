const objectsInArray = [
  {
    '1': {
      id: 'Example from exampleTwo.js',
      title: 'Example2 from exampleTwo.js',
      text: 'Example3 from exampleTwo.js'
    },
    '2': {
      id: 'Example from exampleTwo.js',
      title: 'Example2 from exampleTwo.js',
      text: 'Example3 from exampleTwo.js'
    }
  }
];

const result = Object.assign({}, ...objectsInArray);

module.exports = result;