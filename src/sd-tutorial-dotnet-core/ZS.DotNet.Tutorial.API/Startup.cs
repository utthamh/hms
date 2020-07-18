using Autofac;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using StartupBase = ZS.OE.Commons.Restful.Core.StartupBase;

namespace ZS.DotNet.Tutorial.API
{
    public class Startup : StartupBase
    {
        public Startup(IConfiguration configuration) : base(configuration)
        {

        }

        // This method gets called by the runtime. Use this method to add services to the container.
        protected override void ConfigureJsonOptions(MvcNewtonsoftJsonOptions options)
        {

            options.SerializerSettings.Converters.Add(new Newtonsoft.Json.Converters.StringEnumConverter());
            options.SerializerSettings.ReferenceLoopHandling = ReferenceLoopHandling.Ignore;

        }
        public override void ConfigureServices(IServiceCollection services)
        {
            base.ConfigureServices(services);
            services.AddControllers().AddNewtonsoftJson(ConfigureJsonOptions);
        }
        public override void ConfigureContainer(ContainerBuilder builder)
        {
            base.ConfigureContainer(builder);
            builder.RegisterModule(new Module());
        }
        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.

        public override void Configure(IApplicationBuilder app, IWebHostEnvironment env, ILoggerFactory loggerFactory)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseHttpsRedirection();

            app.UseRouting();
            app.UseCors(builder => builder.AllowAnyHeader().AllowAnyMethod().AllowAnyOrigin());

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });

        }

    }

}
