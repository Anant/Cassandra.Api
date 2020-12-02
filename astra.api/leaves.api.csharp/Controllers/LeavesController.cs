using System;
using System.Collections.Generic;
using System.Text.RegularExpressions;
using LeavesApi.Interfaces;
using LeavesApi.Models;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;
using Newtonsoft.Json;
using Cassandra.Mapping;
using HtmlAgilityPack;
using ScrapySharp.Extensions;
using ScrapySharp.Network;


using Cassandra;


namespace LeavesApi.Controllers
{
    
    [Route("api/[controller]")]
    [ApiController]
    public class LeavesController : ControllerBase
    {
        // https://github.com/DataStax-Examples/getting-started-with-astra-csharp#managing-cassandra-session-within-a-net-web-application
        // "With each call to the CredentialsController the AstraService singleton we created at startup will be passed to the constructor. This mechanism of dependency injection allows us a simple mechanism to use a single Session object throughout the entirety of the application lifecycle."
        private IDataStaxService Service { get; set; }


        private String Keyspace;
        private String Table;

        public LeavesController(IDataStaxService service)
        {
            Dictionary<String, String> credData = service.GetCredData(); 
            Table = credData["table"];
            Keyspace = credData["keyspace"];
            Service = service;
        }


        // GET api/leaves
        [HttpGet]
        public ActionResult<List<string>> Get()
        {
            IMapper mapper = new Mapper(Service.Session);
            // don't allow returning all, it's too much
            IEnumerable<Leaf> leaves = mapper.Fetch<Leaf>("LIMIT 100");

            // TODO might need to not set a limit, if that's what is expected for these APIs
            // Note that using SELECT JSON * has performance disadvantages compared to just doing SELECT * and converting to json in the server instead
            // TODO use mapper and then convert to json using newton json instead, e.g., IEnumerable<Leaf> leaves = mapper.Fetch<Leaf>();
            // https://docs.datastax.com/en/developer/csharp-driver/3.16/features/components/mapper/
            // var statement = new SimpleStatement("SELECT JSON * FROM " + Keyspace + "." + Table + " LIMIT 1000;");
            // statement.SetPageSize(500);

            // var rows = Service.Session.Execute(statement);

            // Console.WriteLine("executing statement: " + statement);
            List<String> rowsList = new List<String>();  

            // this is parsing into list, but for some reason causes query to run twice
            foreach (var row in leaves)
            {
                rowsList.Add(JsonConvert.SerializeObject(row));             
            }

            Console.WriteLine("returning result!");

            return rowsList;

        }

        // TODO if SELECT fails, return 404 instead
        // GET api/leaves/5
        [HttpGet("{id}")]
        public ActionResult<string> Get(string id)
        {
            IMapper mapper = new Mapper(Service.Session);
            Leaf leaf = mapper.Single<Leaf>("WHERE id = ?", id);

             // TODO might need to not set a limit, if that's what is expected for these APIs
            // var statement = new SimpleStatement("SELECT JSON * FROM " + Keyspace + "." + Table + " WHERE id = ? LIMIT 1;", id);
            // var rows = Service.Session.Execute(statement);
            // Console.WriteLine("executing statement: " + statement);
            
            // will return error "Sequence contains no elements" if record not found
            return JsonConvert.SerializeObject(leaf);
        }

