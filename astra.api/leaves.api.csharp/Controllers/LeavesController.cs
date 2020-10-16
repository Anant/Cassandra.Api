using System;
using System.Collections.Generic;
using LeavesApi.Interfaces;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;

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
        public ActionResult<IEnumerable<string>> Get()
        {
            // var rows = session.execute("SELECT JSON * FROM " + keyspace + "." + table)
            //     result = []
            //     for row in rows:
            //         #print(type(str(row)))
            //         result.append(json.loads(row.json))
            //     return jsonify(result)
            return new string[] { "datacenter: ", Keyspace};

        }

        // GET api/leaves/test
        [HttpGet("test/{test}")]
        public ActionResult<string> Get(String test)
        {
            var res = Service.Session.Execute("SELECT * FROM system.local");

            return "test" + test + "; datacenter: " + res.First().GetValue<String>("data_center").ToString();
        }

        // GET api/leaves/5
        [HttpGet("{id}")]
        public ActionResult<string> Get(int id)
        {
            return "value";
        }

        // POST api/leaves
        [HttpPost]
        public void Post([FromBody] string value)
        {
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
