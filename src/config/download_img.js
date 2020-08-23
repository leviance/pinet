const axios = require('axios');
const fs = require('fs');
const uid = require('uid')

const download_image = (url, img_name) =>
  axios({
    url,
    responseType: 'stream',
  }).then(
    response =>
      new Promise((resolve, reject) => {
        if(!img_name) img_name = `${uid()}${new Date().getTime()}.jpg`
        
        response.data
          .pipe(fs.createWriteStream(`src/public/assets/images/users/${img_name}`))
          .on('finish', () => resolve(img_name))
          .on('error', e => reject(e));
      }),
  );


module.exports = download_image


