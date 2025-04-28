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