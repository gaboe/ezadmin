namespace BLogic.EzAdmin.Domain.Sql

type SqlQuery =
    {
        Query: string
        Parameters: (string * obj) list
        Connection: string
    }


module QueryHelpers =

    let p name value =
        ( name, value )


    let sql query parameters connection =
        {
            Query = query
            Parameters = parameters
            Connection = connection
        }