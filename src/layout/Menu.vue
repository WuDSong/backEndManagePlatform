<template>
    <MenuLogo></MenuLogo>
    <!--    页面加载时默认激活菜单的index                                 是否水平折叠       只保持一个子菜单的展开-->
    <el-menu :default-active="activeIndex" class="el-menu-vertical-demo" :collapse="isCollapse" unique-opened router
        @open="handleOpen" @close="handleClose" background-color="#304156">
        <MenuItem :menuList="menuList">
        </MenuItem>
    </el-menu>
</template>
<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import MenuItem from './MenuItem.vue';
import { useRoute } from 'vue-router'; //获取路由信息
import MenuLogo from './MenuLogo.vue'
import { useCollapseStore } from '@/stores/collapse';
//获取路由信息
const route = useRoute();
//获取激活的父菜单，解决刷新页面后，父菜单折叠而导致子菜单不可见
const activeIndex = computed(() => {
    const { path } = route;
    console.log("获取激活的父菜单" + path);
    return path;
})


//实现导航折叠
const isCollapse = computed(() => {
    return useCollapseStore().collapse
})
//sub-menu展开
const handleOpen = (key: string, keyPath: string[]) => {
    console.log("sub-menu open");
    console.log(key, keyPath)
}
//sub-menu关闭
const handleClose = (key: string, keyPath: string[]) => {
    console.log("sub-menu close");
    console.log(key, keyPath)
}

//菜单数据 测试
let menuList = reactive([
    {
        path: "/dashboard",
        component: "Layout",
        name: "dashboard",
        meta: {
            title: "首页",
            icon: "HomeFilled",
            roles: ["sys:dashboard"],
        },
    },
    {
        path: "/system",
        component: "Layout",
        name: "system",
        meta: {
            title: "系统管理",
            icon: "Setting",
            roles: ["sys:manage"],
        },
        children: [
            {
                path: "/adminList",
                component: "/system/AdminUser",
                name: "adminUser",
                meta: {
                    title: "权限管理",
                    icon: "UserFilled",
                    roles: ["sys:adminUser"],
                },
            },
            {
                path: "/userList",
                component: "/system/UserList",
                name: "userList",
                meta: {
                    title: "用户管理",
                    icon: "Wallet",
                    roles: ["sys:userList"],
                },
            },
            {
                path: "/menuList",
                component: "/system/MenuList",
                name: "menuList",
                meta: {
                    title: "菜单管理",
                    icon: "Menu",
                    roles: ["sys:menu"],
                },
            },
        ],
    },
    {
        path: "/communityManage",
        component: "Layout",
        name: "communityManage",
        meta: {
            title: "社区管理",
            icon: "Setting",
            roles: ["sys:communityManage"],
        },
        children: [
            {
                path: "/board",
                component: "/communityManage/Board",
                name: "board",
                meta: {
                    title: "版区管理",
                    icon: "UserFilled",
                    roles: ["sys:board"],
                },
            },
            {
                path: "/post",
                component: "/communityManage/PostList",
                name: "postList",
                meta: {
                    title: "帖子管理",
                    icon: "Wallet",
                    roles: ["sys:postList"],
                },
            },
        ],
    },
    {
        path: "/comment",
        component: "Layout",
        name: "comment",
        meta: {
            title: "评论管理",
            icon: "Setting",
            roles: ["sys:comment"],
        },
        children: [
            {
                path: "/commentList",
                component: "/comment/CommentList",
                name: "commentList",
                meta: {
                    title: "评论列表",
                    icon: "UserFilled",
                    roles: ["sys:commentList"],
                },
            },
        ],
    },
    {
        path: "/banner",
        component: "Layout",
        name: "banner",
        meta: {
            title: "广告管理",
            icon: "Setting",
            roles: ["sys:banner"],
        },
        children: [
            {
                path: "/bannerList",
                component: "banner/BannerList",
                name: "bannerList",
                meta: {
                    title: "广告列表",
                    icon: "Postcard",
                    roles: ["sys:bannerList"],
                },
            },
        ],
    },
    {
        path: "/report",
        component: "Layout",
        name: "report",
        meta: {
            title: "投诉管理",
            icon: "Setting",
            roles: ["sys:report"],
        },
        children: [
            {
                path: "/reportList",
                component: "report/ReportList",
                name: "reportList",
                meta: {
                    title: "投诉列表",
                    icon: "Postcard",
                    roles: ["sys:reportList"],
                },
            },
        ],
    }
]);

</script>
<style lang="scss" scoped>
.el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 230px;
    min-height: 400px;
}

.el-menu {
    border-right: none;
}

:deep(.el-sub-menu .el-sub-menu__title) {
    color: #f4f4f5 !important;
}

:deep(.el-menu .el-menu-item) {
    color: #bfcbd9;
}

/* 菜单点中文字的颜色 */
:deep(.el-menu-item.is-active) {
    color: #409eff !important;
}

/* 当前打开菜单的所有子菜单颜色 */
:deep(.is-opened .el-menu-item) {
    background-color: #1f2d3d !important;
}

/* 鼠标移动菜单的颜色 */
:deep(.el-menu-item:hover) {
    background-color: #001528 !important;
}
</style>