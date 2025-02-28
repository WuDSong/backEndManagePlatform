import { defineStore } from 'pinia'

interface CollapseState {
    collapse: boolean
}

export const useCollapseStore = defineStore('collapse', {
    state: (): CollapseState => ({
        collapse: false
    }),

    actions: {
        toggleCollapse(): void {
            this.collapse = !this.collapse
        },

        setCollapse(collapse: boolean): void {
            this.collapse = collapse
        }
    },

    persist:true
})


// // 在组件中  
// const { collapse, toggleCollapse, setCollapse } = useCollapseStore()  

// // 切换 collapse 的状态  
// toggleCollapse()  

// // 设置具体的 collapse 值  
// setCollapse(true)