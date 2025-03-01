import http from "@/utils/http";
import type { SySUser, sysUserParam } from "./UserModel";

//后台用户列表
export const getSysUserListApi = (param: sysUserParam) => {
    return http.get('/api/sysUser/getList', param)
}

//新增后台用户
export const addSysUserApi = (param: SySUser) => {
    return http.post("/api/sysUser", param)
}