import http from "@/utils/http"
import type { Board, BoardParam } from "./BoardModel"

//分页获取审核通过后的
export const getBoardListApi = (param: BoardParam) => {
    return http.get("/api/board/page", param)
}

//获取审核后的树形数据
export const getBoardTreeApi = () => {
    return http.get("/api/board/tree")
}

//搜索审核后树形数据
export const getSerachBoardTreeApi = (param: string) => {
    return http.get("/api/board/searchTree", { name: param })
}

//add
export const addBoardApi = (param: Board) => {
    return http.post("/api/board", param)
}

//update
export const updateBoardApi = (param: Board) => {
    return http.put("/api/board", param)
}

//del
export const delBoardApi = (id: string) => {
    return http.delete("/api/board/" + id)
}

// 是否重复（同一父板块下）
export const isOccupiedBoardApi = (params: {
    parentId: string | null,
    boardName: string
}) => {
    return http.get("/api/board/isOccupied", params);
}

// 获取待审核的
export const getPendingBoardListApi = (param: BoardParam) => {
    return http.get("/api/board/getPendingBoardList", param)
}

// 审核通过
export const resolvedBoardApi = (param: Board) => {
    return http.put("/api/board/resolved", param)
}

// 获取当前待审版区数目成功/api/board/getCountOfPending
export const getCountOfBoardPendingApi = () => {
    return http.get("/api/board/getCountOfPending")
}