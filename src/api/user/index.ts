import http from "@/utils/http";
import type { SySUser, sysUserParam } from "./UserModel";

//查找后台用户列表
export const getSysUserListApi = (param: sysUserParam) => {
    return http.get('/api/sysUser/getList', param)
}

//新增后台用户
export const addSysUserApi = (param: SySUser) => {
    return http.post("/api/sysUser", param)
}

//更新后台用户
export const updateSysUserApi = (param: SySUser) => {
    return http.put("/api/sysUser", param)
}

//删除后台用户
export const delSysUserApi = (param: string) => {
    return http.delete("/api/sysUser/" + param)
}