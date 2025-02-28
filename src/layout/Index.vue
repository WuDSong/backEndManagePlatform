<template>
    <el-container class="container">
        <!-- 宽度一定不能写死，否则菜单无法收缩 -->
        <el-aside width="auto" class="aside">
            <Menu></Menu>
        </el-aside>
        <el-container>
            <el-header class="header">
                <!-- 折叠按钮 -->
                <Collapse></Collapse>
                <BreadCrumb></BreadCrumb>
            </el-header>
            <el-main class="main">
                <router-view></router-view>
                <!-- 二级路由，主要内容 -->
            </el-main>
        </el-container>
    </el-container>
</template>
<script setup lang="ts">
import Menu from './Menu.vue';
import Collapse from './Collapse.vue';
import BreadCrumb from './BreadCrumb.vue'
</script>
<style lang="scss" scoped>
.container {
    height: 100%;

    .aside {
        background-color: #304156;
        // background-color: pink;
    }

    .header {
        background-color: #009688;
        display: flex;
        align-items: center;
        color: #FFF;
    }

    .main {
        background-color: #e7eaec;
    }
}
</style>