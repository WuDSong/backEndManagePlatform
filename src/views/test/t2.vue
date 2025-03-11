<template>
    <el-container style="height: 100%;" ref="box">
        <el-main style="overflow: hidden;">
            <el-form :model="searchParam" :inline="true" size="default">
                <el-form-item>
                    <el-input v-model="searchParam.name" placeholder="请输入..." :prefix-icon="Search">
                    </el-input>
                </el-form-item>
                <el-form-item>
                    <el-button icon="Search" @click="searchBtn">搜索</el-button>
                    <el-button icon="Close" type="danger" plain @click="resetBtn">重置</el-button>
                    <el-button type="primary" icon="Plus" @click="addBtn">新增</el-button>
                </el-form-item>
            </el-form>
            <!-- 表格                    边框    是否为斑马纹-->
            <el-table :data="tableList" border stripe :max-height="tableHeight">
                <el-table-column prop="boardId" label="BoardID" width="120" align="center" sortable></el-table-column>
                <el-table-column prop="name" label="版区" align="center"></el-table-column>
                <el-table-column prop="icon" label="图标">
                    <template #default="scope">
                        <div style="color: #686868">{{ scope.row.icon }}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="description" label="描述" min-width="300"></el-table-column>
                <el-table-column prop="sortOrder" label="序号" width="60" align="center"></el-table-column>
                <el-table-column label="操作" align="center" min-width="200">
                    <template #default="scope">
                        <el-button type="primary" icon="Edit" size="default" @click="editBtn(scope.row)">编辑</el-button>
                        <el-button type="danger" icon="Delete" size="default"
                            @click="deleteBtn(scope.row.userid)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <br>
        </el-main>
        <!-- 高度自定义,居中 -->
        <el-footer style="height: auto;display: flex;justify-content: center;">
            <el-pagination layout="total,sizes,prev, pager, next,jumper" :total="searchParam.total" background
                v-model:current-page="searchParam.curPage" v-model:page-size="searchParam.pageSize"
                :default-page-size="searchParam.pageSize" :page-sizes="[3, 5, 7, 10]" @size-change="sizeChange"
                @current-change="curChange" />
        </el-footer>
    </el-container>
    <!-- 添加，修改 -->
    <SysDialog :title="dialog.title" :dialogVisible="dialog.visible" @onClose="onClose" @onConfirm="commit"
        :width="dialog.width">
        <template #content>
            <el-form :model="board" ref="addFormRef" :rules="rules" :inline="true" label-width="80px"
                label-position="right">
                <el-form-item prop="name" label="版区名字">
                    <el-input v-model="board.name"></el-input>
                </el-form-item>
            </el-form>
        </template>
    </SysDialog>
</template>
<script setup lang="ts">
import { type sysUserParam } from '@/api/user/UserModel'
import { ref, onMounted } from 'vue'
import { addSysUserApi, delSysUserApi, getSysUserListApi, updateSysUserApi } from '@/api/user';
import type { SySUser } from '@/api/user/UserModel';

import SysDialog from '@/components/SysDialog.vue';
import useDialog from '@/hooks/useDialog';
import { ElMessage, ElMessageBox, ElNotification, type FormInstance } from 'element-plus';

import { nextTick } from 'vue';
import { Calendar, Search } from '@element-plus/icons-vue'

import { getBoardListApi } from "@/api/board/index"
import { type Board, type BoardParam } from "@/api/board/BoardModel"

const { dialog, onClose, onConfirm, onShow } = useDialog()//初始弹窗
//搜索参数同时也是页面参数
const searchParam = ref<BoardParam>({
    name: "",
    pageSize: 7,
    curPage: 1,
    total: 10
})
let tableList = ref([])//表格数据
let getBoardList = async () => {
    let res = await getBoardListApi(searchParam.value)
    if (res && res.code == 200) {
        tableList.value = res.data.records
        searchParam.value.total = res.data.total;
    }
}
//搜索相关
let searchBtn = () => { getBoardList() }
let resetBtn = () => {
    searchParam.value.name = ""
    getBoardList()
}
//页面变动相关
let curChange = () => {
    console.log("当前页面：" + searchParam.value.curPage);
    getBoardList()
}
let sizeChange = () => {
    console.log("当前页大小：" + searchParam.value.pageSize);
    getBoardList()
}
//修改对象
let board = ref<Board>({//数据
    boardId: '',
    name: '',
    icon: '',
    description: '',
    sortOrder: ''
})

