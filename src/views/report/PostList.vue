<template>
    <el-container style="height: 100%;" ref="box">
        <el-main style="overflow: hidden;">
            <!-- 表格                    边框    是否为斑马纹-->
            <el-table :data="tableList" border stripe :max-height="tableHeight">
                <el-table-column prop="postId" label="序号" width="100" align="center" sortable></el-table-column>
                <el-table-column prop="basePostInfoVo" label="帖子标题" width="200">
                    <template #default="scope">
                        <el-text line-clamp="1">
                            {{ scope.row.basePostInfoVo.title }}
                        </el-text>
                    </template>
                </el-table-column>
                <el-table-column prop="basePostInfoVo" label="帖子内容" width="200">
                    <template #default="scope">
                        <el-text line-clamp="1">
                            {{ scope.row.basePostInfoVo.contentText }}
                        </el-text>
                    </template>
                </el-table-column>
                <el-table-column prop="reason" label="举报理由" align="center"></el-table-column>
                <el-table-column label="举证图片" width="100">
                    <template #default="scope">
                        <el-image v-if="scope.row.images != null && scope.row.images.length > 0" :src="scope.row.images[0]"
                            :lazy="true" :preview-src-list="scope.row.images" :z-index="3" style="height: 100px;"
                            preview-teleported fit="contain"> </el-image>
                        <div v-else>用户未上传相关图片</div>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center" width="200">
                    <template #default="scope">
                        <el-button type="primary" icon="Edit" size="default"
                            @click="toPostReview(scope.row)">处理</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <br>
        </el-main>
        <!-- 高度自定义,居中 -->
        <el-footer style="height: auto;display: flex;justify-content: center;">
            <el-pagination layout="total,sizes,prev, pager, next,jumper" :total="queryParam.total" background
                v-model:current-page="queryParam.curPage" v-model:page-size="queryParam.pageSize"
                :default-page-size="queryParam.pageSize" :page-sizes="[3, 5, 7, 10]" @size-change="sizeChange"
                @current-change="curChange" />
        </el-footer>
    </el-container>


</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import SysDialog from '@/components/SysDialog.vue';
import useDialog from '@/hooks/useDialog';
import { getPostReportListApi, rejectedReportApi, type ReportParam, resolvedReportApi } from '@/api/report';
import { userStore } from '@/stores/user';
import type { MyCommentReport } from '@/api/report/ReportModel';
import { ElMessage, type FormInstance } from 'element-plus';
import { useRouter } from 'vue-router';

const router = useRouter();
let ustore = userStore()
const { dialog, onClose, onConfirm, onShow } = useDialog()//初始弹窗
//搜索参数同时也是页面参数
const queryParam = ref<ReportParam>({
    pageSize: 10,
    curPage: 1,
    total: 10
})
let tableList = ref([])//表格数据
let getReportPostList = async () => {
    let res = await getPostReportListApi(queryParam.value)
    if (res && res.code == 200) {
        tableList.value = res.data.records
        queryParam.value.total = res.data.total;
    }
}

//页面变动相关
let curChange = () => {
    console.log("当前页面：" + queryParam.value.curPage);
    getReportPostList()
}
let sizeChange = () => {
    console.log("当前页大小：" + queryParam.value.pageSize);
    getReportPostList()
}
// 打开处理弹窗
// 跳转处理页面
let toPostReview = (row: any) => {
    router.push({
        name: 'postReview',
        query: { 
            report: JSON.stringify(row) // 序列化为JSON字符串
        }
    });
}

const addFormRef = ref<FormInstance>()

// 提交
let report = ref<MyCommentReport>({
    reportId: '',
    commentId: '',
    status: '',
    handledBy: '',
    result: ''
})

const commit = async () => {
    report.value.handledBy = ustore.username
    addFormRef.value?.validate(async (valid) => {
        if (valid) { //验证通过
            ElMessage.success("验证通过")
            let res
            if (report.value.status == "resolved") { //违规，举报成功
                res = await resolvedReportApi(report.value);
            } else {  //合法，举报失败
                res = await rejectedReportApi(report.value)
            }
            if (res && res.code == 200) {
                //信息提示
                ElMessage.success(res.msg)
                getReportPostList()
                //关闭弹框
                dialog.visible = false;
            }
        } else {
            ElMessage.error("验证未通过！重新填写信息！！！")
        }
    });
}


let box = ref(null)//用来挂载元素
let tableHeight = ref(0)
onMounted(() => {
    console.log(window.innerHeight);
    tableHeight.value = window.innerHeight - 60 - 20 * 2 - 32 - 20 * 2 - 50
    console.log(tableHeight.value);
    //表格高度 =  窗口高度 - (Layout el-heard) - (Layout el-main的padding) - (el-footer) -(el-main的padding) -(搜索表单)
    getReportPostList()

})

let rules = {
    status: [
        {
            required: true,
            message: "必选"
        }
    ]

}

</script>
<style scoped>
.test {
    color: #686868;
}
</style>