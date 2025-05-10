import { createRouter, createWebHistory } from 'vue-router'
import Layout from "@/layout/Index.vue"
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/dashboard' //test
    },
    {
      path: "/home",
      component: Layout,
      redirect: "/dashboard",
      children: [
        {
          path: "/dashboard",
          component: () => import("@/views/Dashboard.vue"),
          name: "dashboard",
          meta: {
            title: "首页",
            icon: "#icondashboard",
            requiresAuth: true  //// 需要登录认证
          },
        },
      ],
    },

    {
      path: "/system",
      component: Layout,
      name: "system",
      meta: {
        title: "系统管理",
        icon: "Setting",
        roles: ["sys:manage"],
      },
      children: [
        {
          path: "/adminList",
          component: () => import("@/views/system/AdminList.vue"),
          name: "adminList",
          meta: {
            title: "管理员管理",
            icon: "UserFilled",
            roles: ["sys:adminList"],
            requiresAuth: true  //// 需要登录认证
          },
        },
        {
          path: "/userList",
          component: () => import("@/views/system/UserList.vue"),
          name: "userList",
          meta: {
            title: "用户管理",
            icon: "Wallet",
            roles: ["sys:userList"],
            requiresAuth: true  //// 需要登录认证
          },
        },
        {
          path: "/menuList",
          component: () => import("@/views/system/MenuList.vue"),
          name: "menuList",
          meta: {
            title: "菜单管理",
            icon: "Menu",
            roles: ["sys:menu"],
            requiresAuth: true  //// 需要登录认证
          },
        },
        {
          path: "/roleList",
          component: () => import('@/views/system/RoleList.vue'),
          name: "roleList",
          meta: {
            title: "角色管理",
            icon: "DocumentChecked",
            roles: ["sys:role"],
            requiresAuth: true  //// 需要登录认证
          },
        },
      ],
    },
    {
      path: "/communityManage",
      component: Layout,
      name: "communityManage",
      meta: {
        title: "社区管理",
        icon: "Setting",
        roles: ["sys:communityManage"],
        requiresAuth: true  //// 需要登录认证
      },
      children: [
        {
          path: "/board",
          component: () => import("@/views/communityManage/Board.vue"),
          name: "board",
          meta: {
            title: "版区管理",
            icon: "UserFilled",
            roles: ["sys:board"],
            requiresAuth: true  //// 需要登录认证
          },
        },
        {
          path: "/topic",
          component: () => import("@/views/communityManage/Topic.vue"),
          name: "topicList",
          meta: {
            title: "话题管理",
            icon: "Wallet",
            roles: ["sys:topicList"],
            requiresAuth: true  //// 需要登录认证
          },
        },
      ],
    },
    {
      path: "/post",
      component: Layout,
      name: "post",
      meta: {
        title: "帖子管理",
        icon: "Setting",
        roles: ["sys:post"],
        requiresAuth: true  //// 需要登录认证
      },
      children: [
        {
          path: "/postReview",
          component: () => import("@/views/post/PostReview.vue"),
          name: "postReview",
          meta: {
            title: "帖子管理",
            icon: "Wallet",
            roles: ["sys:post:review"],
            requiresAuth: true  //// 需要登录认证
          },
        },
        {
          path: "/postList",
          component: () => import("@/views/post/PostList.vue"),
          name: "postList",
          meta: {
            title: "帖子管理",
            icon: "Wallet",
            roles: ["sys:postList"],
            requiresAuth: true  //// 需要登录认证
          },
        },
      ],
    },
    {
      path: "/banner",
      component: Layout,
      name: "banner",
      meta: {
        title: "广告管理",
        icon: "Setting",
        roles: ["sys:banner"],
        requiresAuth: true  //// 需要登录认证
      },
      children: [
        {
          path: "/bannerList",
          component: () => import("@/views/banner/BannerList.vue"),
          name: "bannerList",
          meta: {
            title: "广告列表",
            icon: "Postcard",
            roles: ["sys:bannerList"],
            requiresAuth: true  //// 需要登录认证
          },
        },
      ],
    },
    {
      path: "/report",
      component: Layout,
      name: "report",
      meta: {
        title: "投诉管理",
        icon: "Setting",
        roles: ["sys:report"],
        requiresAuth: true  //// 需要登录认证
      },
      children: [
        {
          path: "/reportList",
          component: () => import("@/views/report/ReportList.vue"),
          name: "reportList",
          meta: {
            title: "举报列表",
            icon: "Postcard",
            roles: ["sys:reportList"],
            requiresAuth: true  //// 需要登录认证
          },
        },
      ],
    },
    {
      path: "/test",
      component: Layout,
      name: "test",
      meta: {
        title: "实验室",
        icon: "Setting",
        roles: ["sys:report"],
        requiresAuth: true  //// 需要登录认证
      },
      children: [
        {
          path: "/t1",
          component: () => import('@/views/test/t1.vue'),
          name: "t1",
          meta: {
            title: "上传测试",
            icon: "Postcard",
            roles: ["sys:reportList"],
            requiresAuth: true  //// 需要登录认证
          },
        },
        {
          path: "/t2",
          component: () => import('@/views/test/t2.vue'),
          name: "t2",
          meta: {
            title: "t2",
            icon: "Postcard",
            roles: ["sys:reportList"],
            requiresAuth: true  //// 需要登录认证
          },
        },
      ],
    },
    {
      path: '/login',
      name: "login",
      component: () => import('@/views/login/Login.vue'),
      meta: { guestOnly: true } // 仅允许未登录用户访问
    }
  ],
})



// 全局前置守卫
import { userStore } from '@/stores/user'
router.beforeEach(async (to, from, next) => {
  const userInfo = userStore()
  // 1. 检查是否需要登录权限
  if (to.meta.requiresAuth) {
    // 2. 验证用户登录状态
    const isAuthenticated = await userInfo.checkAuth()
    if (!isAuthenticated) {
      // 3. 未登录时跳转登录页，携带原路径
      return next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    }
  }

  // 4. 已登录时禁止访问登录/注册页 ？
  // if (to.meta.guestOnly) {
  //   const isAuth = await userInfo.checkAuth()
  //   if (isAuth) {
  //     return next({ path: from.fullPath || '/' })
  //   }
  // }
  next()
})




export default router
