using System;
using System.Collections.Generic;
using LeavesApi.Interfaces;
using LeavesApi.Models;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;
using Newtonsoft.Json;
using Cassandra.Mapping;


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
        public string CreateLeaf([FromBody] Leaf leaf)
        {
            if (leaf.id == null) {
                leaf.id = Guid.NewGuid().ToString();
            }

            // write to db
            IMapper mapper = new Mapper(Service.Session);
            mapper.Insert(leaf);

            // TODO update the all column using fields
            // TODO do other transformation on the record before persisting as well

            // return back what we got
            return JsonConvert.SerializeObject(leaf);
        }

        // PATCH api/leaves/5
        [HttpPatch("{id}")]
        public string Patch(int id, [FromBody] Leaf leaf)
        {
            leaf.id = id.ToString();
            IMapper mapper = new Mapper(Service.Session);

            // if item does not exist, OR if there's multiple, return 404. That's all we need to do with this SELECT.
            var existingRecord = mapper.Single<Leaf>("WHERE id = ?", id.ToString());

            // write update to db

            // TODO if record does not exist, throw error

            // TODO update the all column using fields
            // TODO do other transformation on the record before persisting as well

            // perform upsert on record specified by id
            mapper.Insert(leaf);

            // return back what we got
            return JsonConvert.SerializeObject(leaf);
        }

        // DELETE api/leaves/5
        [HttpDelete("{id}")]
        public void Delete(int id)
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
        // public string UpdateTagsById(int id)
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
        // [HttpDelete("{id}")]
        // public string DeleteTagsById(int id)
        // {
        //     IMapper mapper = new Mapper(Service.Session);
        //     // get record by id
        

        //     // delete tags

        //     // update all, do other transformations
        // }
    }
}
