<template>
    <el-container style="height: 100%;" ref="box">
        <el-main style="overflow: hidden;">
            <el-form :model="searchParam" :inline="true" size="default">
                <el-form-item>
                    <el-input v-model="searchParam.name" placeholder="请输入..." :prefix-icon="Search">
                    </el-input>
                </el-form-item>
                <el-form-item>
                    <el-button icon="Search" @click="searchBtn">搜索</el-button>
                    <el-button icon="Close" type="danger" plain @click="resetBtn">重置</el-button>
                    <el-button type="primary" icon="Plus" @click="addBtn">新增</el-button>
                </el-form-item>
            </el-form>
            <!-- 表格                    边框    是否为斑马纹-->
            <el-table :data="tableList" border stripe :max-height="tableHeight">
                <el-table-column prop="id" label="ID" width="70" align="center" sortable></el-table-column>
                <el-table-column prop="title" label="标题" align="center" show-overflow-tooltip></el-table-column>
                <el-table-column prop="icon" label="轮播图片" min-width="100">
                    <template #default="scope">
                        <el-image :src="scope.row.imageUrl" :lazy="true" :preview-src-list="[scope.row.imageUrl]"
                            :z-index="3" style="height: 100px;" preview-teleported></el-image>
                            <!-- preview-teleported 将预览层挂载到 body 元素下，避免被父级容器样式影响 -->
                    </template>
                </el-table-column>
                <el-table-column prop="isActive" label="Active" width="70" align="center">
                    <template #default="scope">
                        <el-tag v-if="scope.row.isActive == true" type="success" effect="plain">启用</el-tag>
                        <el-tag v-if="scope.row.isActive == false" type="danger" effect="plain">禁用</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="postId" label="post" width="60" align="center"></el-table-column>
                <el-table-column prop="startTime" label="开始时间" width="170" align="center">
                    <template #default="scope">
                        <div v-if="scope.row.startTime == null" type="success" effect="plain" style="padding: 0 10px;">
                            <el-divider />
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="endTime" label="结束时间" width="170" align="center">
                    <template #default="scope">
                        <div v-if="scope.row.endTime == null" type="success" effect="plain" style="padding: 0 10px;">
                            <el-divider />
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="sortOrder" label="序号" width="60" align="center"></el-table-column>
                <el-table-column label="操作" align="center" width="210">
                    <template #default="scope">
                        <el-button type="primary" icon="Edit" size="default" @click="editBtn(scope.row)">编辑</el-button>
                        <el-button type="danger" icon="Delete" size="default"
                            @click="deleteBtn(scope.row.id)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <br>
        </el-main>
        <!-- 高度自定义,居中 -->
        <el-footer style="height: auto;display: flex;justify-content: center;">
            <el-pagination layout="total,sizes,prev, pager, next,jumper" :total="searchParam.total" background
                v-model:current-page="searchParam.curPage" v-model:page-size="searchParam.pageSize"
                :default-page-size="searchParam.pageSize" :page-sizes="[3, 5, 7, 10]" @size-change="sizeChange"
                @current-change="curChange" />
        </el-footer>
    </el-container>
    <!-- 添加，修改 -->
    <SysDialog :title="dialog.title" :dialogVisible="dialog.visible" @onClose="onClose" @onConfirm="commit"
        :width="dialog.width">
        <template #content>
            <el-form :model="banner" ref="addFormRef" :rules="rules" label-width="130px" :inline="true"
                label-position="right" style="padding: 10px 20px;">
                <el-form-item prop="title" label="轮播图标题">
                    <el-input v-model="banner.title" style="width: 150px;" placeholder="喵喵喵"></el-input>
                </el-form-item>
                <el-form-item prop="sortOrder" label="排序">
                    <el-input-number v-model="banner.sortOrder" :min="0" :max="100" style="width: 100px;" />
                </el-form-item>
                <el-form-item prop="dateTime" label="始终时间">
                    <el-date-picker v-model="dateTimeRanges" type="datetimerange" start-placeholder="开始于"
                        end-placeholder="结束于" format="YYYY-MM-DD HH:mm:ss" date-format="YYYY/MM/DD ddd"
                        time-format="hh:mm:ss" unlink-panels value-format="YYYY-MM-DD HH:mm:ss">
                        <!-- date-format time-format 时间选择器下拉列表中显示的时间格式 format显示在输入框中的格式 
                         value-format  绑定值的格式。 不指定则绑定值为 Date 对象-->
                        <template #prev-month><el-icon>
                                <CaretLeft />
                            </el-icon> </template>
                        <template #next-month>
                            <el-icon>
                                <CaretRight />
                            </el-icon>
                        </template>
                        <template #prev-year></template>
                        <template #next-year></template>
                    </el-date-picker>
                </el-form-item>
                <el-row>
                    <el-form-item prop="isActive" label="是否启用">
                        <el-switch v-model="banner.isActive">
                            <template #active-action>
                                <span class="custom-active-action">T</span>
                            </template>
                            <template #inactive-action>
                                <span class="custom-inactive-action">F</span>
                            </template>
                        </el-switch>
                    </el-form-item>
                    <el-form-item prop="postId" label="点击轮播跳转至">
                        <!-- filterableSelect 组件是否可筛选  remote是否从服务器远程加载  multiple是否多选 -->
                        <el-select v-model="banner.postId" filterable remote :remote-method="remoteMethod"
                            placeholder="请输入帖子标题">
                            <el-option v-for="item in options" :key="item.postId"
                                :label="item.title + '(postId:' + item.postId + ')'" :value="item.postId">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-row>
                <el-form-item prop="imageUrl" label="轮播图">
                    <UploadSingleImage :uploadParam="uploadParam">
                        <template #extraTip>
                            <div v-if="uploadParam.fileList.length === 0" style="color: red"><el-icon>
                                    <WarnTriangleFilled />
                                </el-icon>上传图片</div>
                        </template>
                    </UploadSingleImage>
                </el-form-item>

            </el-form>
        </template>
    </SysDialog>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import SysDialog from '@/components/SysDialog.vue';
