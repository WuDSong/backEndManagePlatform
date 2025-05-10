<template>
    <div class="content">
        <span class="title">欢迎：{{ userName }}</span>
        <el-dropdown>
            <span class="el-dropdown-link">
                <img class="userimg" src="@/assets/Rem.png" />
            </span>
            <template #dropdown>
                <el-dropdown-menu>
                    <el-dropdown-item @click="upBtn">修改密码</el-dropdown-item>
                    <el-dropdown-item @click="loginBtn">退出登录</el-dropdown-item>
                </el-dropdown-menu>
            </template>
        </el-dropdown>
    </div>
    <!-- 修改密码弹框 -->
    <SysDialog :title="dialog.title" :dialogVisible="dialog.visible" :width="dialog.width" :height="dialog.height"
        @onClose="onClose" @onConfirm="commit">
        <template v-slot:content>
            <el-form :model="addModel" ref="form" :rules="rules" label-width="80px" :inline="false" size="default">
                <el-form-item prop="oldPassword" label="原密码">
                    <el-input v-model="addModel.oldPassword"></el-input>
                </el-form-item>
                <el-form-item prop="password" label="新密码">
                    <el-input v-model="addModel.password"></el-input>
                </el-form-item>
                <el-form-item prop="newPassword" label="确定密码">
                    <el-input v-model="addModel.newPassword"></el-input>
                </el-form-item>
            </el-form>
        </template>
    </SysDialog>
</template>
<script setup lang="ts">
import { useRouter } from 'vue-router';
import { ElMessageBox, ElMessage, type FormInstance } from 'element-plus';
import { userStore } from '@/stores/user'
import { updatePasswordApi } from '@/api/user/index';
import SysDialog from '@/components/SysDialog.vue';
import useDialog from '@/hooks/useDialog';
import { ref, reactive } from 'vue';
const { dialog, onClose, onConfirm, onShow } = useDialog()
//路由
const router = useRouter()

const form = ref<FormInstance>();
const store = userStore()
const userName = store.username

//退出登录按钮
const loginBtn = () => {
    ElMessageBox.confirm('确定退出系统吗?', '系统提示',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }).then(() => {
            //清空缓存
            sessionStorage.clear()
            //跳转登录
            router.push({ name: 'login' })
        }).catch(() => {
            ElMessage.info("取消退出登录！！！")
        })
}
//表单绑定的对象
const addModel = reactive({
    userId: '',
    password: '',
    oldPassword: '',
    newPassword: ''
})

//修改密码
const upBtn = () => {
    addModel.userId = store.userId;//获取用户id
    dialog.title = "修改密码";
    dialog.height = 260;
    dialog.width = 350
    onShow();//显示弹框
};

//提交表单
const commit = () => {
    //新密码和确定密码判断
    if (addModel.newPassword != addModel.password) {
        ElMessage.warning("新密码和确定密码不一致!");
        return;
    }
    form.value?.validate(async (valid) => {
        if (valid) {
            let res = await updatePasswordApi(addModel);
            if (res && res.code == 200) {
                ElMessage.success(res.msg);
                //清空缓存，重新登录
                await store.resetStore()
                await sessionStorage.clear();
                //跳转登录
                router.replace({ name: "login" });
            }
        }
    });
}

//表单验证规则
const rules = reactive({
    oldPassword: [
        {
            required: "true",
            trigger: "change",
            message: "请输入原密码",
        },
    ],
    password: [
        {
            required: "true",
            trigger: "change",
            message: "请输入新密码",
        },
    ],
    newPassword: [
        {
            required: "true",
            trigger: "change",
            message: "请输入确定密码",
        },
    ],
});
</script>
<style scoped lang="scss">
.content {
    display: flex;
    justify-content: center;
    align-items: center;

    .title {
        color: white;
        margin-right: 18px;
    }

    .el-dropdown-link {
        .userimg {
            height: 40px;
            width: 40px;
            border-radius: 50%;
        }
    }
}
</style>