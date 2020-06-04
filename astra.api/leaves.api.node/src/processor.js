const axios = require('axios');
const cheerio = require('cheerio');
const { extract } = require('article-parser');
const md5 = require('md5');

const processor = async(newLeaf) => {

  newLeaf.id = md5(newLeaf.url);
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
  newLeaf.tags = [];
  newLeaf.slugs = newLeaf.tags;

  //use axios to make a get request to the url
  await axios.get(`${newLeaf.url}`)
    .then(res => {

      //take response and set mimetype to content-type in headers
      newLeaf.mimetype = res.headers['content-type'];

      //set newLeaf.http_status = status code converted to string
      newLeaf.http_status = res.status.toString();

      //load html into cheerio and use $ to mimic jQuery
      let $ = cheerio.load(res.data);

      //find language attribute and assign it to newLeaf.language
      newLeaf.language = $('html').attr('lang');
      
    });

  //await article parser method extract parsing url 
  const article = await extract(newLeaf.url);

  //set preview_picture equal to image returned in article object
  newLeaf.preview_picture = article.image;

  //set content equal to readable content returned in article object
  newLeaf.content = article.content;

  //set title equal to title returned in article object
  newLeaf.title = article.title;

  //set content_text equal to content that is stripped of html elements with regex
  newLeaf.content_text = newLeaf.content.replace(/<[^>]+>/g, '');

  //generate reading_time in minutes from article object (convert from seconds)
  newLeaf.reading_time = Math.round(article.ttr / 60);

  //return newLeaf to use in router.js
  return newLeaf;

};

module.exports = {

  processor

};