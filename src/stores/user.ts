import { defineStore } from "pinia";
import { ref } from "vue";

export const userStore = defineStore('userStore', () => {
    const userId = ref('')
    const rid = ref('')
    const token = ref('')
    const username = ref('')
    const menuRouterTree = ref([])
    const codeList = ref([])

    const resetStore = () => {
        userId.value = ''
        rid.value = ''
        token.value = ''
        username.value = ''
        menuRouterTree.value = []
        codeList.value = []
    }

    const checkAuth=()=>{
        if(userId.value==''||username.value==''||menuRouterTree.value.length==0){
            return false
        }else return true
    }
    return { userId, username, token, rid, menuRouterTree, codeList,resetStore,checkAuth}
}, {
    persist: {
       storage: sessionStorage
    }
})