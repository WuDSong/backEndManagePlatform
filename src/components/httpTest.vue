<script setup lang="ts">
import { ref } from 'vue';
import axios from 'axios';
import http from "@/utils/http";
import { getSysUserListApi } from '@/api/user';
import type { sysUserParam } from '@/api/user/UserModel';

let res1=ref()
let res2=ref()
let res3=ref()
let testAxios = async () => {
    res1.value = await axios({
        url: "http://localhost:12345/api/post/allList",
    })
}

let testAxiosGet = async () => {
    res2.value = await axios.get("http://localhost:12345/api/post/allList")
}

let testMyAxios = async () => {
    res3.value = await http.get('/api/sysUser/getAllList')
    console.log(res3.value);
}

let testMyApi=async()=>{
    let res=await getSysUserListApi({
        username:'',
        pageSize:5,
        curPage:1
    })
    console.log(res);
}

const testApi = (param: sysUserParam) => {
    http.get('/api/sysUser/getList', param)
}
let testMyApi1=async()=>{
    let res=await testApi({
        username:'',
        pageSize:5,
        curPage:1
    })
    console.log(res);
}
</script>

<template>
    <h1>Http Test</h1>
    <el-icon color="red">
        <Edit />
    </el-icon>
    <div class="main">
        <el-button type="primary" size="default" @click="testAxios">测试axios</el-button>
        <el-button type="success" size="default" @click="testAxiosGet">测试axios.get接口</el-button>
        <el-button type="danger" size="default" @click="testMyAxios">测试我定义AXIOS</el-button>
        <el-button type="danger" size="default" @click="testMyApi">测试我定义接口</el-button>
        <!-- <div><el-text>{{ res1 }}</el-text></div>
        <div><el-text>{{ res2 }}</el-text></div>
        <div><el-text>{{ res3 }}</el-text></div> -->
    </div>

</template>

<style scoped>
.main{
    display: grid;
    grid-template-columns: repeat(4,25%);
}
</style>
