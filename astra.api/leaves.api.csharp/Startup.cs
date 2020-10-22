using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using LeavesApi.Interfaces;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Http;

namespace LeavesApi
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_1);

            // This adds a singleton of the Astra Session connection to dependency injection
            // borrowed from Datastax example
            // https://github.com/DataStax-Examples/getting-started-with-astra-csharp#managing-cassandra-session-within-a-net-web-application
            services.AddSingleton(typeof(Interfaces.IDataStaxService), typeof(Services.AstraService));
        }

        

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseHsts();
            }

            // handle errors thrown on HTTP Requests, return error message in json object
            // https://stackoverflow.com/a/55166404/6952495
            // note that this makes it so we don't have the pretty Exception view that .net core returns by default in dev env
            app.UseExceptionHandler(a => a.Run(async context =>
            {
                var exceptionHandlerPathFeature = context.Features.Get<IExceptionHandlerPathFeature>();
                var exception = exceptionHandlerPathFeature.Error;
                
                var result = JsonConvert.SerializeObject(new { error = exception.Message });
                context.Response.ContentType = "application/json";
                await context.Response.WriteAsync(result);
            }));

            app.UseHttpsRedirection();
            app.UseMvc();
        }

        // https://stackoverflow.com/a/35257670/6952495
        // to access the session singleton: https://stackoverflow.com/a/57902925/6952495
        // TODO test to make sure it works
        private void OnShutdown(IDataStaxService service)
        {       
            Console.WriteLine("shutting down cluster");

            // Do your cleanup here
            service.Session.Cluster.Shutdown();
        }
    }
}
