<template>
    <el-container style="height: 100%;" ref="box">
        <el-main style="overflow: hidden;">
            <el-form :inline="true" size="default">
                <el-form-item>
                    <el-button type="primary" icon="Plus" @click="addBtn">新增</el-button>
                    <!-- <el-button icon="FullScreen" @click="changeExpand">新增</el-button> -->
                </el-form-item>
            </el-form>
            <!-- 表格                    边框    是否为斑马纹   最大高度          默认展开所有行     row-key行数据的 Key，用来优化 Table 的渲染；-->
            <el-table :data="tableList" border stripe :max-height="tableHeight" :default-expand-all="expand" row-key="mid">
                <el-table-column prop="mid" label="MID" width="80" align="center" sortable></el-table-column>
                <el-table-column prop="menuName" label="菜单" align="center"></el-table-column>
                <el-table-column prop="icon" label="图标" width="60" align="center">
                    <template #default="scope">
                        <el-icon>
                            <component v-if="scope.row.icon" :is="scope.row.icon"></component>
                        </el-icon>
                    </template>
                </el-table-column>
                <el-table-column prop="menuType" label="菜单类型" align="center" width="90">
                    <template #default="scope">
                        <el-tag v-if="scope.row.menuType == '1'" type="success" size="default">菜单</el-tag>
                        <el-tag v-if="scope.row.menuType == '2'" type="danger" size="default">按钮</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="parentId" label="上级菜单序号" width="110"></el-table-column>
                <el-table-column prop="path" label="路由" show-overflow-tooltip></el-table-column>
                <el-table-column prop="perms" label="权限字段" show-overflow-tooltip></el-table-column>
                <el-table-column prop="sort" label="序号" width="60" align="center"></el-table-column>

                <el-table-column label="操作" align="center" min-width="200">
                    <template #default="scope">
                        <el-button type="primary" icon="Edit" size="default" @click="editBtn(scope.row)">编辑</el-button>
                        <el-button type="danger" icon="Delete" size="default"
                            :disabled="scope.row.children && scope.row.children.length > 0"
                            @click="deleteBtn(scope.row.mid)">删除</el-button>
                        <el-button v-if="scope.row.visible" type="info" size="default" @click="changeVisible(scope.row)"
                            :disabled="scope.row.menuType != '1'">隐藏</el-button>
                        <el-button v-else type="info" size="default" @click="changeVisible(scope.row)"
                            :disabled="scope.row.menuType != '1'">显示</el-button>

                    </template>
                </el-table-column>
            </el-table>
        </el-main>
    </el-container>
    <!-- 添加，修改 -->
    <SysDialog :title="'新增(所有项必填)'" :dialogVisible="dialog.visible" @onClose="onClose" @onConfirm="commit"
        :width="dialog.width">
        <template #content>
            <!-- {{ sysMenu }} -->
            <el-form :model="sysMenu" ref="addFormRef" :rules="rules" :inline="false" size="default"
            label-position="right" label-width="auto" >
                <el-row>
                    <el-col :span="11" :offset="0">
                        <el-form-item label="菜单类型" prop="menuType">
                            <el-radio-group v-model="sysMenu.menuType">
                                <el-radio :value="1">菜单</el-radio>
                                <el-radio :value="2">按钮</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" :offset="1" v-if="sysMenu.menuType != 2">
                        <el-form-item label="是否为根目录菜单">
                            <el-switch v-model="isRootMenu">
                                <template #active-action>
                                    <span class="custom-active-action">T</span>
                                </template>
                                <template #inactive-action>
                                    <span class="custom-inactive-action">F</span>
                                </template>
                            </el-switch>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="11" :offset="0">
                        <el-form-item :label="sysMenu.menuType == 1 ? '上级菜单' : '所属'" prop="parentId">
                            <!--      options选项的数据源  props配置选项:触发展开方式、数据源等等 filterable使用搜索-->
                            <el-cascader :options="tableList" :props="cascaderProps" clearable
                                :placeholder="isRootMenu ? '根菜单无上级菜单' : '请选择上级菜单'" v-model="sysMenu.parentId"
                                :disabled="isRootMenu" filterable>
                                <template #default="{ node, data }">
                                    <span>{{ data.menuName }}</span>
                                    <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
                                </template>
                            </el-cascader>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" :offset="1">
                        <el-form-item :label="sysMenu.menuType == 1 ? '菜单名称' : '按钮功能(名称)'" prop="menuName">
                            <el-input v-model="sysMenu.menuName"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="11" :offset="0">
                        <el-form-item label="权限字段" prop="perms">
                            <el-input v-model="sysMenu.perms"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" :offset="1" v-if="sysMenu.menuType != 2">
                        <el-form-item label="菜单次序" prop="sort">
                            <el-input-number v-model="sysMenu.sort" :min="1" :max="100" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row v-if="sysMenu.menuType != 2">
                    <el-col :span="11" :offset="0">
                        <el-form-item label="路由" prop="path">
                            <el-input v-model="sysMenu.path"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" :offset="1">
                        <el-form-item label="菜单图标" prop="icon">
                            <el-input v-model="sysMenu.icon"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </template>
    </SysDialog>
