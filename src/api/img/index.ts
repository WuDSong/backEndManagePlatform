import http from "@/utils/http"
//图片上传
export const uploadImageApi = (param: object) => {
    return http.upload("/api/upload/uploadImage", param)
}
