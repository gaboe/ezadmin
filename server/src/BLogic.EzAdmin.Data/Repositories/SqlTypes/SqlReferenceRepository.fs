namespace BLogic.EzAdmin.Data.Repositories.SqlTypes

open BLogic.EzAdmin.Data.QueryHandler
open BLogic.EzAdmin.Domain.Sql
open BLogic.EzAdmin.Domain.SqlTypes

module SqlReferenceRepository =

        type UniDirectionalReferenceType = To of string | From of string

        type BiDirectionalReferenceType = {To: string; From: string}

        type ReferenceType = UniDirectionalReferenceType of UniDirectionalReferenceType 
                            | BiDirectionalReferenceType of BiDirectionalReferenceType

        let resolveUniDirectionalReferenceType referenceType =
            let getParameters tableName = ["TableName", box tableName]
            let getCondition alias = alias + " = @TableName"
            match referenceType with
                | To table -> (getCondition "C2.TABLE_NAME", getParameters table)
                | From table -> ( getCondition "C.TABLE_NAME", getParameters table)

        let resolveReferenceType referenceType =
            match referenceType with
                | UniDirectionalReferenceType t -> resolveUniDirectionalReferenceType t
                | BiDirectionalReferenceType t ->("C.TABLE_NAME = @FromTable AND C2.TABLE_NAME = @ToTable", ["FromTable", box t.From; "ToTable", box t.To])


        let baseReferenceQuery = """
                                    SELECT
                                    C.CONSTRAINT_NAME [ReferenceName]
                                   ,C.CONSTRAINT_SCHEMA [ToSchema]
                                   ,C.TABLE_NAME [ToTable]
                                   ,KCU.COLUMN_NAME [ToColumn]
                                   ,C2.CONSTRAINT_SCHEMA [FromSchema]
                                   ,C2.TABLE_NAME  [FromTable]
                                   ,KCU2.COLUMN_NAME [FromColumn]

                                    FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS C
                                    INNER JOIN INFORMATION_SCHEMA.KEY_COLUMN_USAGE KCU
                                           ON C.CONSTRAINT_SCHEMA = KCU.CONSTRAINT_SCHEMA
                                               AND C.CONSTRAINT_NAME = KCU.CONSTRAINT_NAME
                                    INNER JOIN INFORMATION_SCHEMA.REFERENTIAL_CONSTRAINTS RC
                                           ON C.CONSTRAINT_SCHEMA = RC.CONSTRAINT_SCHEMA
                                               AND C.CONSTRAINT_NAME = RC.CONSTRAINT_NAME
                                    INNER JOIN INFORMATION_SCHEMA.TABLE_CONSTRAINTS C2
                                           ON RC.UNIQUE_CONSTRAINT_SCHEMA = C2.CONSTRAINT_SCHEMA
                                               AND RC.UNIQUE_CONSTRAINT_NAME = C2.CONSTRAINT_NAME
                                    INNER JOIN INFORMATION_SCHEMA.KEY_COLUMN_USAGE KCU2
                                           ON C2.CONSTRAINT_SCHEMA = KCU2.CONSTRAINT_SCHEMA
                                               AND C2.CONSTRAINT_NAME = KCU2.CONSTRAINT_NAME
                                               AND KCU.ORDINAL_POSITION = KCU2.ORDINAL_POSITION
                                    """

        let getReferences referenceType =
                                        let (condition, parameters) = resolveReferenceType referenceType
                                        query<SqlReference> {
                                        Query = baseReferenceQuery + "WHERE " + condition;
                                        Parameters = parameters
                                        }

        let getReferencesToTable tableName = To tableName |> UniDirectionalReferenceType |> getReferences  


        let getReferencesFromTable tableName = From tableName |> UniDirectionalReferenceType |> getReferences

        let getReferenceConstrainQuery fromTable toTable = 
            {To = toTable; From = fromTable} |> BiDirectionalReferenceType |> getReferences
