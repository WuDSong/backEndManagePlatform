<template>
    <el-container style="height: 100%;" ref="box">
        <el-main style="overflow: hidden;">
            <el-form :inline="true" size="default">
                <el-form-item>
                    <el-input v-model="search" placeholder="请输入..." :prefix-icon="Search">
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
                <el-table-column prop="rid" label="ID" width="70" align="center" sortable></el-table-column>
                <el-table-column prop="roleName" label="角色" align="center" show-overflow-tooltip></el-table-column>
                <el-table-column prop="roleKey" label="roleKey" align="center"></el-table-column>
                <el-table-column prop="description" label="描述" min-width="100" show-overflow-tooltip></el-table-column>
                <el-table-column prop="createTime" label="创建时间" width="170" align="center"></el-table-column>
                <el-table-column prop="userCount" label="用户数" width="90" align="center"></el-table-column>
                <el-table-column label="操作" align="center" width="320">
                    <template #default="scope">
                        <el-button type="primary" icon="Edit" size="default" @click="editBtn(scope.row)"
                            :disabled="(scope.row.rid == 1 && scope.row.roleKey == 'SUPER_ADMIN') || (scope.row.rid == 2 && scope.row.roleKey == 'COMMON_ADMIN')">编辑</el-button>
                        <el-button type="success" icon="Edit" size="default" @click="assignBtn(scope.row)"
                            :disabled="(scope.row.rid == 1 && scope.row.roleKey == 'SUPER_ADMIN') || (scope.row.rid == 2 && scope.row.roleKey == 'COMMON_ADMIN')">分配菜单</el-button>
                        <el-button type="danger" icon="Delete" size="default" :disabled="scope.row.userCount > 0||(scope.row.rid == 1 && scope.row.roleKey == 'SUPER_ADMIN') || (scope.row.rid == 2 && scope.row.roleKey == 'COMMON_ADMIN')"
                            @click="deleteBtn(scope.row.rid)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <br>
        </el-main>
    </el-container>
    <!-- 添加，修改 -->
    <SysDialog :title="dialog.title" :dialogVisible="dialog.visible" @onClose="onClose" @onConfirm="commit"
        :width="dialog.width">
        <template #content>
            <!-- <div>{{role}}</div> -->
            <el-form :model="role" ref="addFormRef" :rules="rules" :inline="true" label-position="right"
                label-width="auto" style="padding: 10px 20px;">
                <el-form-item prop="roleName" label="角色名">
                    <el-input v-model="role.roleName" placeholder="角色名"></el-input>
                </el-form-item>
                <el-form-item prop="roleKey" label="角色标识符">
                    <el-input v-model="role.roleKey" placeholder="Key"></el-input>
                </el-form-item>
                <el-form-item prop="description" label="描述" show-overflow-tooltip>
                    <el-input v-model="role.description" type="textarea" :rows="4" placeholder="描述一下吧喵q(≧▽≦q)~"
                        style="width:300px;"></el-input>
                </el-form-item>
            </el-form>
        </template>
    </SysDialog>
    <AssignTree ref="assignTree"></AssignTree>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import SysDialog from '@/components/SysDialog.vue';
import useDialog from '@/hooks/useDialog';
import AssignTree from './AssignTree.vue';
import { descriptionItemProps, ElMessage, ElMessageBox, ElNotification, type FormInstance, type UploadUserFile } from 'element-plus';
import { nextTick } from 'vue';
import { Calendar, Search } from '@element-plus/icons-vue'
import { addRoleApi, delRoleApi, getRoleListApi, updateRoleApi } from '@/api/role';
import type { Role } from '@/api/role/RoleModel';
import { OBJAssignExisting } from '@/utils/ObjectCopy';
const { dialog, onClose, onConfirm, onShow } = useDialog()//初始弹窗
//搜索参数同时也是页面参数
const search = ref('')
let tableList = ref<Role[]>([])//表格数据
let getRoleList = async () => {
    let res = await getRoleListApi(search.value)
    if (res && res.code == 200) {
        tableList.value = res.data
    }
}
//搜索相关
let searchBtn = () => { getRoleList() }
let resetBtn = () => {
    search.value = ""
    getRoleList()
}
// 弹窗相关--------------------------------------------------------------
// 修改对象
let role = ref({//数据:此处不可以指定类型? 
    rid: '',
    roleName: '',
    roleKey: '',
    description: ''
})

let mode = ref(0) //0 时新建模式，1 时是修改编辑模式
// 表单ref属性
const addFormRef = ref<FormInstance>()
// 点击新建，显示弹窗
let addBtn = () => {
    mode.value = 0
    dialog.visible = true
    addFormRef.value?.resetFields()//清空表单
}

let editBtn = async (row: Role) => {
    mode.value = 1
    dialog.title = '修改角色信息'
    dialog.visible = true
    nextTick(() => {
        // Object.assign(role.value, row)
        OBJAssignExisting(role.value, row)
    })
    addFormRef.value?.resetFields()//清空表单
}
// 点击提交
let commit = async () => {
    // 表单验证
    addFormRef.value?.validate(async (valid) => {
        if (valid) { //验证通过
            // console.log(addModel);
            let res = null
            if (mode.value == 0) {
                role.value.rid = ''
                res = await addRoleApi(role.value);
            } else {
                res = await updateRoleApi(role.value)
            }
            if (res && res.code == 200) {
                //信息提示
                ElMessage.success(res.msg)
                getRoleList()
                //关闭弹框
                dialog.visible = false;
            }
        } else {
            ElMessage.error("验证未通过！重新填写信息！！！")
        }
    });


}


let deleteBtn = (id: string) => {
    ElMessageBox.confirm('确定删除该版区吗?', '系统提示',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }).then(async () => {
            let res = await delRoleApi(id)
            if (res.code == 200) {
                ElMessage.success(res.msg)
                getRoleList()
            }
        }).catch(() => {
            ElMessage.info("删除已取消！")
        })
}
// 分配菜单-------
const assignTree = ref() //获取实例
// 修改分配菜单按钮的点击事件
const assignBtn = (row: Role) => {
    assignTree.value.showDialog(row) // 调用子组件的显示方法
};

let box = ref(null)//用来挂载元素
let tableHeight = ref(0)
onMounted(() => {
    console.log(window.innerHeight);
    tableHeight.value = window.innerHeight - 60 - 20 * 2 - 20 * 2 - 50
    console.log(tableHeight.value);
    //表格高度 =  窗口高度 - (Layout el-heard) - (Layout el-main的padding) -(el-main的padding) -(搜索表单)
    getRoleList()
})

let rules = {
    roleName: [{ required: true, message: "请输入角色名", trigger: "blur" }, { max: 20, min: 2, message: "角色名长度应为2-20个字符", trigger: "blur" }],
    roleKey: [{ required: true, message: "请输入角色标识符", trigger: "blur" }],
}
</script>
<style scoped>
.test {
    color: #686868;
}
</style>