        // POST api/leaves
        // TODO Note that this will also perform update by means of upsert if record already exists, and an id is specified. 
        // Maybe want to return error if record exists (?)
        [HttpPost]
        public string CreateLeaf([FromBody] String  url)
        {
            //Console.WriteLine(url.ToString());
            Leaf leaf = new Leaf();
            leaf.url = url;
            byte[] inputBytes = System.Text.Encoding.ASCII.GetBytes(url);
            byte[] hashBytes = System.Security.Cryptography.MD5.Create().ComputeHash(inputBytes);
            System.Text.StringBuilder sb = new System.Text.StringBuilder();
            for (int i = 0; i < hashBytes.Length; i++)
            {
                sb.Append(hashBytes[i].ToString("X2"));
            }
            leaf.id = sb.ToString().ToLower();
            //Console.WriteLine(sb.ToString());
            leaf.is_archived = 1;
            leaf.is_starred = 0;
            leaf.user_name = "admin";
            leaf.user_email = "rahul@example.com";
            leaf.user_id = 1;
            leaf.is_public = false;
            leaf.created_at = new DateTimeOffset(DateTime.Now);
            leaf.updated_at = new DateTimeOffset(DateTime.Now);

            //leaf.links = leaf.links.Append("api/entires/"+leaf.id);

            leaf.links = new String[] {"api/entires/"+leaf.id};
            leaf.tags = new String[] {};
            leaf.slugs = new String[] {};

            Regex rx = new Regex(@"https?:\/\/[^#?\/]+", RegexOptions.Compiled | RegexOptions.IgnoreCase);
            Match match = rx.Match(url);
            leaf.domain_name = match.Value;

            


            ScrapingBrowser _browser = new ScrapingBrowser();
            WebPage webpage = _browser.NavigateToPage(new Uri(url));

            HtmlNode html = webpage.Html;
            var links = html.CssSelect("a");

            /*foreach (var link in links)
            {
                //Console.WriteLine(link.Attributes["href"].Value);
                if (link.Attributes["href"].Value.Contains("http"))
                {
                    leaf.links = leaf.links.Append(link.Attributes["href"].Value);
                }
            }*/
            leaf.slugs = leaf.links;
            leaf.title = html.OwnerDocument.DocumentNode.SelectSingleNode("//html/head/title").InnerText;

            leaf.preview_picture = "https://dummyimage.com/300/000/ffffff&text="+(leaf.title.Replace(" ","%20"));

            leaf.language = "en";

            leaf.mimetype = "text/html";

            leaf.http_status = "200";

            leaf.content = html.OuterHtml;

            leaf.content_text = html.InnerText;

            char[] delimiters = new char[] {' ', '\r', '\n' };
            leaf.reading_time = leaf.content_text.Split(delimiters,StringSplitOptions.RemoveEmptyEntries).Length/265;  
            //Console.WriteLine(leaf.reading_time.ToString());
            
            

            // TODO update the all column using fields
            leaf.all = new String[] {leaf.id.ToString(), leaf.title.ToString(), leaf.mimetype.ToString(), leaf.language.ToString(), leaf.reading_time.ToString(),
            leaf.is_archived.ToString(), leaf.user_id.ToString(), leaf.url.ToString(), leaf.user_email.ToString(), leaf.user_name.ToString(), leaf.content.ToString(),
            leaf.content_text.ToString(), leaf.preview_picture.ToString(), leaf.domain_name.ToString(), leaf.http_status.ToString(), leaf.is_starred.ToString(),
            leaf.is_public.ToString(), leaf.tags.ToString(), leaf.slugs.ToString(), leaf.links.ToString(), leaf.created_at.ToString(), leaf.updated_at.ToString()};
            // TODO do other transformation on the record before persisting as well
            IMapper mapper = new Mapper(Service.Session);
            mapper.Insert(leaf);

            // return back what we got
            this.HttpContext.Response.StatusCode = 201;
            return JsonConvert.SerializeObject(leaf);
        }

