using System.Collections.Generic;
using ZS.Core.DataCore.Connection;
using ZS.Core.DataCore.EntityFramework;

namespace ZS.DotNet.Tutorial.Data.Repository
{

    public class VersoDatabaseFactory : IDatabaseFactory
    {
        private readonly IDictionary<IConnectionProvider, DataContextBase> _dict = new Dictionary<IConnectionProvider, DataContextBase>();

        public DataContextBase Get(IConnectionProvider connProvider)
        {
            if (_dict.ContainsKey(connProvider)) return _dict[connProvider];
            var context = new SalesDataContext(connProvider);
            _dict.Add(connProvider, context);
            return context;
        }
    }
}
