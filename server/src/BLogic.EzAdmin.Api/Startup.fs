namespace BLogic.EzAdmin.Api

open System
open Microsoft.AspNetCore.Builder
open Microsoft.AspNetCore.Hosting
open Microsoft.AspNetCore.Mvc
open Microsoft.Extensions.Configuration
open Microsoft.Extensions.DependencyInjection
open Microsoft.AspNetCore.Cors

type Startup private () =
    new (configuration: IConfiguration) as this =
        Startup() then
        this.Configuration <- configuration

    // This method gets called by the runtime. Use this method to add services to the container.
    member this.ConfigureServices(services: IServiceCollection) =
        // Add framework services.
        services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_1) |> ignore
        services.AddCors() |> ignore


    // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
    member this.Configure(app: IApplicationBuilder, env: IHostingEnvironment) =
        if (env.IsDevelopment()) then
            app.UseDeveloperExceptionPage() |> ignore
        else
            app.UseHsts() |> ignore

        app.UseHttpsRedirection() |> ignore
        app.UseCors(new Action<_>(
                            fun (b: Infrastructure.CorsPolicyBuilder) -> 
                                b.AllowAnyOrigin() |> ignore;
                                b.AllowAnyHeader() |> ignore;
                                b.AllowAnyMethod() |> ignore
                                )
                    ) |> ignore

        app.UseGraphiQl("/graphiql") |> ignore
        app.UseMvc() |> ignore

    member val Configuration : IConfiguration = null with get, set