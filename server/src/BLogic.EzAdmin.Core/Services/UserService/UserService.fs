namespace BLogic.EzAdmin.Core.Services.Users

open BLogic.EzAdmin.Data.Repositories.Users

module UserService = 
    let signUp name password = 
        let user = UserRepository.createUser name password
        user

    let getUser name password = UserRepository.getUser name password