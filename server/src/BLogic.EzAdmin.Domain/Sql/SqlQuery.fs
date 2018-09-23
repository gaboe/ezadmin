namespace BLogic.EzAdmin.Domain.Sql

type SqlQuery =
    {
        Query : string
        Parameters : (string * obj) list
    }


module QueryHelpers =

    let p name value =
        ( name, value )


    let sql query parameters =
        {
            Query = query
            Parameters = parameters
        }