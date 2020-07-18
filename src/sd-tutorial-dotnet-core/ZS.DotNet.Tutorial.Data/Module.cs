using Autofac;
using ZS.Core.DataCore.Connection;
using ZS.Core.DataCore.EntityFramework;
using ZS.DotNet.Tutorial.Data.Constants;
using ZS.DotNet.Tutorial.Data.Repository;
using ZS.OE.Commons.Configuration;
using ZS.OE.Commons.Providers;
using IUnitOfWork = ZS.Core.DataCore.IUnitOfWork;

namespace ZS.DotNet.Tutorial.Data
{
    public class Module : Autofac.Module
    {
        protected override void Load(ContainerBuilder builder)
        {
            Register(builder);
            base.Load(builder);
        }
        private void Register(ContainerBuilder builder)
        {
            builder.RegisterModule<ZS.Core.DataCore.Module>();

            builder.RegisterType<DbConnectionProvider>()
                .As<IConnectionProvider>()
                .InstancePerLifetimeScope();

            builder
                .RegisterType<UnitOfWork>()
                .As<IUnitOfWork>()
                .InstancePerLifetimeScope();

            builder
                .RegisterType<VersoDatabaseFactory>()
                .As<IDatabaseFactory>()
                .InstancePerLifetimeScope();
            builder
                .RegisterType<UserProvider>()
                .As<IUserProvider>()
                .InstancePerLifetimeScope();

            builder
               .RegisterType<DemoRepository>()
               .As<IDemoRepository>()
               .InstancePerLifetimeScope();

        }
    }

    public class DbConnectionProvider : PostgresConnectionProvider
    {
        public DbConnectionProvider(IConfigurationManager configurationManager) : base(configurationManager.GetConnectionString(ApplicationConstants.DbConnectionKey))
        {
        }
    }
}
