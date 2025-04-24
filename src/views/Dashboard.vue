<template>
    <el-main :style="{ height: mainHeight + 'px' }">
        <!-- 数据统计 -->
        <el-row :gutter="20" style="margin-bottom: 30px">
            <el-col :span="6">
                <div class="show-header" style="background:rgb(67,171,144)">
                    <div class="show-num">{{ total.doTotal }}</div>
                    <div class="bottom-text">待处理投诉</div>
                </div>
            </el-col>
            <el-col :span="6">
                <div class="show-header" style="background: rgb(67,171,144)">
                    <div class="show-num">{{ total.userTotal }}</div>
                    <div class="bottom-text">用户总数</div>
                </div>
            </el-col>
            <el-col :span="6">
                <div class="show-header" style="background: rgb(67,171,144)">
                    <div class="show-num">{{ total.unusedTotal }}</div>
                    <div class="bottom-text">人工待审帖子总数</div>
                </div>
            </el-col>
            <el-col :span="6">
                <div class="show-header" style="background: rgb(67,171,144)">
                    <div class="show-num">{{ total.imgTotal }}</div>
                    <div class="bottom-text">人工待审图片总数</div>
                </div>
            </el-col>
        </el-row>
        <el-row :gutter="20">
            <el-col :span="12">
                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <span style="color: #000000; font-weight: 600; margin-bottom: 10px">最近投诉</span>
                        <!-- 分割线 -->
                        <el-divider></el-divider>
                    </div>
                    <div v-for="item in list" :key="item.reportId" class="text item">
                        <span style="font-weight: 600; font-size: 14px">{{
                            item.goodsName }}</span>
                        <span style="margin-left: 30px; font-size: 14px">{{
                            item.reason }}</span>
                        <span style="margin-left: 30px; font-size: 14px">{{
                            item.reportUser }}</span>
                        <span style="margin-left: 30px; font-size: 14px">{{
                            item.reportTime }}</span>
                        <el-divider></el-divider>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="12">
                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <span style="color: #000000; font-weight: 600; margin-bottom: 10px">日历</span>
                        <el-divider></el-divider>
                    </div>
                    <el-calendar v-model="value" />
                </el-card>
            </el-col>
        </el-row>
    </el-main>
</template>
<script setup lang="ts">

import { onMounted, nextTick, ref, reactive } from "vue";
//窗口高度
const mainHeight = ref(0);
//日历
const value = ref(new Date());
//获取总数
const total = reactive({
    doTotal: 165,
    unusedTotal: 644,
    userTotal: 48,
    imgTotal:20
})

//投诉
interface GoodsReport {
    goodsId: number,
    goodsName: string,
    reason: string,
    reportId: number,
    reportTime: string,
    reportUser: number,
    status: string,
}
//获取投诉
const list = ref<GoodsReport[]>([])

//挂载
onMounted(() => {
    nextTick(() => {
        mainHeight.value = window.innerHeight;//监听窗口大小
    });
});
</script>
<style lang="scss" scoped>
.bottom-text {
    bottom: 0;
    width: 100%;
    background: rgba(0, 0, 0, 0.1);
    height: 25px;
    line-height: 25px;
    text-align: center;
    position: absolute;
    font-weight: 600;
}

.show-header {
    background: #00c0ef;
    color: #fff;
    height: 100px;
    border-radius: 5px;
    position: relative;
}

.show-num {
    font-size: 38px;
    font-weight: 600;
    padding:5px;
    text-align: center;
}
</style>