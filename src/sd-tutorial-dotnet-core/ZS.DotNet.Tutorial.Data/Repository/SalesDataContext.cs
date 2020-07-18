using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using ZS.Core.DataCore.Connection;
using ZS.Core.DataCore.EntityFramework;

namespace ZS.DotNet.Tutorial.Data.Repository
{


    public class SalesDataContext : PostgresDataContextBase
    {
        public SalesDataContext(IConnectionProvider connectionProvider) : base(connectionProvider)
        {
        }
        protected override string MappingNamespace => "ZS.DotNet.Tutorial.Data.Repository";

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            base.OnConfiguring(optionsBuilder);
            optionsBuilder.UseLoggerFactory(LoggerFactory.Create(builder =>
            {
                builder.AddFilter((category, level) =>
                    category == DbLoggerCategory.Database.Command.Name && level == LogLevel.Information).AddConsole();
            }));
        }



    }
}
