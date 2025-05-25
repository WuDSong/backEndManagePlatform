<template>
    <el-container style="height: 100%;" ref="box">
        <el-main style="overflow: hidden;">
            <!-- 表格                    边框    是否为斑马纹-->
            <el-table :data="tableList" border stripe :max-height="tableHeight">
                <el-table-column prop="reportId" label="序号" width="100" align="center" sortable></el-table-column>
                <el-table-column prop="reason" label="建议与反馈" min-width="200">
                    <template #default="scope">
                        <el-text line-clamp="3">
                            {{ scope.row.reason }}
                        </el-text>
                    </template>
                </el-table-column>
                <el-table-column label="图片" width="100">
                    <template #default="scope">
                        <el-image v-if="scope.row.images != null && scope.row.images.length > 0"
                            :src="scope.row.images[0]" fit="cover" :lazy="true" :preview-src-list="scope.row.images"
                            :z-index="3" style="height: 100px;" preview-teleported> </el-image>
                        <div v-else>用户未上传相关图片</div>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center" width="300">
                    <template #default="scope">
                        <el-button type="primary" icon="Edit" size="default" @click="handleAudit(scope.row.reportId,'resolved')">采纳并修改</el-button>
                        <el-button type="danger" icon="Edit" size="default" @click="handleAudit(scope.row.reportId,'rejected')">拒绝/无法完成</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <br>
        </el-main>
    </el-container>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import useDialog from '@/hooks/useDialog';
import { getAppSuggestionListApi, getCommentReportListApi, rejectedReportApi, type ReportParam, resolvedReportApi } from '@/api/report';
import { userStore } from '@/stores/user';
import type { MyCommentReport, MyReport } from '@/api/report/ReportModel';
import { ElMessage, type FormInstance } from 'element-plus';
let ustore = userStore()
const { dialog, onClose, onConfirm, onShow } = useDialog()//初始弹窗
//搜索参数同时也是页面参数
const queryParam = ref<ReportParam>({
    pageSize: 20,
    curPage: 1,
    total: 10
})
let tableList = ref([])//表格数据
let getAppSuggestionList = async () => {
    let res = await getAppSuggestionListApi(queryParam.value)
    if (res && res.code == 200) {
        tableList.value = res.data.records
        queryParam.value.total = res.data.total;
    }
}

// 提交
let report = ref<MyReport>({
    reportId: '',
    status: '',
    handledBy: '',
    result: ''
})

const handleAudit = async (id:any,action: 'resolved' | 'rejected') => {
    report.value.handledBy = ustore.username
    report.value.status = action
    report.value.reportId=id
    console.log(report.value);
    let res
    if (report.value.status == "resolved") { //违规，举报成功
        res = await resolvedReportApi(report.value);
    } else {  //合法，举报失败
        res = await rejectedReportApi(report.value)
    }
    if (res && res.code == 200) {
        //信息提示
        ElMessage.success("成功")
        getAppSuggestionList()
    }else ElMessage.error("失败，请稍后再试")
}


let box = ref(null)//用来挂载元素
let tableHeight = ref(0)
onMounted(() => {
    console.log(window.innerHeight);
    tableHeight.value = window.innerHeight - 60 - 20 * 2 - 32 - 20 * 2 - 50
    console.log(tableHeight.value);
    //表格高度 =  窗口高度 - (Layout el-heard) - (Layout el-main的padding) - (el-footer) -(el-main的padding) -(搜索表单)
    getAppSuggestionList()

})

</script>
<style scoped>
.test {
    color: #686868;
}
</style>