import { defineStore } from "pinia";
import { ref } from "vue";

export const userStore = defineStore('userStore',()=>{
    let userId=ref('')
    let token=ref('')
    let username=ref('')
    return{
        userId,username,token
    }
})