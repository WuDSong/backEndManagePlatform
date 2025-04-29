import { defineStore } from "pinia";
import { ref } from "vue";

export const userStore = defineStore('userStore',()=>{
    let userId=ref('1')
    let rid=ref('1')
    let token=ref('')
    let username=ref('admin')
    return{
        userId,username,token,rid
    }
})