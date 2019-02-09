namespace BLogic.EzAdmin.Domain.GraphQL

[<CLIMutable>]
type UnsafeGraphQlQuery =
        { OperationName: string 
          NamedQuery: string
          Query: string
          Variables: Map<string, obj>}