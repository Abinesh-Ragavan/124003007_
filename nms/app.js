
const express = require('express');
const axios = require('axios');
const validUrl = require('valid-url');
const app = express();
const port = 3000; 
//fetching data from the api through get request
app.get('/numbers', async (req, res) => {
  const urls = req.query.url;
  const validUrls = urls.filter((url) => validUrl.isWebUri(url));
  const results = await AddingnumberValues(validUrls);

  return res.json({ numbers: results });
});

// adding all the data into the array 
async function AddingnumberValues(urls) {
  const numberdatasfromurl = [];

  for (const url of urls) {
    numberdatasfromurl.push(
      axios
        .get(url,{timeout:1000000})
        .then((response) => {
          const numbers = response.data.numbers;
          return numbers;
        })
        .catch((error) => {
          return "something error happend while fetching the data abi test it once ";
        })
    );
  }
  // rendering the output according to the output result and sorting and removal of duplicates
  const responses = await Promise.all(numberdatasfromurl);
  const mergedNumbers = responses
    .flat()
    .filter((value, index, self) => self.indexOf(value) === index);

  return mergedNumbers.sort((a, b) => a - b);
}
app.listen(port, () => {
  console.log(`Server is running on port ${port} sucessfully `);
});
