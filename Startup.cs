using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AspNetCore_SPA.Persistence;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.SpaServices.Webpack;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using AutoMapper;
using AspNetCore_SPA.Core;
using AspNetCore_SPA.Core.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using AspNetCore_SPA.Controllers;

namespace AspNetCore_SPA
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public Startup(IHostingEnvironment env)
        {
            var builder = new ConfigurationBuilder()
                            .SetBasePath(env.ContentRootPath)
                            .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
                            .AddJsonFile($"appsettings.{env.EnvironmentName}.json", optional: true, reloadOnChange: true);

            if (env.IsDevelopment())
                builder = builder.AddUserSecrets<Startup>();
                            
            builder = builder.AddEnvironmentVariables();

            Configuration = builder.Build();
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.Configure<PhotoSettings>(Configuration.GetSection("PhotoSettings"));
            services.AddAutoMapper();

            services.AddDbContext<MyDbContext>(options => options.UseSqlServer(Configuration.GetConnectionString("Default")));

            services.AddScoped<IVehicleRepository, VehicleRepository>();
            services.AddScoped<IPhotoRepository, PhotoRepository>();
            services.AddScoped<IUnitOfWork, UnitOfWork>();
            services.AddTransient<IPhotoService, PhotoService>();

            //In future, depending on environment (DEV, PROD), we want to use different storage, DEV = local file, PROD = Azure ect.
            services.AddTransient<IPhotoStorage, FileSystemPhotoStorage>();

            services.AddAuthorization(options => {
                //policy.RequireClaim("https://aspcorespa.core/roles"), "Admin" comes from Auth0 rules, when setting accessToken
                options.AddPolicy(Policies.RequireAdminRole, policy => policy.RequireClaim("https://aspcorespa.core/roles", "Admin"));
            });

            services.AddMvc();

            // 1. Add Authentication Services
            services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;

            }).AddJwtBearer(options =>
            {
                options.Authority = "https://aspnetcorespaudemy.eu.auth0.com/";
                options.Audience = "https://api.aspcorespa.com";
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseWebpackDevMiddleware(new WebpackDevMiddlewareOptions
                {
                    HotModuleReplacement = true
                });
            }
            else
            {
                app.UseExceptionHandler("/Home/Error");
            }

            app.UseStaticFiles();

            // 2. Enable authentication middleware
            app.UseAuthentication();

            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "default",
                    template: "{controller=Home}/{action=Index}/{id?}");

                routes.MapSpaFallbackRoute(
                    name: "spa-fallback",
                    defaults: new { controller = "Home", action = "Index" });
            });
        }
    }
}
