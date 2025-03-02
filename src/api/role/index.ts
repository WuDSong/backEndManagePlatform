import http from "@/utils/http"

//获取角色列表
export const getRoleListApi = () => {
    return http.get('/api/role/list')
}

//更新