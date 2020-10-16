using System.Threading.Tasks;
using Cassandra;
using System.Collections.Generic;
using System;


namespace LeavesApi.Interfaces
{
    public interface IDataStaxService
    {
        ISession Session { get; }
        Dictionary<String, String> GetCredData();

        Task<System.Tuple<bool, string>> SaveConnection(string username, string password, string keyspace, string secureConnectBundlePath);
        Task<System.Tuple<bool, string>> TestConnection(string username, string password, string keyspace, string secureConnectBundlePath);
    }
}