namespace BLogic.EzAdmin.Core

module Utils = 
    open Newtonsoft.Json

    let tee f x =
        f x
        x


