//menu add和修改
export type SysMenu = {
    mid?:string,
    menuName: string,
    menuType:number,
    parentId:number,
    path?:string,
    icon?: string,
    sort?: number,
    visible?:number,
    perms:string
}

//获取当前用户的被分派菜单树 和 要查询用户被分派菜单id 需要查询的参数
export type getAssignTreeParam={
    userId:string,
    userRid:string,
    rid:string
} 