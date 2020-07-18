using Autofac;
using ZS.DotNet.Tutorial.Domain.Handlers;


namespace ZS.DotNet.Tutorial.Domain
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
            builder.RegisterModule(new DotNet.Tutorial.Data.Module());

            builder
                .RegisterType<DemoHandler>()
                .As<IDemoHandler>()
                .InstancePerLifetimeScope();
            builder
                .RegisterType<SalesRepHandler>()
                .As<ISalesRepHandler>()
                .InstancePerLifetimeScope();

        }

    }
}