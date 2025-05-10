import http from "@/utils/http"

export const getUserActiveOneMonthApi = () => {
    return http.get("/api/wxUserActive/getUserActiveOneMonth")
}