</template>
<script setup lang="ts">
import { ref, onMounted, nextTick, computed, watch } from 'vue'
import SysDialog from '@/components/SysDialog.vue';
import useDialog from '@/hooks/useDialog';
import { type CascaderProps, ElMessage, ElMessageBox, ElNotification, type FormInstance, type UploadUserFile } from 'element-plus';
import { type SysMenu } from '@/api/menu/MenuModel';
import UploadSingleImage from '@/components/UploadImage.vue'
import type { uploadImageParameter } from '@/api/img/uploadImageModel';
import { addMenuApi, delMenuApi, getMenuTreeApi, updateMenuApi } from '@/api/menu/index'
import { OBJAssignExisting } from '@/utils/ObjectCopy';
const { dialog, onClose, onConfirm, onShow } = useDialog()//初始弹窗
const expand=ref(false)
const changeExpand=()=>{
    expand.value=!expand.value
}
let tableList = ref([])//表格数据
let getMenuTree = async () => {
    let res = await getMenuTreeApi()
    if (res && res.code == 200) {
        tableList.value = res.data
    }
}

// 修改对象,添加对象
let isRootMenu = ref(false)
let sysMenu = ref<SysMenu>({//数据
    mid:'',
    menuName: '',
    menuType: 1,
    parentId: 0,
    path: '',
    icon: '',
    visible: 1,
    sort: 0,
    perms: ''
})
// 级联选择器选项
let cascaderProps = ref<CascaderProps>({
    value: "mid",
    label: "menuName",
    children: "children",
    checkStrictly: true,  // 允许选择任意一级
    emitPath: false       // 仅返回最后一级的值
})

//弹窗相关--------------------------------------------------------
let mode = ref(0) //0 时新建模式，1 时是修改编辑模式
//表单ref属性
const addFormRef = ref<FormInstance>()
//点击新建，显示弹窗
let addBtn = () => {
    mode.value = 0
    dialog.width = 550
    dialog.visible = true
    addFormRef.value?.resetFields()//清空表单
    isRootMenu.value = false
}

let editBtn = (row: SysMenu) => {
    mode.value = 1
    // console.log('当前行'+row);
    // console.log(row);
    if (row.parentId === 0) { //菜单
        console.log('是顶级菜单');
        isRootMenu.value = true
    } else isRootMenu.value = false;
    dialog.width = 700
    dialog.title = '修改菜单信息'
    dialog.visible = true
    nextTick(() => {
        // Object.assign(sysMenu.value, row)
        OBJAssignExisting(sysMenu.value, row)
    })
    console.log(sysMenu.value);
    addFormRef.value?.resetFields()//清空表单
    console.log(sysMenu.value);
}
//点击提交
let commit = async () => {
    if (isRootMenu.value) { //如果是顶级菜单
        sysMenu.value.parentId = 0
    }
    // 表单验证
    addFormRef.value?.validate(async (valid) => {
        if (valid) { //验证通过
            console.log('验证通过,准备添加菜单');
            let res = null
            if (mode.value == 0) { // 0:add  1:updata
                sysMenu.value.mid=''
                res = await addMenuApi(sysMenu.value)
            } else {
                res = await updateMenuApi(sysMenu.value)
            }
            if (res && res.code == 200) {
                //信息提示
                ElMessage.success(res.msg)
                getMenuTree()
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
            let res = await delMenuApi(id)
            if (res.code == 200) {
                ElMessage.success(res.msg)
                getMenuTree()
            }
        }).catch(() => {
            ElMessage.info("删除已取消！")
        })
}

const changeVisible = async (row: SysMenu) => {
    // 创建新对象避免修改原始行数据
    const updatedMenu = { ...row };
    // 直接切换 visible 值
    updatedMenu.visible = updatedMenu.visible === 1 ? 0 : 1;
    // 调用 API 更新
    const res = await updateMenuApi(updatedMenu);
    if (res?.code === 200) {
        // 更新成功后，直接修改原行数据以触发界面刷新
        row.visible = updatedMenu.visible;
        ElMessage.success(res.msg);
    } else {
        ElMessage.error(res?.msg || '操作失败');
    }
};

let box = ref(null)//用来挂载元素
let tableHeight = ref(0)
onMounted(() => {
    console.log(window.innerHeight);
    tableHeight.value = window.innerHeight - 60 - 20 * 2 - 32 - 20 * 2
    console.log(tableHeight.value);
    //表格高度 =  窗口高度 - (Layout el-heard) - (Layout el-main的padding) - (el-footer) -(el-main的padding)
    getMenuTree()
})

let rules = ref({
    menuType: [
        {
            required: true,
            message: '请选择菜单类型',
            trigger: ['blur', 'change']
        }
    ],
    parentId: [
        {
            validator: (rule: any, value: any, callback: any) => {
                if (!isRootMenu.value && !value) {
                    callback(new Error('请选择上级菜单'));
                } else {
                    callback();
                }
            },
            trigger: ['blur', 'change']
        }
    ],
    menuName: [
        { required: true, message: '菜单名称不能为空', trigger: 'blur' },
        { min: 2, max: 20, message: '名称长度在2到20个字符之间', trigger: 'blur' }
    ],
    perms: [
        {
            required: true, // 按钮类型必填sysMenu.value.menuType === '2'
            message: '权限字段不能为空',
            trigger: 'blur'
        },
        {
            pattern: /^[a-zA-Z0-9:]+$/,
            message: '权限字段只能包含字母、数字和冒号',
            trigger: 'blur'
        }
    ],
    sort: [
        {
            required: sysMenu.value.menuType === 1, // 菜单类型必填
            message: '排序序号不能为空',
            trigger: 'blur'
        }
    ],
    path: [
        {
            required: sysMenu.value.menuType === 1, // 菜单类型必填
            message: '路由路径不能为空',
            trigger: 'blur'
        },
        {
            pattern: /^\/\w+/,
            message: '路由必须以斜杠开头且包含有效字符',
            trigger: 'blur'
        }
    ],
    icon: []
})

</script>
<style scoped>
.test {
    color: #686868;
}
</style>
