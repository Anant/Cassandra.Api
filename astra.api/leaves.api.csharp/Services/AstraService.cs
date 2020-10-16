using System;
using Cassandra;
using System.Threading;
using LeavesApi.Models;
using System.Threading.Tasks;
using System.IO;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Collections.Generic;

// borrowed from Datastax example
// based off of https://github.com/DataStax-Examples/getting-started-with-astra-csharp
// https://github.com/DataStax-Examples/getting-started-with-astra-csharp#connecting-to-astra-with-a-secure-connect-bundle



namespace LeavesApi.Services
{
    public class AstraService : Interfaces.IDataStaxService
    {
        private static readonly AstraService _AstraServiceInstance = new AstraService();
        private ISession _session;

    
        public ISession Session
        {

            get
            {
                //If the session is null then create a new one
                if (_session == null)
                {
                    Dictionary<String, String> credData = GetCredData();

                    _session = ConnectToAstra(credData["user"], credData["password"], credData["keyspace"], credData["secureBundlePath"]).Result;

                    //Create the new Astra session then save the parameters to Environment Variables for later use in the same session
                }
                return _session;
            }
        }

        // read UserCred.json file and return as Dictionary
        public Dictionary<string, string> GetCredData()
        {
            var userCredsPath = Path.Combine(Directory.GetCurrentDirectory(), "../../astra.credentials/UserCred.json");

            Dictionary<String, String> creds = new Dictionary<String, String>();

            using (StreamReader reader = File.OpenText(userCredsPath))
            {
                JObject userCredsJson = (JObject)JToken.ReadFrom(new JsonTextReader(reader));

                // var user = Environment.GetEnvironmentVariable("AstraUsername");
                // var password = Environment.GetEnvironmentVariable("AstraPassword");
                // var keyspace = Environment.GetEnvironmentVariable("AstraKeyspace");
                // var secureBundlePath = Environment.GetEnvironmentVariable("SecureConnectBundlePath");
                String cluster = (String)userCredsJson["cluster"];


                creds.Add("user", (String)userCredsJson["username"]);
                creds.Add("password", (String)userCredsJson["password"]);
                creds.Add("keyspace", (String)userCredsJson["keyspace"]);
                creds.Add("cluster", cluster);
                creds.Add("table", (String)userCredsJson["table"]);

                creds.Add("secureBundlePath", Path.Combine(Directory.GetCurrentDirectory(), "../../astra.credentials/secure-connect-" + cluster + ".zip").ToString());
                // Console.WriteLine(secureBundlePath);


            }

            return creds;
        }

        /// <summary>
        /// Creates a connection to Astra with the specified parameters
        /// </summary>
        /// <param name="username">The Astra user name</param>
        /// <param name="password">The Astra password</param>
        /// <param name="keyspace">The keyspace in Astra</param>
        /// <param name="secureConnectBundlePath">The local file path were the secure connect bundle was saved</param>
        /// <returns>The connected session object</returns>
        private async Task<ISession> ConnectToAstra(string username, string password, string keyspace, string secureConnectBundlePath)
        {
            var session = await Cluster.Builder()
                       .WithCloudSecureConnectionBundle(secureConnectBundlePath)
                       .WithCredentials(username, password)
                       .WithQueryOptions(new QueryOptions().SetConsistencyLevel(ConsistencyLevel.LocalQuorum))
                       .Build()
                       .ConnectAsync(keyspace);

            return session;
        }

        /// <summary>
        /// Saves the new Session object from the parameters provided
        /// </summary>
        /// <param name="username">The Astra user name</param>
        /// <param name="password">The Astra password</param>
        /// <param name="keyspace">The keyspace in Astra</param>
        /// <param name="secureConnectBundlePath">The local file path were the secure connect bundle was saved</param>
        /// <returns>A tuple containing the success of the operation and if it failed the error message</returns>
        // TODO Re-implementing now that we are using a file instead of environment variables
        public async Task<Tuple<bool, string>> SaveConnection(string username, string password, string keyspace, string secureConnectBundlePath)
        {
            try
            {
                var session = await ConnectToAstra(username, password, keyspace, secureConnectBundlePath);
                Environment.SetEnvironmentVariable("AstraUsername", username);
                Environment.SetEnvironmentVariable("AstraPassword", password);
                Environment.SetEnvironmentVariable("AstraKeyspace", keyspace);
                Environment.SetEnvironmentVariable("SecureConnectBundlePath", secureConnectBundlePath);
                Interlocked.Exchange(ref _session, session);

                // IF WE WERE USING UDT Register the UDT map for the location UDT so that we can use it from LINQ
                //_session.UserDefinedTypes.Define(UdtMap.For<location_udt>());
                return new Tuple<bool, string>(true, null);
            }
            catch (Exception ex)
            {
                return new Tuple<bool, string>(false, ex.Message);
            }
        }

        /// <summary>
        /// Tests the new Session object from the parameters provided
        /// </summary>
        /// <param name="username">The Astra user name</param>
        /// <param name="password">The Astra password</param>
        /// <param name="keyspace">The keyspace in Astra</param>
        /// <param name="secureConnectBundlePath">The local file path were the secure connect bundle was saved</param>
        /// <returns>A tuple containing the success of the operation and if it failed the error message</returns>
        public async Task<Tuple<bool, string>> TestConnection(string username, string password, string keyspace, string secureConnectBundlePath)
        {
            try
            {
                var session = await ConnectToAstra(username, password, keyspace, secureConnectBundlePath);
                return new Tuple<bool, string>(true, null);
            }
            catch (Exception ex)
            {
                return new Tuple<bool, string>(false, ex.Message);
            }
        }
    }
}