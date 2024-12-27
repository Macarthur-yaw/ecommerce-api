
enum userRoles{
    user="USER",
    admin="ADMIN"
    }
    type userSchema={
        username:string,
        email:string,
        password:string,
        date:Date
        role:userRoles
        ,verified:boolean
        userCarts:Array<string>,
        favoriteCarts:Array<string>
    }

    export {userRoles,userSchema};
