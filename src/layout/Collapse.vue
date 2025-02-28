<template>
    <el-icon :size="30" style="cursor: pointer;color: #FFF;" @click="iconClick">
        <!-- 动态组件:有些场景会需要在两个组件间来回切换 -->
        <component :is="status ? Expand : Fold"></component>
    </el-icon>
</template>
<script setup lang="ts">
import { Expand, Fold } from "@element-plus/icons-vue";
import { computed } from 'vue';
import { useCollapseStore } from '@/stores/collapse';
// 引入store
const store = useCollapseStore()
// 获取状态
const status = computed(() => {
    return store.getCollapse
})
// 点击图标
const iconClick = () => {
    store.setCollapse(!store.collapse)
    console.log("切换菜单");
}

</script>
<style scoped></style>