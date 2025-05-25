<template>
    <el-container style="height: 100%;" ref="box">
        <el-main style="overflow: hidden;">
            <div style="display: flex;justify-content: space-between;height: 320px">
                <div id="chart" class="block" style="width: 65%"></div>
                <div class="devInfo">
                    <el-card style="max-width: 100%;display: block;">
                        <h3 class="date">{{ formattedDate }}</h3>
                        <h4 class="time">{{ formattedTime }}</h4>
                        
                    </el-card>
                    <el-card style="max-width: 100%;display: block;">
                        <h3>总帖子数：{{ sysNum.post }}</h3>
                        <h3>总评论数：{{ sysNum.comment }}</h3>
                    </el-card>
                </div>
            </div>
            <el-card class="Panel">
                <el-row :gutter="20">
                    <el-col :span="5">
                        <div class="PanelItem" style="background-image: linear-gradient(to right,#ffb650,#ff577f);"
                            @click="router.push('/postList')">
                            <div>{{ toDoNum.post }}</div>
                            <div>待审核帖子</div>
                        </div>
                    </el-col>
                    <el-col :span="5">
                        <div class="PanelItem" style="background-image: linear-gradient(to right,#50e2ff,#36b0f1);"
                            @click="router.push('/commentList')">
                            <div>{{ toDoNum.comment }}</div>
                            <div>待审核评论</div>
                        </div>
                    </el-col>
                    <el-col :span="5">
                        <div class="PanelItem"
                            style="background-image: linear-gradient(to right,rgb(121, 232, 211),rgb(0, 178, 166))"
                            @click="router.push('/appfeedback')">
                            <div>{{ toDoNum.app }}</div>
                            <div>反馈与建议</div>
                        </div>
                    </el-col>
                    <el-col :span="5">
                        <div class="PanelItem" style="background-image: linear-gradient(to right,#6abeff,#7b57ff);"
                            @click="router.push('/addboard')">
                            <div>{{ toDoNum.board }}</div>
                            <div>小程序版区申请</div>
                        </div>
                    </el-col>
                    <el-col :span="4">
                        <div class="PanelItem" style="background-image: linear-gradient(to right,#c3c3c3,#a6a6a6);">
                            <div>更多功能</div>
                            <div>敬请期待</div>
                        </div>
                    </el-col>
                </el-row>
            </el-card>
        </el-main>
    </el-container>

</template>
<script setup lang="ts">
import * as echarts from 'echarts';
import { onMounted, nextTick, ref, reactive, onUnmounted, computed } from "vue";
import { getUserActiveOneMonthApi } from "@/api/log"
import { getCountOfReportByTypeApi } from '@/api/report';
import { getCountOfBoardPendingApi } from '@/api/board';
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';
import { getCountOfNormalPostApi } from '@/api/post';
import { getCountOfNormalCommentApi } from '@/api/comment';
const router = useRouter();
//窗口高度
const mainHeight = ref(0);
// 图表
let myChart: echarts.ECharts | null = null;
// 初始化图表
const option = {
    title: {
        text: '近30天小程序流量'
    },
    tooltip: {
        trigger: 'axis'
    },
    legend: {
        data: ['用户活跃数', '用户注册数']
    },
    xAxis: {
        type: 'category',
        data: ['Mon']
    },
    yAxis: {
        type: 'value'
    },
    series: [
        {
            data: [0],
            name: "用户活跃数",
            type: 'line'
        },
        {
            data: [0],
            name: "用户注册数",
            type: 'line'
        }
    ]
};

const getUserActiveOneMonth = async () => {
    let res = await getUserActiveOneMonthApi()
    if (res && res.code == 200) {
        option.xAxis.data = res.data.dates
        option.series[0].data = res.data.activeCounts
        option.series[1].data = res.data.registerCounts
        initChart()
    }
}
const initChart = () => {
    const chartDom = document.getElementById('chart')!;
    myChart = echarts.init(chartDom);
    myChart.setOption(option);
};

// 时间响应式变量
const currentTime = ref(new Date())
// 定时器句柄
let timer: number | null = null
// 格式化时间计算属性
const formattedTime = computed(() => {
    return currentTime.value.toLocaleTimeString('zh-CN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    })
})

// 格式化日期计算属性
const formattedDate = computed(() => {
    return currentTime.value.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        weekday: 'short'
    })
})

let sysNum = ref({
    post: 0,
    comment: 0,
})

let toDoNum = ref({
    post: 0,
    comment: 0,
    app: 0,
    board: 0
})

let getNums = async () => {
    let res1 = await getCountOfReportByTypeApi()
    let res2 = await getCountOfBoardPendingApi()
    if (res1 && res1.code == 200) {
        toDoNum.value.post = res1.data.postCount
        toDoNum.value.comment = res1.data.commentCount
        toDoNum.value.app = res1.data.appCount
    } else ElMessage.error("获取待办失败")
    if (res2 && res2.code == 200) {
        toDoNum.value.board = res2.data
    } else ElMessage.error("获取待办版区失败")

    let res3 = await getCountOfNormalPostApi()
    let res4 = await getCountOfNormalCommentApi()
    if (res3 && res3.code == 200) {
        sysNum.value.post = res3.data
    } else ElMessage.error("获取post数量失败")
    if (res4 && res4.code == 200) {
        sysNum.value.comment = res4.data
    } else ElMessage.error("获取comment数量失败")
}

//挂载
onMounted(() => {
    nextTick(() => {
        getUserActiveOneMonth()
        getNums()
        mainHeight.value = window.innerHeight - 60 - 20 * 2
        //表格高度 =  窗口高度 - (Layout el-heard) - (Layout el-main的padding)
        //每秒更新时间
        timer = setInterval(() => {
            currentTime.value = new Date()
        }, 1000) as unknown as number
    });

})
onUnmounted(() => {
    myChart?.dispose()
    if (timer) {
        clearInterval(timer)
    }
})
</script>
<style lang="scss" scoped>
.block {
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
    padding: 20px;
}

.devInfo {
    width: 30%;
    height: 100%;
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    // border: #00c0ef 1px solid;
}

.Panel {
    margin-top: 20px;

    .PanelItem {
        box-sizing: border-box;
        height: 110px;
        // border: 1px salmon solid;
        border-radius: 5px;
        // text-align: center;
        // line-height: 110px;
        color: #ffffff;
        padding: 20px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        font-weight: bold;
        font-size: large;
        transition: all 0.5s;
    }

    .PanelItem:hover {
        box-shadow: 0 5px 12px 0 rgba(0, 0, 0, 0.3)
    }
}

.myColor {
    background-color: #a6a6a6;
}
</style>