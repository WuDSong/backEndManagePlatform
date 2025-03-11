import http from "@/utils/http"
import type { WxUser, WxUserParam } from "./wxUserModel"

//查找
export const getWxUserListApi = (param: WxUserParam) => {
    return http.get('/api/wxUser/list', param)
}

//新增
export const addWxUserApi = (param: WxUser) => {
    return http.post("/api/wxUser", param)
}

//更新
export const updateWxUserApi = (param: WxUser) => {
    return http.put("/api/wxUser", param)
}

//删除
export const delWxUserApi = (param: string) => {
    return http.delete("/api/wxUser/" + param)
}

//重置密码
export const updatePasswordApi = (param: WxUser) => {
    return http.post("/api/wxUser/updatePassword", param)
}