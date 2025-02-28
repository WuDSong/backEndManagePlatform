<script setup lang="ts">
import SysDialog from "@/components/SysDialog.vue"
import { ref } from "vue";
import  useDialog  from "@/hooks/useDialog"; 

let outSideNum=ref(0)
//获取弹框属性和方法，在页面调用
const { dialog, onClose, onConfirm, onShow } = useDialog();
</script>
<template>
    <div>这里是仪表板</div>
    <el-button type="primary" size="default" @click="onShow">弹窗</el-button>
    <SysDialog :title="dialog.title" :dialogVisible="dialog.visible" @onClose="onClose" @onConfirm="onConfirm">
        <template #content>
            <div>
                Test
            </div>
        </template>
    </SysDialog>
    <div>{{ outSideNum }}</div>
</template>
<style>
</style>