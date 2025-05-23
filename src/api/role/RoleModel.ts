//role 用于添加修改
export type Role = { //默认不是管理员，启用状态
    rid?: string,  //添加新用户时可以不提供，修改时提供，其他带？同样
    roleName: string,
    roleKey: string,
    description?: string | null
}

export interface AssignMenuParams {
    rid: number|string;
    menuIds: number[]; // 全量菜单ID数组
}