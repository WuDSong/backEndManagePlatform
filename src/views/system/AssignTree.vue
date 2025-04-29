<template>
    <SysDialog :title="dialog.title" :dialogVisible="dialog.visible" :width="dialog.width" @onClose="onClose"
        @onConfirm="commit">
        <template #content>
            <el-form ref="addFormRef" :inline="true" label-position="right" label-width="auto"
                style="padding: 10px 20px;">
                <el-form-item prop="roleName" label="角色名:">
                    <el-text v-if="role != null">{{ role.roleName }}</el-text>
                </el-form-item>
                <el-form-item prop="roleKey" label="角色标识符:">
                    <el-text v-if="role != null">{{ role.roleKey }}</el-text>
                </el-form-item>
                <el-row><el-divider /></el-row>

                <el-form-item prop="roleKey" label="分配的菜单">
                    <!-- check-strictly:任何节点都可以单独选择 check-on-click-node:点击node进行选择 默认值是 false 
                     render-after-expand是否在第一次展开某个树节点后才渲染其子节点-->
                    <el-tree-select v-model="assignTreeData.checkedList" :data="assignTreeData.dataList"
                        :render-after-expand="false" show-checkbox :check-strictly="false" :props="treeSelectProps"
                        style="width: 240px" multiple :check-on-click-node="true" node-key="mid" />
                </el-form-item>
            </el-form>
        </template>
    </SysDialog>
</template>

<script setup lang="ts">
import useDialog from '@/hooks/useDialog';
import { useLoading } from '@/hooks/useLoading'
import SysDialog from '@/components/SysDialog.vue';
import type { Role } from '@/api/role/RoleModel';
import { nextTick, reactive, ref } from 'vue';
import { userStore } from '@/stores/user';
import { getRoleAssignMenuTree } from '@/api/menu';
import { ElMessage } from 'element-plus';
import { assignRoleMenu } from '@/api/role';
let currentUser = userStore()

let role = ref<Role>() //当前弹窗编辑的角色
// 树形选择器的值
let assignTreeData = reactive({
    dataList: [],
    checkedList: [],
    defaultCheckedList: []
})

let treeSelectProps = {
    label: 'menuName',
    value: 'mid'
}

// 使用 useDialog 控制弹窗状态
const { dialog, onShow, onClose, onConfirm } = useDialog();

const initAssign = async () => {
    let res = await getRoleAssignMenuTree({
        userId: currentUser.userId,
        userRid: currentUser.rid,
        rid: role.value?.rid!
    })
    if (res && res.code == 200) {
        console.log(res);
        assignTreeData.dataList = res.data.currentUserMenuTree
        assignTreeData.checkedList = res.data.checkList
        assignTreeData.defaultCheckedList = res.data.checkList
        if (assignTreeData.checkedList.length > 0) {

        }
    }
}

// 暴露给父组件的方法：显示弹窗
const showDialog = async (row: Role) => {
    console.log("调用AssignTree,查找角色:" + row.roleName);
    console.log(row);
    if (row == null || row.rid == null) {
        ElMessage.error("分配菜单参数有误")
        return
    }
    // 数据重置
    role.value = row
    assignTreeData.checkedList = []
    assignTreeData.dataList = []
    assignTreeData.defaultCheckedList = []
    dialog.title = "分配菜单";
    await initAssign()
    onShow()
};

defineExpose({ showDialog })
const emit = defineEmits(['refresh']);

// 提交
const { startLoading, stopLoading } = useLoading({
  target: '.sys-dialog' // 限制遮罩范围
})
const loading =ref(false)
const commit = async () => {
    // 一、对数据处理同告知方法（插入、删除。。。）
    // 1.如果数据不发生变化可以不做请求。 比如assignTreeData.checkedList 由1，2，3 变成 3，2，1

    // 2.如果数据增加应该发送增加的部分。 比如assignTreeData.checkedList 由1，2，3 变成 3，2，1，4 ，那么直接发4 后端在分配的菜单表
    // 进行对应插入语句就行

    // 3.删除的话同上，只发送少的部分：删除的话应该使用的是软删除还是直接删除，我想这个应该不是经常改动角色所拥有的菜单吧。
    // 如果用软删除然后又要插入相同的字段，感觉也挺浪费

    // 二、直接不对数据处理，传后端，后端将当前角色所有菜单全部删除后重新插入

    // 采取全量更新方法吧
    if (loading.value) return;
    const isSame =
        assignTreeData.checkedList.length === assignTreeData.defaultCheckedList.length &&
        new Set(assignTreeData.checkedList).size === new Set([...assignTreeData.defaultCheckedList, ...assignTreeData.checkedList]).size;
    if (isSame) {
        ElMessage.warning("菜单分配未发生变化");
        return;
    }
    startLoading()
    let params = {
        rid: role.value?.rid!,
        menuIds: assignTreeData.checkedList // 全量菜单ID数组
    }
    try {
        let res=await assignRoleMenu(params)
        if(res&&res.code==200){
            ElMessage.success("分配成功")
            onClose()
        }else ElMessage.error("分配失败，"+res.msg)
    } finally {
        loading.value = false;
        stopLoading()
    }
}
</script>