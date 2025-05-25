import http from "@/utils/http"
import type { MyCommentReport } from "./ReportModel"
export type ReportParam = {
    curPage: number,
    pageSize: number,
    total?: number
}
// 获取post
export const getPostReportListApi = (param: ReportParam) => {
    return http.get("/api/report/controversyPost", param)
}
// 获取Comment
export const getCommentReportListApi = (param: ReportParam) => {
    return http.get("/api/report/comment", param)
}
// 获取app建议
export const getAppSuggestionListApi = (param: ReportParam) => {
    return http.get("/api/report/app", param)
}

// 同意
export const resolvedReportApi = (param: any) => {
    return http.put("/api/report/resolved", param)
}

// 驳回
export const rejectedReportApi = (param: any) => {
    return http.put("/api/report/rejected", param)
}

// 分类获取对应数量  getCountByType
export const getCountOfReportByTypeApi = () => {
    return http.get("/api/report/getCountByType")
}