import useDialog from '@/hooks/useDialog';
import dayjs from 'dayjs'
import { ElMessage, ElMessageBox, ElNotification, type FormInstance, type UploadUserFile } from 'element-plus';
import { nextTick } from 'vue';
import { Calendar, Search } from '@element-plus/icons-vue'
import UploadSingleImage from '@/components/UploadImage.vue'
import type { uploadImageParameter } from '@/api/img/uploadImageModel';
import type { Banner, BannerParam } from '@/api/banner/BannerModel';
import { addBannerApi, delBannerApi, getBannerListApi, updateBannerApi } from '@/api/banner';
import { getPostByIdApi, getPostListApi } from '@/api/post';
import type { Post, PostParam } from '@/api/post/PostModel';
const { dialog, onClose, onConfirm, onShow } = useDialog()//初始弹窗
//搜索参数同时也是页面参数
const searchParam = ref<BannerParam>({
    name: "",
    pageSize: 7,
    curPage: 1,
    total: 10
})
let tableList = ref([])//表格数据
let getBannerList = async () => {
    let res = await getBannerListApi(searchParam.value)
    if (res && res.code == 200) {
        tableList.value = res.data.records
        searchParam.value.total = res.data.total;
    }
}
//搜索相关
let searchBtn = () => { getBannerList() }
let resetBtn = () => {
    searchParam.value.name = ""
    getBannerList()
}
//页面变动相关
let curChange = () => {
    console.log("当前页面：" + searchParam.value.curPage);
    getBannerList()
}
let sizeChange = () => {
    console.log("当前页大小：" + searchParam.value.pageSize);
    getBannerList()
}

// 弹窗相关--------------------------------------------------------------
// 修改对象
let banner = ref<Banner>({//数据
    title: "",
    sortOrder: 0,
    isActive:true
})
// 用来装载日期时间选择器
let dateTimeRanges = ref<string[]>([])
let mode = ref(0) //0 时新建模式，1 时是修改编辑模式
let uploadParam = ref<uploadImageParameter>({ //上传图片的模式
    imgCount: 1,
    moreLimitMode: 1,
    size: 10,
    fileList: []  //UploadUserFile类型
})
// 表单ref属性
const addFormRef = ref<FormInstance>()

