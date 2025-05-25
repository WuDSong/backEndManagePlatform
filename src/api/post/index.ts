import http from "@/utils/http"
import type { PostParam } from "./PostModel"

//list
export const getPostListApi = (param: PostParam) => {
    return http.get("/api/post/list", param)
}

// 通过id查找 post 并且这个post带话题
export const getPostByIdApi = (param: string) => {
    return http.get("/api/post/" + param)
}

// 统计正常post数量
export const getCountOfNormalPostApi = () => {
    return http.get("/api/post/countOfNormal")
}