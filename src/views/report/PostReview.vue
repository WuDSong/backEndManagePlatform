<template>
    <el-container style="height: 100%;" ref="box">
        <el-main class="main">
            <el-card style="min-width: 480px;">
                <h2 class="title">{{ reportData.basePostInfoVo.title }}</h2>
                <div class="meta">
                    <span class="post-id">帖子ID: {{ reportData.basePostInfoVo.postId }}</span>
                    <span class="time">发布时间: {{ reportData.basePostInfoVo.createdAt }}</span>
                </div>
                <div class="content" v-html="reportData.basePostInfoVo.content"></div>
            </el-card>
        </el-main>
        <el-aside width="500px" class="aside">
            <el-card style="margin-left: 20px;">
                <div class="report-header">
                    <h3>举报信息</h3>
                    <span class="report-id">举报ID: {{ reportData.reportId }}</span>
                </div>
                <div class="report-detail">
                    <div class="detail-item">
                        <label>举报原因：</label>
                        <span>{{ reportData.reason }}</span>
                    </div>
                    <div class="detail-item">
                        <label>举报时间：</label>
                        <span>{{ reportData.createdAt }}</span>
                    </div>

                    <div class="evidence-images" v-if="reportData.images.length">
                        <label>举证图片：</label>
                        <div>
                            <el-image class="img" v-for="(item, index) in reportData.images" :src="item" fit="cover"
                                :lazy="true" :preview-src-list="reportData.images" preview-teleported
                                :initial-index="index" />
                        </div>
                    </div>
                </div>
                <el-divider />
                <el-input v-model.trim="report.result" style="width: 100%" :rows="4" type="textarea" placeholder="审核结果"
                    maxlength="150" show-word-limit />
                <div style="margin-top: 15px;">
                    <el-button @click="report.result = '该帖子没有您的举报问题。'">便捷驳回理由</el-button>
                    <el-button @click="report.result = '您举报的问题成立。'">便捷通过理由</el-button>
                </div>
                <div style="margin-top: 15px;">
                    <el-button type="success" @click="handleAudit('resolved')">通过</el-button>
                    <el-button type="danger" @click="handleAudit('rejected')">驳回</el-button>
                </div>
                <!-- <div>{{ report }}</div> -->
            </el-card>
        </el-aside>
    </el-container>

</template>

<script setup lang="ts">

import type { MyCommentReport, MyPostReport } from '@/api/report/ReportModel';
import { ElMessage } from 'element-plus';
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { userStore } from '@/stores/user';
import { rejectedReportApi, resolvedReportApi } from '@/api/report';
let ustore = userStore()

interface ReportData {
    reportId: string;
    reason: string;
    images: string[];
    createdAt: string;
    postId: number;
    basePostInfoVo: {
        postId: string;
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

let report = ref<MyPostReport>({
    reportId: reportData.value.reportId,
    status: '',
    handledBy: ustore.username,
    result: ''
})


const handleAudit = async (action: 'resolved' | 'rejected') => {
    try {
        if (report.value.result == "") {
            ElMessage.error("请填写审核结果")
            return
        }
        report.value.status = action
        let res
        if (report.value.status == "resolved") { //违规，举报成功
            res = await resolvedReportApi(report.value);
        } else {  //合法，举报失败
            res = await rejectedReportApi(report.value)
        }
        if (res && res.code == 200) {
            //信息提示
            ElMessage.success(res.msg)
            setTimeout(() => {
                router.replace('/postList');
            },2000)
        }
        // 审核成功后返回上一页
        // router.go(-1);

    } catch (error) {
        console.error('审核操作失败', error);
        // 处理错误情况
    }
};


</script>
<style scoped lang="scss">
.main {

    // border: 1px darkblue solid;
    padding: 10px;
    padding-top: 0;
    overflow-y: auto;

    .title {
        font-size: 20px;
        margin-bottom: 12px;
        color: #333;
    }

    .meta {
        display: flex;
        gap: 15px;
        font-size: 12px;
        color: #666;
        margin-bottom: 15px;
    }

    .content {
        line-height: 1.6;
        color: #444;
        height: 100%;
        overflow-y: auto;
    }
}

.aside {
    overflow-y: auto;

    .report-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 15px;
    }

    .report-detail {
        .detail-item {
            margin-bottom: 12px;

            label {
                color: #666;
                font-weight: 500;
            }
        }
    }

    .evidence-images {
        .img {
            width: 100px;
            height: 100px;
            margin-right: 10px;
        }
    }
}
</style>