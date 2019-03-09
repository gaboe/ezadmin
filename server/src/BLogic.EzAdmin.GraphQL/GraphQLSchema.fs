namespace BLogic.EzAdmin.GraphQL

open BLogic.EzAdmin.Application.SqlTypes

module GraphQLSchema = 
    open BLogic.EzAdmin.GraphQL.InputGraphQLTypes
    open BLogic.EzAdmin.GraphQL.QueryGraphQLTypes
    open BLogic.EzAdmin.Domain.GraphQL
    open BLogic.EzAdmin.Core.Services.Security.TokenService
    open BLogic.EzAdmin.Core.Services.Application.ApplicationService
    open BLogic.EzAdmin.Core.Services.Application
    open BLogic.EzAdmin.Core.Services.Users
    open DefineExtensions
    open FSharp.Data.GraphQL
    open FSharp.Data.GraphQL.Types
    open FSharp.Data.GraphQL.Server.Middlewares
    open MongoDB.Bson
    open BLogic.EzAdmin.Application.Security

    let schemaConfig = SchemaConfig.Default
    
    let RootType =
        Define.Object<Root>(
            name = "Root",
            description = "The Root type to be passed to all our resolvers",
            isTypeOf = (fun o -> o :? Root),
            fieldsFn = fun () ->
            [
                Define.Field("token", String, "Token of the client", fun _ r -> match r.Token with Some v -> v | None -> "")
            ])
   
    let Query =
        Define.Object<Root>(
            name = "Query",
            fields = [
                Define.AuthorizedField("schemas", ListOf (SqlSchemaType), "Get db schemas", fun _ root -> SqlTypesAppService.getAllSchemas root.Token)
                Define.Field("tables", ListOf (SqlTableType), "Get db tables by schema name", [ Define.Input("schemaName", String) ],
                            fun ctx root -> let schemaName = ctx.Arg("schemaName")
                                            SqlTypesAppService.getTables root.Token schemaName)
                Define.Field("columns", ListOf (SqlColumnType), "Get table columns by table name", [ Define.Input("tableName", String) ],
                            fun ctx root -> let tableName = ctx.Arg("tableName")
                                            SqlTypesAppService.getColumns root.Token tableName)
                Define.Field("table", Nullable (SqlTableType), "Get db table by table name", [ Define.Input("schemaName", String); Define.Input("tableName", String) ],
                            fun ctx root -> let schemaName = ctx.Arg("schemaName") 
                                            let tableName = ctx.Arg("tableName")
                                            SqlTypesAppService.getTable root.Token schemaName tableName)
                Define.Field("appPreview", AppType, "Return preview of app", [ Define.Input("input", AppInputType) ],  fun ctx _ -> ctx.Arg("input") |> BLogic.EzAdmin.Core.Engines.Engine.getAppPreview)
                Define.Field("app", AppType, "Returns application", [ Define.Input("id", String) ],  fun ctx _ -> ctx.Arg("id") |> ApplicationService.getApp)
                Define.AuthorizedField(
                                        "userApplications",
                                        ListOf(UserAppType),
                                        "Return user applications",
                                        fun _ root -> 
                                            let userID = TokenService.getUserID root.Token |> Option.bind (fun e -> ObjectId.Parse e |> Some)
                                            match userID with 
                                                | Some userID -> ApplicationService.getApps userID
                                                | None -> List.Empty
                                        )
                Define.AuthorizedField(
                                        "currentApp",
                                        Nullable(UserAppType),
                                        "Return current applicationID from token",
                                        fun _ root ->  TokenService.getAppID root.Token
                                                        |> Option.bind (fun appID -> ApplicationService.getUserApp appID |> Some) 
                                        )
                ]
            )

    let Mutation =
        Define.Object<Root>(
            name = "Mutation",
            fields = [
                Define.Field(
                    "signup",
                    LoginResult,
                    "If succesfull returns token",
                    [ Define.Input("email", String); Define.Input("password", String) ],
                    fun ctx _ ->  
                            let email = ctx.Arg("email") 
                            let password = ctx.Arg("password") 
                            UserService.signUp email password |> ignore
                            SecurityAppService.login email password
                    );
                Define.Field(
                    "login",
                    LoginResult,
                    "If succesfull returns token",
                    [ Define.Input("email", String); Define.Input("password", String) ],
                    fun ctx _ ->  
                            let email = ctx.Arg("email") 
                            let password = ctx.Arg("password") 
                            SecurityAppService.login email password
                    );
                Define.Field(
                    "setAppID",
                    LoginResult,
                    "If succesfull returns token",
                    [ Define.Input("appID", String); ],
                    fun ctx root ->  
                            ctx.Arg("appID") 
                            |> TokenService.setAppID root.Token
                                |> (fun e -> {  Token = e |> Option.bind (fun token -> sprintf "Bearer %s" token |> Some);
                                                ValidationMessage = None})
                    );                
                Define.Field(
                    "saveView",
                    SaveViewResult,
                    "Saves designed view",
                     [ Define.Input("input", AppInputType) ],
                     fun ctx _ -> ctx.Arg("input") |> saveView |> (fun cid -> {Cid = cid})
                    );
                Define.Field(
                    "createApplication",
                    CreateApplicationResult,
                    "",
                    [ Define.Input("name", String); Define.Input("connection", String) ],
                     fun ctx root ->
                                let name = ctx.Arg("name") 
                                let connection = ctx.Arg("connection") 
                                let userID = TokenService.getUserID root.Token |> Option.bind (fun e -> ObjectId.Parse e |> Some)
                                match userID with 
                                    | Some userID -> ApplicationService.createApplication name connection userID |> ignore
                                                     { Message = "OK" }
                                    | None -> {Message = ""}
                    );
                    
    ]
    )

    let schema = Schema(Query, Mutation, config = schemaConfig)

    let middlewares = 
        [ Define.QueryWeightMiddleware(2.0, true)
          Define.LiveQueryMiddleware() ]

    let executor = Executor(schema, middlewares)

    let root = { Token = Option.None }