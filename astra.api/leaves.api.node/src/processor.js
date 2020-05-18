const axios = require('axios');
const cheerio = require('cheerio');

const processor = async(newLeaf) => {

  newLeaf.id = 123456781;
  newLeaf.is_archived = 1;
  newLeaf.is_starred = 0;
  newLeaf.user_name = 'admin';
  newLeaf.user_email = 'rahul@example.com';
  newLeaf.user_id = 1;
  newLeaf.is_public = false;
  newLeaf.domain_name = newLeaf.url.match(/^https?:\/\/[^#?\/]+/)[0];
  newLeaf.created_at = Date.now();
  newLeaf.updated_at = Date.now();
  newLeaf.links = [`api/entries/${newLeaf.id}`];
  newLeaf.slugs = newLeaf.tags;

  newLeaf.content = '';
  newLeaf.content_text = '';
  newLeaf.reading_time = 1;
  newLeaf.preview_picture = '';


  //use axios to make a get request to the url
  await axios.get(`${newLeaf.url}`)
    .then(res => {

      //take response and set mimetype to content-type in headers
      newLeaf.mimetype = res.headers['content-type'];

      //set newLeaf.http_status = status code converted to string
      newLeaf.http_status = res.status.toString();

      //load htmol document and use $ to mimic jQuery
      let $ = cheerio.load(res.data);
 
      //find title and assign it to newLeaf.title
      newLeaf.title = $('title').text();

      //find language attribute and assign it to newLeaf.language
      newLeaf.language = $('html').attr('lang');
      

    });

  return newLeaf;

};

module.exports = {

  processor

};