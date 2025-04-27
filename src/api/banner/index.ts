import http from "@/utils/http"
import type { Banner,BannerParam } from "./BannerModel"

//list
export const getBannerListApi = (param:BannerParam) => {
    return http.get("/api/banner/list",param)
}

//add
export const addBannerApi = (param: Banner) => {
    return http.post("/api/banner", param)
}

//update
export const updateBannerApi = (param: Banner) => {
    return http.put("/api/banner", param)
}

//del
export const delBannerApi = (param: string) => {
    return http.delete("/api/banner/" + param)
}

//isOccupied
export const isOccupiedBannerApi =(param:string)=>{
    return http.get("/api/banner/isOccupied/"+param)
}