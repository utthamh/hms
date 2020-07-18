using Autofac;
using ZS.OE.Commons.Configuration;
using ZS.OE.Commons.Providers;

namespace ZS.DotNet.Tutorial.API
{
    public class Module:Autofac.Module
    {
     
        protected override void Load(ContainerBuilder builder)
    {
            builder.RegisterModule(new DotNet.Tutorial.Domain.Module());
         
            builder.RegisterType<CoreConfigurationManager>()
           .As<IConfigurationManager>().InstancePerLifetimeScope();
            
            
            builder.RegisterType<UserProvider>().As<IUserProvider>().InstancePerLifetimeScope();
            
    }
    }
}