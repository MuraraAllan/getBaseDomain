//Get the base domain of a given domain, in the most efficient way. 

//public domain suffixes storage
const axios = require('axios');
const http = require('http');
const { getPublicSuffixList } = require('./utils');

// JSON object
global.publicSuffixes = {};


const getBaseDomain = async (domain) => {
  //if the publiSuffixies structure is not filled with data yet.
  if (!Object.keys(publicSuffixes).length) {
    await getPublicSuffixList();
  }
  //must find out from the string in a chain from the last to the first '.' ocurrency;
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
  let thirdLayer = domain.substr(0, suffixIndexer);
  if (thirdLayer.indexOf('.') > -1) {
    thirdLayer = thirdLayer.substr(thirdLayer.lastIndexOf('.')+1, thirdLayer.length);
  };
  return `${thirdLayer}.${secondLayer}`
};


const mainFunction = (async () => {
  let coUkExample, googleBr, fakeData;
  try {
    await getPublicSuffixList();
    coUkExample = await getBaseDomain('subdomain.example.co.uk');
    googleBR = await getBaseDomain('s1.google.com.br');
    fakeData = await getBaseDomain('s1.google.yyy.zzz');
  } catch (err) {
    console.log('ERR', err);
  }
  console.log('lsalalal', coUkExample)
  console.log('googlebr', googleBR);
  console.log('s1.google.yyy.zzz', fakeData);
})

module.exports = {
  getBaseDomain 
};
