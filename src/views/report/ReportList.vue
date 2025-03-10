<template>
    <UploadSingleImage :uploadParam="uploadParam" @refresh="getInfo"></UploadSingleImage>

    <h2>父组件父组件</h2>
    <div>{{ uploadParam }}</div>
</template>

<script setup lang="ts">
import type { uploadImageParameter } from '@/api/img/uploadImageModel';
import UploadSingleImage from '@/components/UploadImage.vue'
import { ref } from 'vue';
let uploadParam=ref<uploadImageParameter>({
    imgCount:2,
    fileList:[],
    moreLimitMode:2,
    size:10
})

let getInfo=(data: any)=>{
    // console.log("子组件数据返回:");
    // console.log(data);
}
</script>