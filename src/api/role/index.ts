import http from "@/utils/http"
import type { AssignMenuParams, Role } from "./RoleModel"

//获取角色列表
export const getRoleListApi = (roleName:string) => {
    return http.get('/api/role/list',{roleName})
}

//add
export const addRoleApi = (param: Role) => {
    return http.post("/api/role", param)
}

//update
export const updateRoleApi = (param: Role) => {
    return http.put("/api/role", param)
}

//del
export const delRoleApi = (rid: string) => {
    return http.delete("/api/role/" + rid)
}

export const assignRoleMenu=(param:AssignMenuParams)=>{
    return http.post("/api/role/assignMenu",param)
}