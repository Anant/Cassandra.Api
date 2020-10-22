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

        // GET api/leaves/test/urls
        [HttpGet("field/{field}")]
        public ActionResult<List<string>> GetField(String field)
        {
            // var rows = Service.Session.Execute("SELECT JSON * FROM " + Keyspace + "." + Table);
            var statement = new SimpleStatement("SELECT url, content FROM " + Keyspace + "." + Table + " LIMIT 100;");
            // statement.SetPageSize(500);

            Console.WriteLine("executing statement: " + statement);
            var rows = Service.Session.Execute(statement);
            List<String> rowsList = new List<String>();  

            // this works, but doesn't get all results, just one
            // var content = rows.First().GetValue<String>("url"); //.ToString();
            
            // rowsList.Add(content);    

            // this is parsing into list, but for some reason causes query to run twice
            foreach (var row in rows)
            {
                var content = row.GetValue<String>(field); //.ToString();
                if (content != null) {
                    Console.WriteLine(content);
                    rowsList.Add(content);             

                } else {
                    // if using VS Code run, will output to debug console
                    Console.WriteLine("skipping null...");
                }
            }

            Console.WriteLine("returning result!");
            // return rows.First().GetValue<String>("content").ToString();
            
            return rowsList;

        }


        // GET api/leaves
        [HttpGet]
        public ActionResult<List<string>> Get()
        {
            // TODO might need to not set a limit, if that's what is expected for these APIs
            // Note that using SELECT JSON * has performance disadvantages compared to just doing SELECT * and converting to json in the server instead
            // TODO use mapper and then convert to json using newton json instead, e.g., IEnumerable<Leaf> leaves = mapper.Fetch<Leaf>("SELECT JSON * FROM " + Keyspace + "." + Table + " LIMIT 1000;")
            var statement = new SimpleStatement("SELECT JSON * FROM " + Keyspace + "." + Table + " LIMIT 1000;");
            statement.SetPageSize(500);

            var rows = Service.Session.Execute(statement);

            Console.WriteLine("executing statement: " + statement);
            List<String> rowsList = new List<String>();  

            // this is parsing into list, but for some reason causes query to run twice
            foreach (var row in rows)
            {
                rowsList.Add(row.GetValue<String>("[json]"));             
            }

            Console.WriteLine("returning result!");

            return rowsList;

        }

        // This works, but don't need it
        // GET api/leaves/test
        // [HttpGet("test/{test}")]
        // public ActionResult<string> GetTestResults(String test)
        // {
        //     var res = Service.Session.Execute("SELECT * FROM system.local");

        //     return "test" + test + "; datacenter:all " + res.First().GetValue<String>("data_center").ToString();
        // }

        // GET api/leaves/5
        [HttpGet("{id}")]
        public ActionResult<string> Get(int id)
        {
             // TODO might need to not set a limit, if that's what is expected for these APIs
            var statement = new SimpleStatement("SELECT JSON * FROM " + Keyspace + "." + Table + " WHERE id = ? LIMIT 1;", id);

            var rows = Service.Session.Execute(statement);

            Console.WriteLine("executing statement: " + statement);

            Console.WriteLine("returning result!");

            return rows.First().GetValue<String>("[json]");
        }

        // POST api/leaves
        [HttpPost]
        public string CreateLeaf([FromBody] Leaf leaf)
        {
            leaf.id = Guid.NewGuid().ToString();
            // write to db
            IMapper mapper = new Mapper(Service.Session);
            mapper.Insert(leaf);

            Console.WriteLine("inserted to db!");

            // return back what we got
            return JsonConvert.SerializeObject(leaf);
        }

        // PUT api/leaves/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/leaves/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
