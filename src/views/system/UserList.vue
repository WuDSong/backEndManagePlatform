<template>
    <el-container style="height: 100%;" ref="box">
        <el-main style="overflow: hidden;">
            <el-form :model="searchParam" :inline="true" size="default">
                <el-form-item>
                    <el-input v-model="searchParam.username" placeholder="请输入..." :prefix-icon="Search">
                    </el-input>
                </el-form-item>
                <el-form-item>
                    <el-button icon="Search" @click="searchBtn">搜索</el-button>
                    <el-button icon="Close" type="danger" plain @click="resetBtn">重置</el-button>
                    <el-button type="primary" icon="Plus" @click="addBtn" disabled>新增</el-button>
                </el-form-item>
            </el-form>
            <!-- 表格                    边框    是否为斑马纹-->
            <el-table :data="tableList" border stripe :max-height="tableHeight">
                <el-table-column prop="userId" label="UID" width="80" align="center" sortable></el-table-column>
                <el-table-column prop="username" label="用户名" align="center"></el-table-column>
                <el-table-column prop="avatarUrl" label="头像">
                    <template #default="scope">
                        <div style="color: #686868">{{ scope.row.avatarUrl }}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="email" label="邮箱" min-width="150"></el-table-column>

                <el-table-column prop="status" label="状态" width="70" align="center">
                    <template #default="scope">
                        <!-- <el-tag v-if="scope.row.status == 'active'" type="success" effect="plain">启用中</el-tag>
                        <el-tag v-if="scope.row.status == 'banned'" type="danger" effect="plain">禁用中</el-tag> -->
                        <el-tooltip :content="'userStatus: ' + scope.row.status" placement="top" loading>
                            <el-switch class="mt-2"
                                style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
                                :inactive-icon="Close" inline-prompt :active-icon="Check" v-model="scope.row.status"
                                active-value="active" inactive-value="banned" @change="changeUserStatus(scope.row)" />
                        </el-tooltip>
                    </template>
                </el-table-column>
                <el-table-column prop="createdAt" label="创建时间" width="170" align="center"></el-table-column>
                <el-table-column prop="lastLogin" label="最后登录" width="170" align="center">
                    <template #default="scope">
                        <div v-if="scope.row.lastLogin == null" type="success" effect="plain" style="padding: 0 10px;">
                            <el-divider />
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center" min-width="200">
                    <template #default="scope">
                        <!-- <el-button type="primary" size="default" @click="editBtn(scope.row)">修改用户信息</el-button> -->
                        <el-button type="primary" icon="Refresh" size="default"
                            @click="refreshPassword(scope.row)">重置密码</el-button>
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
</template>
<script setup lang="ts">
import { type sysUserParam } from '@/api/user/UserModel'
import { ref, onMounted } from 'vue'
import type { SySUser } from '@/api/user/UserModel';

import SysDialog from '@/components/SysDialog.vue';
import useDialog from '@/hooks/useDialog';
import { ElMessage, ElMessageBox, ElNotification, type FormInstance } from 'element-plus';

import { nextTick } from 'vue';
import { Calendar, Search, Check, Close } from '@element-plus/icons-vue'
import { delWxUserApi, getWxUserListApi, updatePasswordApi, updateWxUserApi } from '@/api/wxUser';
import type { WxUser, WxUserParam } from '@/api/wxUser/wxUserModel';

const { dialog, onClose, onConfirm, onShow } = useDialog()//初始弹窗
//搜索参数同时也是页面参数
const searchParam = ref<WxUserParam>({
    username: "",
    pageSize: 5,
    curPage: 1,
    total: 10
})
let tableList = ref([])//表格数据
let getWxUserList = async () => {
    let res = await getWxUserListApi(searchParam.value)
    if (res && res.code == 200) {
        console.log(res)
        tableList.value = res.data.records
        searchParam.value.total = res.data.total;
    }
}
//搜索相关
let searchBtn = () => { getWxUserList() }
let resetBtn = () => {
    searchParam.value.username = ""
    getWxUserList()
}
//页面变动相关
let curChange = () => {
    console.log("当前页面：" + searchParam.value.curPage);
    getWxUserList()
}
let sizeChange = () => {
    console.log("当前页大小：" + searchParam.value.pageSize);
    getWxUserList()
}
//修改对象
let wxUser = ref<WxUser>({
    username: '',
    passwordHash: '',
    email: '',
    //可选
    userId: '',
    avatarUrl: '',
    status: ''
})

//弹窗相关--------------------------------------------------------
//表单ref属性
const addFormRef = ref<FormInstance>()
//点击新建，显示弹窗
let addBtn = () => {
}
//重置密码
const refreshPassword = async (row: WxUser) => {
    ElMessageBox.confirm('确定重置密码吗?重置后密码为【112233】', '系统提示',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }).then(async () => {
            let res = await updatePasswordApi(row)
            if (res && res.code == 200) {
                ElMessage.success(res.msg)
                getWxUserList()
            }
        }).catch(() => {
            ElMessage.info("取消重置操作！！！")
        })
}

//点击删除
let deleteBtn = (uid: string) => {
    ElMessageBox.confirm('确定删除该数据吗?\n这会同时删除该用户的相关数据,比如发布的文章,不可恢复！！！', '系统提示',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }).then(async () => {
            let res = await delWxUserApi(uid)
            if (res && res.code == 200) {
                ElMessage.success(res.msg)
                getWxUserList()
            }
        }).catch(() => {
            ElMessage.info("取消删除操作！！！")
        })
}
//修改状态
const changeUserStatus = async (user: WxUser) => {
    let res = await updateWxUserApi(user)
    if (res && res.code == 200) {
        ElMessage.success("用户状态修改成功")
        getWxUserList()
    } else ElMessage.error("用户状态修改失败")

}

let box = ref(null)//用来挂载元素
let tableHeight = ref(0)
onMounted(() => {
    console.log(window.innerHeight);
    tableHeight.value = window.innerHeight - 60 - 20 * 2 - 32 - 20 * 2 - 50
    console.log(tableHeight.value);
    //表格高度 =  窗口高度 - (Layout el-heard) - (Layout el-main的padding) - (el-footer) -(el-main的padding) -(搜索表单)
    getWxUserList()
})

</script>
<style scoped>
.test {
    color: #686868;
}
</style>
