//用于分页查找
export type WxUserParam={
    username: string,
    curPage:Number,
    pageSize:Number,
    total?:number
}

//定义用户的数据类型，用于添加/修改,不必和数据库一样比如时间
export type WxUser = {
    userId?: string,  
    username: string,
    passwordHash: string,
    email: string,
    avatarUrl?:string
    status?:string
}