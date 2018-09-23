namespace BLogic.EzAdmin.GraphQL

type Root =
    { ClientId: string }
type DomainSchema = BLogic.EzAdmin.Domain.Schema.Schema.Schema

module GraphQLSchema = 
    open FSharp.Data.GraphQL
    open FSharp.Data.GraphQL.Types
    open FSharp.Data.GraphQL.Server.Middlewares

    let schemaConfig = SchemaConfig.Default

    let rec SchemaType =
       Define.Object<DomainSchema>(
            name = "Schema",
            description = "",
            isTypeOf = (fun o -> o :? DomainSchema),
            fieldsFn = fun () ->
            [
                Define.Field("name", String, "Schema name", fun _ (s: DomainSchema) -> s.Name)
            ])
    and RootType =
        Define.Object<Root>(
            name = "Root",
            description = "The Root type to be passed to all our resolvers",
            isTypeOf = (fun o -> o :? Root),
            fieldsFn = fun () ->
            [
                Define.Field("clientid", String, "The ID of the client", fun _ r -> r.ClientId)
            ])

    let _schema: DomainSchema = {Name = "makau"} 
    let schemas = [ _schema ] |> List.toSeq

    let Query =
        Define.Object<Root>(
            name = "Query",
            fields = [
                Define.Field("schemas", ListOf (SchemaType), "Get db schemas", fun _ __ -> schemas)
                ]
            )

    let Subscription =
        Define.SubscriptionObject<Root>(
            name = "Subscription",
            fields = [
                Define.SubscriptionField(
                    "watchMoon",
                    RootType,
                    SchemaType,
                    "Fake subscription",
                    [ Define.Input("id", String) ],
                    (fun ctx _ (p: DomainSchema) -> if ctx.Arg("id") = p.Name then Some p else None)) ])

    let Mutation =
        Define.Object<Root>(
            name = "Mutation",
            fields = [
                Define.Field(
                    "setMoon",
                    Nullable SchemaType,
                    "Sets a moon status",
                    [ Define.Input("id", String); Define.Input("ismoon", Boolean) ],
                    fun ctx _ ->
                        Some _schema
    )])

    let schema = Schema(Query, Mutation, Subscription, schemaConfig)

    let middlewares = 
        [ Define.QueryWeightMiddleware(2.0, true)
          Define.LiveQueryMiddleware() ]

    let executor = Executor(schema, middlewares)

    let root = { ClientId = "5" }