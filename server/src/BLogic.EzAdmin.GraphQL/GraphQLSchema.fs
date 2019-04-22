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
    open BLogic.EzAdmin.Application.Schemas
    open BLogic.EzAdmin.Application.Engines

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
                Define.AuthorizedField("tables", ListOf (SqlTableType), "Get db tables by schema name", [ Define.Input("schemaName", String) ],
                            fun ctx root -> let schemaName = ctx.Arg("schemaName")
                                            SqlTypesAppService.getTables root.Token schemaName)
                Define.AuthorizedField("columns", ListOf (SqlColumnType), "Get table columns by table name", [ Define.Input("tableName", String) ],
                            fun ctx root -> let tableName = ctx.Arg("tableName")
                                            SqlTypesAppService.getColumns root.Token tableName)
                Define.AuthorizedField("table", Nullable (SqlTableType), "Get db table by table name", [ Define.Input("schemaName", String); Define.Input("tableName", String) ],
                            fun ctx root -> let schemaName = ctx.Arg("schemaName") 
                                            let tableName = ctx.Arg("tableName")
                                            SqlTypesAppService.getTable root.Token schemaName tableName)
                Define.AuthorizedField("appPreview", Nullable(AppType), "Return preview of app", [ Define.Input("input", AppInputType) ], fun ctx root -> ctx.Arg("input") |> EngineAppService.getAppPreview root.Token)
                Define.AuthorizedField("app", Nullable(AppType), "Returns application", 
                            [ Define.Input("id", String); Define.Input("pageID", Nullable(String)); Define.Input("offset", Int); Define.Input("limit", Int);],
                            fun ctx _ -> let appID = ctx.Arg("id")
                                         let offset = ctx.Arg("offset")
                                         let limit = ctx.Arg("limit")
                                         let pageID = ctx.Args.TryFind "pageID"
                                         match pageID with 
                                            | Some maybeId -> let u: string option = unbox maybeId
                                                              match u with 
                                                                | Some id -> EngineAppService.getAppWithPage appID id offset limit
                                                                | None -> EngineAppService.getApp appID offset limit |> Some
                                            | None -> EngineAppService.getApp appID offset limit |> Some)
                Define.AuthorizedField("entity", Nullable(EntityType), "Get db tables by schema name", [ Define.Input("pageID", String); Define.Input("entityID", String) ],
                                           fun ctx root -> let pageID = ctx.Arg("pageID")
                                                           let entityID = ctx.Arg("entityID")
                                                           EngineAppService.getEntity root.Token pageID entityID 
                                        )
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
                    LoginResultType,
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
                    LoginResultType,
                    "If succesfull returns token",
                    [ Define.Input("email", String); Define.Input("password", String) ],
                    fun ctx _ ->  
                            let email = ctx.Arg("email") 
                            let password = ctx.Arg("password") 
                            SecurityAppService.login email password
                    );
                Define.AuthorizedField(
                    "setAppID",
                    LoginResultType,
                    "If succesfull returns token",
                    [ Define.Input("appID", String); ],
                    fun ctx root ->  
                            ctx.Arg("appID") 
                            |> TokenService.setAppID root.Token
                                |> (fun e -> {  Token = e |> Option.bind (fun token -> sprintf "Bearer %s" token |> Some);
                                                ValidationMessage = None})
                    );                
                Define.AuthorizedField(
                    "saveView",
                    SaveViewResultType,
                    "Saves designed view",
                     [ Define.Input("input", AppInputType) ],
                     fun ctx root -> let input = ctx.Arg("input")
                                     SchemaAppService.saveView root.Token input 
                                        |> (fun appID -> {AppID = appID})
                    );
                Define.AuthorizedField(
                    "createApplication",
                    CreateApplicationResultType,
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
                 Define.AuthorizedField(
                    "deleteEntity",
                    DeleteEnityResultType,
                    "",
                    [ Define.Input("appID", String); Define.Input("pageID", String); Define.Input("entityID", String) ],
                     fun ctx _ ->
                                let appID = ctx.Arg("appID") 
                                let entityID = ctx.Arg("entityID") 
                                let pageID = ctx.Arg("pageID") 
                                let result = EngineAppService.deleteEntity appID pageID entityID 
                                match result with 
                                    | Ok _ -> { WasDeleted = true; Message = "" }
                                    | Error e -> { WasDeleted = false; Message = e }
                    );
                    Define.AuthorizedField(
                       "updateEntity",
                       UpdateEntityResultType,
                       "",
                       [ Define.Input("input", UpdateEntityInputType)],
                        fun ctx root ->
                                   let input = ctx.Arg("input") 
                                   let result = EngineAppService.updateEntity root.Token input
                                   match result with 
                                       | Ok _ -> { WasUpdated = true; Message = "" }
                                       | Error e -> { WasUpdated= false; Message = e }
                       );
                    
    ]
    )

    let schema = Schema(Query, Mutation, config = schemaConfig)

    let middlewares = 
        [ Define.QueryWeightMiddleware(2.0, true)
          Define.LiveQueryMiddleware() ]

    let executor = Executor(schema, middlewares)

    let root = { Token = Option.None }