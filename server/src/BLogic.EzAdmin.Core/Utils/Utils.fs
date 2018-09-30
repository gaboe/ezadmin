namespace BLogic.EzAdmin.Core

module Utils = 
    let tee f x =
        f x
        x

