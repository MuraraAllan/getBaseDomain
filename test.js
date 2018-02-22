//6. Challenge: Get the base domain of a given domain, in the most efficient way. Write a function that can be called like getBaseDomain("subdomain.example.co.uk") -> "example.co.uk". Also consider the data structure to store the public domain suffixes.
//public domain suffixes storage
const axios = require('axios');

const publicSuffixes = {};

const getPublicSuffixList = async () => 
  axios.get('https://publicsuffix.org/list/public_suffix_list.dat')
  .then(res => {
    const dataArray = res.data.split('\n');
    let currentLayer = '';
    dataArray.forEach(current => {
      //must store the domain name by layers
      //when not found . and not start with '//'  this is the current layer; 
      //anything after the last . is the current "layer", anything before that must be stored in the array.
      //whenever current is different from currentLayer, insert a new array with current as label in publicSuffixes object;
      if (current.length === 0) return
      if (current.indexOf('//') > -1) return;
      if (current.indexOf('.') === -1 && current.length > 0) {
        publicSuffixes[current] = [];
        return currentLayer = current;
      }
      publicSuffixes[currentLayer].push(current);
    });
  })


const getBaseDomain = async (domain) => {
  //if the publiSuffixies structure is not filled with data yet.
  if (Object.keys(publicSuffixes).length === 0) {
    await getPublicSuffixList();
  }
  //must find out from the string in a chain from the last to the first '.' ocurrency;
  //  const lastSuffixIndex = currentString.lastIndexOf('.');
  //  const currentSuffix = currentString.substr(currentString.lastIndexOf('.')+1, domain.length).concat(currentSuffix);    
  //  const currentString = domain.substr(0, lastSuffixIndex);
  const firstLayer = domain.substr(domain.lastIndexOf('.')+1, domain.length);
  const validPublicDomain = publicSuffixes[firstLayer];
  if (!validPublicDomain) return 'Invalid Domain';
 //must find out if the second ocurrency exists checking for the received layer
  let secondLayer = '';
  validPublicDomain.forEach(publicDomain => {
    const match = domain.indexOf(publicDomain);
    if (match > -1) secondLayer = domain.substr(domain.indexOf(publicDomain), domain.length);
  });
  if (!secondLayer) secondLayer = firstLayer;
  // get suffix length, create an string from 0 to be the remaining expression and retrieve the last . so the subdomain will always be 'example.co.uk' 
  const suffixIndexer = (domain.length-1) - secondLayer.length;
  let domainWithoutSuffix = domain.substr(0, suffixIndexer);
  if (domainWithoutSuffix.indexOf('.') > -1) {
    domainWithoutSuffix = domainWithoutSuffix.substr(domainWithoutSuffix.lastIndexOf('.')+1, domainWithoutSuffix.length);
  };
  return `${domainWithoutSuffix}.${secondLayer}`
};


const mainFunction = (async () => {
  const coUkExample = await getBaseDomain('subdomain.example.co.uk');
  console.log('lsalalal', coUkExample)
  const googleBR = await getBaseDomain('s1.google.com.br');
  console.log('googlebr', googleBR);
  const fakeData = await getBaseDomain('s1.google.yyy.zzz');
  console.log('s1.google.yyy.zzz', fakeData);
})()
