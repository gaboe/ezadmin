namespace BLogic.EzAdmin.Domain.GraphQL

type UnsafeGraphQlQuery =
        { OperationName: string 
          NamedQuery: string
          Query: string
          Variables: Map<string, obj>}