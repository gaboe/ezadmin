namespace BLogic.EzAdmin.Application.Security

module SecurityAppService = 
    open BLogic.EzAdmin.Core.Services.Security.TokenService
    open BLogic.EzAdmin.Application.Models

    let login email password: LoginResult =
                match TokenService.createToken email password with  
                                | Ok token -> {Token = Some (sprintf "Bearer %s" token); ValidationMessage = None}
                                | Error err -> {Token = None; ValidationMessage = Some err}        

