using System.Threading.Tasks;
using Cassandra;

namespace LeavesApi.Interfaces
{
    public interface IDataStaxService
    {
        ISession Session { get; }

        Task<System.Tuple<bool, string>> SaveConnection(string username, string password, string keyspace, string secureConnectBundlePath);
        Task<System.Tuple<bool, string>> TestConnection(string username, string password, string keyspace, string secureConnectBundlePath);
    }
}