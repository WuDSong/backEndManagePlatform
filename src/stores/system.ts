import { defineStore } from "pinia";
import { computed, ref } from "vue";

export const systemInfoStore=defineStore('system',()=>{
    let baseUrl=ref('http://localhost:12345')
    let imgBaseUrl=computed(()=>baseUrl.value+'/image/')
    let videoBaseUrl=computed(()=>baseUrl.value+'/video/')
    return{
        baseUrl,imgBaseUrl,videoBaseUrl
    }

})