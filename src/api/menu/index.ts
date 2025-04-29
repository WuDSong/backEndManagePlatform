import http from "@/utils/http"
import type { getAssignTreeParam, SysMenu } from "./MenuModel"

//list & tree 获取所有菜单树形数据
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

/** 获取某个角色的菜单数据 树形*/
export const getRoleAssignMenuTree=(param:getAssignTreeParam)=>{
    return http.get("/api/sysMenu/getAssignTree",param);
}