import http from "@/utils/http"
import type { Board, BoardParam } from "./BoardModel"

//list
export const getBoardListApi = (param:BoardParam) => {
    return http.get("/api/board/list",param)
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