        // PATCH api/leaves/5
        [HttpPatch("{id}")]
        public string Patch(String id, [FromBody] Leaf leaf)
        {
            leaf.id = id.ToString();
            IMapper mapper = new Mapper(Service.Session);

            // if item does not exist, OR if there's multiple, return 404. That's all we need to do with this SELECT.
            var existingRecord = mapper.Single<Leaf>("WHERE id = ?", id.ToString());

            // write update to db
            if (leaf.title == null){
                //Console.WriteLine("Null Found");
                leaf.title = existingRecord.title;
            }
            if (leaf.mimetype == null){
                //Console.WriteLine("Null Found");
                leaf.mimetype = existingRecord.mimetype;
            }
            if (leaf.language == null){
                //Console.WriteLine("Null Found");
                leaf.language = existingRecord.language;
            }
            if (leaf.reading_time == null){
                //Console.WriteLine("Null Found");
                leaf.reading_time = existingRecord.reading_time;
            } 
            if (leaf.is_archived == null){
                //Console.WriteLine("Null Found");
                leaf.is_archived = existingRecord.is_archived;
            } 
            if (leaf.user_id == null){
                //Console.WriteLine("Null Found");
                leaf.user_id = existingRecord.user_id;
            } 
            if (leaf.url == null){
                //Console.WriteLine("Null Found");
                leaf.url = existingRecord.url;
            }
            if (leaf.user_email == null){
                //Console.WriteLine("Null Found");
                leaf.user_email = existingRecord.user_email;
            } 
            if (leaf.user_name == null){
                //Console.WriteLine("Null Found");
                leaf.user_name = existingRecord.user_name;
            } 
            if (leaf.content == null){
                //Console.WriteLine("Null Found");
                leaf.content = existingRecord.content;
            }
            if (leaf.content_text == null){
                //Console.WriteLine("Null Found");
                leaf.content_text = existingRecord.content_text;
            }
            if (leaf.preview_picture == null){
                //Console.WriteLine("Null Found");
                leaf.preview_picture = existingRecord.preview_picture;
            }
            if (leaf.domain_name == null){
                //Console.WriteLine("Null Found");
                leaf.domain_name = existingRecord.domain_name;
            }
            if (leaf.http_status == null){
                //Console.WriteLine("Null Found");
                leaf.http_status = existingRecord.http_status;
            }
            if (leaf.is_starred == null){
                //Console.WriteLine("Null Found");
                leaf.is_starred = existingRecord.is_starred;
            }
            if (leaf.is_public == null){
                //Console.WriteLine("Null Found");
                leaf.is_public = existingRecord.is_public;
            }
            if (leaf.tags == null){
                //Console.WriteLine("Null Found");
                leaf.tags = existingRecord.tags;
            }
            if (leaf.slugs == null){
                //Console.WriteLine("Null Found");
                leaf.slugs = existingRecord.slugs;
            }
            if (leaf.links == null){
                //Console.WriteLine("Null Found");
                leaf.links = existingRecord.links;
            }
            if (leaf.created_at == null){
                //Console.WriteLine("Null Found");
                leaf.created_at = existingRecord.created_at;
            }
            if (leaf.updated_at == null){
                //Console.WriteLine("Null Found");
                leaf.updated_at = existingRecord.updated_at;
            }

            // TODO if record does not exist, throw error

            // TODO update the all column using fields
            leaf.all = new String[] {leaf.id.ToString(), leaf.title.ToString(), leaf.mimetype.ToString(), leaf.language.ToString(), leaf.reading_time.ToString(),
            leaf.is_archived.ToString(), leaf.user_id.ToString(), leaf.url.ToString(), leaf.user_email.ToString(), leaf.user_name.ToString(), leaf.content.ToString(),
            leaf.content_text.ToString(), leaf.preview_picture.ToString(), leaf.domain_name.ToString(), leaf.http_status.ToString(), leaf.is_starred.ToString(),
            leaf.is_public.ToString(), leaf.tags.ToString(), leaf.slugs.ToString(), leaf.links.ToString(), leaf.created_at.ToString(), leaf.updated_at.ToString()};
            // TODO do other transformation on the record before persisting as well

            // perform upsert on record specified by id
            mapper.Insert(leaf);

            // return back what we got
            return JsonConvert.SerializeObject(leaf);
        }

        // DELETE api/leaves/5
        [HttpDelete("{id}")]
        public void Delete(String id)
        {
            IMapper mapper = new Mapper(Service.Session);
            // if item does not exist, OR if there's multiple, return 404. That's all we need to do with this SELECT.
            var leaf = mapper.Single<Leaf>("WHERE id = ?", id.ToString());

            // if item exists, delete
            mapper.Delete<Leaf>("WHERE id = ?", id.ToString());
        }

        // // POST api/leaves/5/tags
        // // TODO implement
        // [HttpPost("{id}")]
        // public string UpdateTagsById(String id)
        // {
        //     // get record

        //     // set the new tags

        //     // write update to db
        //     IMapper mapper = new Mapper(Service.Session);

        //     // TODO update the all column using fields
        //     // TODO do other transformation on the record before persisting as well
        // }

        // GET api/leaves/5/tags
        // TODO implement
        [HttpGet("{id}/tags")]
        public IEnumerable<string> GetTagsById(string id)
        {
            IMapper mapper = new Mapper(Service.Session);
            // Don't just SELECT tags, in case there are no tags, in which case will return "Sequence contains no elements". We want to return empty list in that case
            Console.WriteLine("SELECT tags FROM " + Table + " WHERE id = " + id);
            // get record by id
            Leaf leaf = mapper.Single<Leaf>("WHERE id = ?", id);
            IEnumerable<string> tags = leaf.tags;

            return tags;
        }

        // // DELETE api/leaves/5/tags
        // // TODO implement
        [HttpDelete("{id}")]
        public ActionResult<string> DeleteTagsById(String id)
        {
            IMapper mapper = new Mapper(Service.Session);
            // get record by id
        

            // delete tags
            Console.WriteLine("DELETE tags FROM " + Table + " WHERE id = " + id);

            // update all, do other transformations
            Console.WriteLine("SELECT tags FROM " + Table + " WHERE id = " + id);
            Leaf leaf = mapper.Single<Leaf>("WHERE id = ?", id);
            IEnumerable<string> tags = leaf.tags;

            return JsonConvert.SerializeObject(leaf);
        }
    }
}
