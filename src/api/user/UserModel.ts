import type { Role } from "../role/RoleModel"

//定义用户的数据类型，用于添加，所以不必和数据库一样
export type SySUser = { //默认不是管理员，启用状态
    userid?: string,  //添加新用户时可以不提供，修改时提供，其他带？同样
    username: string,
    password: string,
    sex?: string,
    phone: string,
    rid?: string,
    email: string,
    status?: string,
    role?: Role
}

//Admin用户查找
export type sysUserParam = {
    username: string,
    curPage: Number,
    pageSize: Number,
    total?: number
}

//登录参数
export type LoginParm = {
    username: string,
    password: string,
    code: string
}
