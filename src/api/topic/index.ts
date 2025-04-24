import http from "@/utils/http"
import type { Topic,TopicParam } from "./TopicModel"

//list
export const getTopicListApi = (param:TopicParam) => {
    return http.get("/api/topic/list",param)
}

//add
export const addTopicApi = (param: Topic) => {
    return http.post("/api/topic", param)
}

//update
export const updateTopicApi = (param: Topic) => {
    return http.put("/api/topic", param)
}

//del
export const delTopicApi = (param: string) => {
    return http.delete("/api/topic/" + param)
}

//isOccupied
export const isOccupiedTopicApi =(param:string)=>{
    return http.get("/api/topic/isOccupied/"+param)
}