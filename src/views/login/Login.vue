<template>
    <div class="login">
        <div style="margin-bottom:50px;font-size: 36px;font-weight: 600;color: white;">ACGN论坛管理后台</div>
        <el-form :inline="false" :model="loginModel" class="loginForm" ref="form" :rules="rules" size="large">
            <el-form-item>
                <div class="loginTile">系统登录</div>
            </el-form-item>
            <el-form-item prop="username">
                <el-input v-model="loginModel.username" placeholder="请输入账户名称" clearable />
            </el-form-item>
            <el-form-item prop="password">
                <el-input v-model="loginModel.password" placeholder="请输入用户密码" clearable />
            </el-form-item>
            <el-form-item prop="code">
                <el-row :gutter="10">
                    <el-col :span="16" :offset="0">
                        <el-input v-model="loginModel.code" placeholder="请输入验证码" />
                    </el-col>
                    <el-col :span="8" :offset="0">
                        <img class="images" :src="imageSrc" @click="getImage" />
                    </el-col>
                </el-row>
            </el-form-item>
            <el-form-item>
                <el-row :gutter="20" class="formBtn">
                    <el-col :span="12" :offset="0">
                        <el-button type="primary" class="myBtn" @click="commit">
                            登 录</el-button>
                    </el-col>
                    <el-col :span="12" :offset="0">
                        <el-button type="danger" class="myBtn" @click="resetBtn">重 置</el-button>
                    </el-col>
                </el-row>
            </el-form-item>
        </el-form>
    </div>
</template>
<script setup lang="ts">
import { getImageApi, loginApi } from '@/api/user';
import { nextTick, onMounted, reactive, ref } from 'vue';
import type { FormInstance } from 'element-plus';
import { useRouter } from 'vue-router';
import { userStore } from '@/stores/user';
//路由对象
const router = useRouter()
//解引用方式
const store = userStore()
//表单对象
const form = ref<FormInstance>()
//表单绑定的对象
const loginModel = reactive({
    username: '',
    password: '',
    code: ''
})
const imageSrc = ref('')
//获取验证码
const getImage = async () => {
    let res = await getImageApi()
    if (res.code == 200) {
        imageSrc.value = res.data
        console.log(imageSrc.value)
    }
}
//重置
const resetBtn = () => {
    form.value?.resetFields()
}
//登录
const commit = () => {
    form.value?.validate(async (valid) => {
        if (valid) {
            console.log("验证通过")
            let res = await loginApi(loginModel)
            if (res.code == 200) {
                console.log(res)
                store.userId = res.data.userid
                store.username = res.data.username
                store.menuRouterTree = res.data.menuRouterTree
                store.codeList = res.data.codeList
                store.rid = res.data.rid
                //跳转首页
                router.replace({ path: '/' })
            }
        } else {
            console.log("不通过")
        }
    })
}
//表单验证
const rules = reactive({
    username: [
        { required: true, message: '请输入用户名称', trigger: ['blur', 'change'] }
    ],
    password: [
        { required: true, message: '请输入用户密码', trigger: ['blur', 'change'] },
        { min: 6, max: 30, message: '密码是6-30位', trigger: ['blur', 'change'] }
    ],
    code: [
        {
            required: true, message: '请输入用户验证码', trigger: ['blur', 'change']
        }
    ]
})
onMounted(() => {
    nextTick(() => {
        store.resetStore()
        sessionStorage.clear();
    })
    getImage()
})
</script>
<style lang="scss" scoped>
.login {
    height: 100%;
    // background-color: #fff;
    // background-image: url("../../assets/胡桃.jpg");
    background-image: url("@/assets/胡桃.jpg");
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .loginForm {
        height: 320px;
        width: 450px;
        background-color: rgb(83 34 44 / 17%);
        border-radius: 10px;
        box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.4);
        padding: 20px 35px;

        .loginTile {
            display: flex;
            justify-content: center;
            align-items: center;
            color: #ffffff;
            width: 100%;
            font-size: 32px;
            font-weight: 600;
            letter-spacing: 6px;
        }

        .images {
            height: 41px;
            width: 100%;
            cursor: pointer;
        }

        .formBtn {
            width: 100%;

            .myBtn {
                width: 222px;
            }
        }
    }
}
</style>