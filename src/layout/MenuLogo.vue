<template>
    <div class="logo">
        <img :src="MenuLogo" alt="logo" />
        <span class="logo-title" v-if="show">{{ title }}</span>
    </div>
</template>
<script setup lang="ts">
import MenuLogo from "@/assets/Rem.png"
import { ref, watch, onMounted} from "vue";
import { useCollapseStore } from '@/stores/collapse';
const title = ref("ACGN论坛管理后台");

const show = ref(true);//是否展示title，当菜单栏要折叠时不展示，取值与useCollapseStore中的Collapse相反
const store = useCollapseStore()
//监听useCollapseStore的collapse
watch(() => store.collapse, (isCollapsed: boolean) => {
    show.value = isCollapsed;
    if (!isCollapsed) {//如果不折叠，标题应该会被展示出来
        setTimeout(() => {
            show.value = !isCollapsed;
        }, 300);
    } else {
        show.value = !isCollapsed;
    }
});
onMounted(() => {
    show.value=!store.collapse //防刷新后，忘记原来折叠状态
})

</script>
<style lang="scss" scoped>
.logo {
    display: flex;
    width: 100%;
    height: 60px;
    line-height: 60px;
    background: #f3f6ff;
    text-align: center;
    cursor: pointer;
    align-items: center;

    img {
        width: 50px;
        height: 50px;
        margin-right: 3px;
        margin-left: 12px;
        background-color: #fff;
    }

    .logo-title {
        color: #000000;
        font-weight: 800;
        line-height: 60px;
        font-size: 16px;
        font-family: "微软雅黑";
    }
}
</style>