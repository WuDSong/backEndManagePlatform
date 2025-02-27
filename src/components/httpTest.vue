<script setup lang="ts">
import axios from 'axios';
let get=async()=>{
    let res=await axios({
        url: "http://localhost:12345/api/post/allList",
    })
    console.log(res);
    
}

let getMini=async()=>{
    
    let res=await axios.get("http://localhost:12345/api/post/allList")
    console.log(res);
    
}
</script>

<template>
    <h1>Http Test</h1>
    <el-icon color="red">
        <Edit />
    </el-icon>
    <el-button type="primary" size="default" @click="get">测试Get</el-button>
    <el-button type="success" size="mini" @click="getMini">测试axios.get</el-button>
</template>

<style scoped></style>
