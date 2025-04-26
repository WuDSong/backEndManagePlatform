//menu add和修改
export type SysMenu = { 
    menuName: string,
    menuType:number,
    parentId:number,
    path?:string,
    icon?: string,
    sort?: number,
    visible?:number,
    perms:string
}