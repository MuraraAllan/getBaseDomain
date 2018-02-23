const axios = require('axios');

const getPublicSuffixList = async () => 
  axios.get('https://publicsuffix.org/list/public_suffix_list.dat')
  .then(res => {
    const dataArray = res.data.split('\n');
    let currentLayer = '';
    dataArray.forEach(current => {
      //must store the domain name by layers
      //when not found . and not start with '//'  this is the current layer; 
      //anything after the last . is the current "layer", anything before that must be stored in the array.
      //whenever current is different from currentLayer, insert a JSON containing an array with previous instructions in publicSuffixes object;
      if (current.length === 0) return
      if (current.indexOf('//') > -1) return;
      if (current.indexOf('.') === -1 && current.length > 0) {
        global.publicSuffixes[current] = [];
        return currentLayer = current;
      }
      global.publicSuffixes[currentLayer].push(current);
    });
  });

module.exports = { 
  getPublicSuffixList
};
