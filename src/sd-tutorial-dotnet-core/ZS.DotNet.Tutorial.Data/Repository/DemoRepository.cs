using ZS.Core.DataCore.Connection;
using ZS.Core.DataCore.EntityFramework;
using ZS.DotNet.Tutorial.Model;

namespace ZS.DotNet.Tutorial.Data.Repository
{
    public class DemoRepository : RepositoryBase<Dummy,int>, IDemoRepository
    {
        public DemoRepository(IDatabaseFactory databaseFactory, IConnectionProvider connProvider) : base(databaseFactory, connProvider)
        {
        }
    }
}
