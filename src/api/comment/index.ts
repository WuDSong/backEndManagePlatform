import http from "@/utils/http"

// 统计正常评论数量
export const getCountOfNormalCommentApi = () => {
    return http.get("/api/comment/countOfNormal")
}