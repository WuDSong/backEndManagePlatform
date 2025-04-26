import http from "@/utils/http"
import type { SysMenu } from "./MenuModel"

//list & tree 获取树形数据
export const getMenuTreeApi = () => {
    return http.get("/api/sysMenu/tree")
}

//add
export const addMenuApi = (param:SysMenu) => {
    return http.post("/api/sysMenu", param)
}

//update
export const updateMenuApi = (param:SysMenu) => {
    return http.put("/api/sysMenu", param)
}

//del
export const delMenuApi = (param: string) => {
    return http.delete("/api/sysMenu/" + param)
}