// 点击新建，显示弹窗
let addBtn = () => {
    mode.value = 0
    dialog.width = 700
    dialog.visible = true
    addFormRef.value?.resetFields()//清空表单
    //清空上传信息
    uploadParam.value.fileList = []
    dateTimeRanges.value = []
    options.value = []
    // 额外添加 ：addFormRef.value?.resetFields() 需要添加props在表单里才会生效吗？ 是的
    // banner.value.postId=null
    // banner.value.isActive=false
}

let editBtn = async (row: Banner) => {
    mode.value = 1
    dialog.width = 700
    dialog.title = '修改版区信息'
    dialog.visible = true
    nextTick(() => {
        Object.assign(banner.value, row)
    })
    addFormRef.value?.resetFields()//清空表单
    uploadParam.value.fileList = []
    // 图片封装UploadUserFile
    let uploadedUserFile: UploadUserFile = {
        name: "",
        url: row.imageUrl
    }
    uploadParam.value.fileList.push(uploadedUserFile)
    // 日期选择器
    dateTimeRanges.value = [row.startTime!, row.endTime!]
    // post选择器
    if (row.postId) {
        let res = await getPostByIdApi(row.postId)
        if (res && res.code == 200) {
            options.value = [res.data]
        }
    }

}
// 点击提交
let commit = async () => {
    // console.log(typeof(dateTimeRanges.value[0]));
    // console.log(dateTimeRanges.value[0] instanceof Date);
    // console.log(dateTimeRanges);
    if (dateTimeRanges.value && dateTimeRanges.value.length > 0) {
        banner.value.startTime = dateTimeRanges.value[0] || null
        banner.value.endTime = dateTimeRanges.value[1] || null
    }
    if (uploadParam.value.fileList.length != 0)
                banner.value.imageUrl = uploadParam.value.fileList[0].url
    // 表单验证
    addFormRef.value?.validate(async (valid) => {
        if (valid) { //验证通过
            // console.log(addModel);
            let res = null
            if (mode.value == 0) {
                res = await addBannerApi(banner.value);
            } else {
                res = await updateBannerApi(banner.value)
            }
            if (res && res.code == 200) {
                //信息提示
                ElMessage.success(res.msg)
                getBannerList()
                //关闭弹框
                dialog.visible = false;
            }
        } else {
            ElMessage.error("验证未通过！重新填写信息！！！")
        }
    });


}


let deleteBtn = (id: string) => {
    ElMessageBox.confirm('确定删除该版区吗?', '系统提示',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }).then(async () => {
            let res = await delBannerApi(id)
            if (res.code == 200) {
                ElMessage.success(res.msg)
                getBannerList()
            }
        }).catch(() => {
            ElMessage.info("删除已取消！")
        })
}

// 弹窗里的select
// 从远程服务器获取
let selectLoading = ref(false)    // 加载状态
let options = ref<Post[]>([])             // select选项
let queryParam = ref<PostParam>({
    curPage: 1,
    pageSize: 5,
    title: ''
})
let remoteMethod = async (query: string | null) => {
    if (!query || query.length <= 0 || query == '' || query == null) {
        options.value = []
        return;
    }
    queryParam.value.title = query
    console.log("select选择器请求");
    if (query) {
        selectLoading.value = true
        let res = await getPostListApi(queryParam.value)
        if (res && res.code == 200) {
            options.value = res.data.records
            selectLoading.value = false
        }
    } else {
        options.value = []
    }
}

let box = ref(null)//用来挂载元素
let tableHeight = ref(0)
onMounted(() => {
    console.log(window.innerHeight);
    tableHeight.value = window.innerHeight - 60 - 20 * 2 - 32 - 20 * 2 - 50
    console.log(tableHeight.value);
    //表格高度 =  窗口高度 - (Layout el-heard) - (Layout el-main的padding) - (el-footer) -(el-main的padding) -(搜索表单)
    getBannerList()
})
let rules = {
    title: [
        { required: true, message: '轮播图标题不能为空', trigger: 'blur' },
        { min: 2, max: 20, message: '标题长度低于2字符且不能超过20个字符', trigger: 'blur' }
    ],
    imageUrl: [
        {
            validator: (rule: any, value: any, callback: any) => {
                if(banner.value.imageUrl==''||banner.value.imageUrl==null)
                    callback(new Error('请选择时间范围'))
                callback()
            },
            trigger: 'blur'
        },
        {
            required: true
        }
    ]
}
</script>
<style scoped>
.test {
    color: #686868;
}
</style>