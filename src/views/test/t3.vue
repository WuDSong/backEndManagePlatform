<template>
    <el-container style="height: 100%;" ref="box">
        <el-main style="overflow: hidden;border: 1px darkblue solid;">

        </el-main>
        <el-aside width="360px" style="border: 1px red solid;">Aside</el-aside>
    </el-container>

</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
interface ReportData {
    reportId: number;
    reason: string;
    images: string[];
    createdAt: string;
    postId: number;
    basePostInfoVo: {
        postId: number;
        title: string;
        createdAt: string;
        coverImages: string[] | null;
        content: string;
    };
}
const route = useRoute();
const router = useRouter();
const reportData = ref<ReportData>({} as ReportData);
// 解析路由参数
try {
    reportData.value = JSON.parse(route.query.report as string);
} catch (error) {
    console.error('解析路由参数失败', error);
    // 可以在这里添加错误处理逻辑，比如跳转到错误页面
}

const handleAudit = async (action: 'pass' | 'reject') => {
    try {
        // 这里调用审核接口
        // await auditPost(reportData.value.reportId, action, auditComment.value);

        // 审核成功后返回上一页
        router.go(-1);
    } catch (error) {
        console.error('审核操作失败', error);
        // 处理错误情况
    }
};

const handlePreview = (img: string) => {
    
};

</script>
<style scoped lang="scss"></style>