import { createRouter, createWebHistory } from 'vue-router'
import Layout from "@/layout/Index.vue"
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path:'/',
      redirect:'/dashboard' //test
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
          },
        },
        {
          path: "/post",
          component: () => import("@/views/communityManage/PostList.vue"),
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
      component: Layout,
      name: "comment",
      meta: {
        title: "评论管理",
        icon: "Setting",
        roles: ["sys:comment"],
      },
      children: [
        {
          path: "/commentList",
          component: () => import("@/views/comment/CommentList.vue"),
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
      component: Layout,
      name: "banner",
      meta: {
        title: "广告管理",
        icon: "Setting",
        roles: ["sys:banner"],
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
      },
      children: [
        {
          path: "/reportList",
          component: () => import("@/views/report/ReportList.vue"),
          name: "reportList",
          meta: {
            title: "广告列表",
            icon: "Postcard",
            roles: ["sys:reportList"],
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
      },
      children: [
          {
              path: "/t1",
              component: ()=>import('@/views/test/t1.vue'),
              name: "t1",
              meta: {
                  title: "上传测试",
                  icon: "Postcard",
                  roles: ["sys:reportList"],
              },
          },
          {
            path: "/t2",
            component: ()=>import('@/views/test/t2.vue'),
            name: "t2",
            meta: {
                title: "t2",
                icon: "Postcard",
                roles: ["sys:reportList"],
            },
        },
      ],
  }
  ],
})

export default router
