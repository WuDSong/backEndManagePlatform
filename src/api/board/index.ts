import http from "@/utils/http"
import type { Board, BoardParam } from "./BoardModel"

//list 审核后的
export const getBoardListApi = (param: BoardParam) => {
    return http.get("/api/board/listReviewed", param)
}

//Tree 审核后的
export const getBoardTreeApi = () => {
    return http.get("/api/board/tree")
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
export const delBoardApi = (param: string) => {
    return http.delete("/api/board/" + param)
}

//isOccupied
export const isOccupiedBoardApi = (param: string) => {
    return http.get("/api/board/isOccupied/" + param)
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