//弹窗相关--------------------------------------------------------
let mode = ref(0) //0 时新建模式，1 时是修改编辑模式

//表单ref属性
const addFormRef = ref<FormInstance>()

//点击新建，显示弹窗
let addBtn = () => {
    mode.value = 0
    dialog.width = 700
    dialog.visible = true
    addFormRef.value?.resetFields()//清空表单
}
//点击编辑
let editBtn = (row: Board) => {
    mode.value = 1
    dialog.width = 700
    dialog.title = '修改版区信息'
    dialog.visible = true
    nextTick(() => {
        Object.assign(board.value, row)
    })
    addFormRef.value?.resetFields()//清空表单
}
//点击提交
let commit = async () => {
    //表单验证
    // addFormRef.value?.validate(async (valid) => {
    //     if (valid) { //验证通过
    //         // console.log(addModel);
    //         let res = null
    //         if (mode.value == 0) {
    //             board.value.userid = ''//uid自动生成，不需要填
    //             res = await addSysUserApi(board.value);
    //         } else {
    //             res = await updateSysUserApi(board.value)
    //         }
    //         if (res && res.code == 200) {
    //             //信息提示
    //             ElMessage.success(res.msg)
    //             getBoardList()
    //             //关闭弹框
    //             dialog.visible = false;
    //         }
    //     } else {
    //         ElMessage.error("验证未通过！重新填写信息！！！")
    //     }
    // });
}


let deleteBtn = (id: string) => {
    // ElMessageBox.confirm('确定删除该用户数据吗?', '系统提示',
    //     {
    //         confirmButtonText: '确定',
    //         cancelButtonText: '取消',
    //         type: 'warning',
    //     }).then(async () => {
    //         let res = await delSysUserApi(userid)
    //         if (res.code == 200) {
    //             ElMessage.success(res.msg)
    //             getBoardList()
    //         }
    //     }).catch(() => {
    //         ElMessage.info("删除已取消！")
    //     })
}
let box = ref(null)//用来挂载元素
let tableHeight = ref(0)
onMounted(() => {
    console.log(window.innerHeight);
    tableHeight.value = window.innerHeight - 60 - 20 * 2 - 32 - 20 * 2 - 50
    console.log(tableHeight.value);
    //表格高度 =  窗口高度 - (Layout el-heard) - (Layout el-main的padding) - (el-footer) -(el-main的padding) -(搜索表单)
    getBoardList()
})


let rules = {
    // 用户名验证规则
    username: [
        { required: true, message: '用户名不能为空', trigger: 'blur' }, // 必填项，失去焦点时触发验证
        { min: 3, max: 10, message: '用户名长度在 3 到 10 个字符之间', trigger: 'blur' } // 长度限制
    ],
    // 密码验证规则
    password: [
        { required: true, message: '密码不能为空', trigger: 'blur' }, // 必填项，失去焦点时触发验证
        { min: 6, max: 16, message: '密码长度在 6 到 16 个字符之间', trigger: 'blur' } // 长度限制
    ],
    // 性别验证规则
    sex: [
        { required: true, message: '请选择性别', trigger: 'change' } // 必填项，选择时触发验证
    ],
    // 电话验证规则
    phone: [
        { required: true, message: '电话不能为空', trigger: 'blur' }, // 必填项，失去焦点时触发验证
        { pattern: /^1[3456789]\d{9}$/, message: '请输入有效的手机号码', trigger: 'blur' } // 正则表达式验证手机号码格式
    ],
    // 邮箱验证规则
    email: [
        { required: true, message: '邮箱不能为空', trigger: 'blur' }, // 必填项，失去焦点时触发验证
        { type: 'email', message: '请输入有效的邮箱地址', trigger: 'blur' } // 使用 Element UI 内置的邮箱格式验证
    ],
    // 状态验证规则
    // status: [
    //     { required: true, message: '请选择状态', trigger: 'change' } // 必填项，选择时触发验证
    // ],
    // 角色验证规则
    rid: [
        { required: true, message: '请选择角色', trigger: 'change' } // 必填项，选择时触发验证
    ]
}
</script>
<style scoped>
.test {
    color: #686868;
}
</style>
