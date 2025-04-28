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
                <el-table-column prop="topicId" label="TopicId" width="100" align="center" sortable></el-table-column>
                <el-table-column prop="topicName" label="话题" align="center"></el-table-column>
                <el-table-column prop="topicIcon" label="图标" width="100">
                    <template #default="scope">
                        <el-image :src="scope.row.topicIcon" :lazy="true" :preview-src-list="[scope.row.topicIcon]"
                        :z-index="3" style="height: 100px;" preview-teleported fit="contain"> </el-image>
                    </template>
                </el-table-column>
                <el-table-column prop="topicDescription" label="描述" min-width="200">
                    <!-- show-overflow-tooltip 会只显示一行，而我想要显示的是不止一行 ，此外tooltip也是一行-->
                    <template #default="scope">
                        <el-text line-clamp="3">
                            {{ scope.row.topicDescription }}
                        </el-text>
                        <!-- el-text 居然可以满足 自动显示tooltip,虽然不好看但是可以用 -->
                    </template>
                </el-table-column>
                <!-- <el-table-column prop="createdAt" label="创建时间"  align="center"></el-table-column> -->
                <el-table-column prop="updatedAt" label="最近修改" align="center">
                    <template #default="scope">
                        <div v-if="scope.row.updatedAt == null" type="success" effect="plain" style="padding: 0 10px;">
                            <el-divider />
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="usageCount" label="热度/参与人数" align="center" width="140" sortable>
                    <template #default="scope">
                        {{ formatNumber(scope.row.usageCount) }}
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center" width="200">
                    <template #default="scope">
                        <el-button type="primary" icon="Edit" size="default" @click="editBtn(scope.row)">编辑</el-button>
                        <el-tooltip v-if="scope.row.usageCount != 0" placement="top">
                            <template #content> 该话题已经被引用啦~~~<br />只有不被引用，才可以删除！ </template>
                            <el-button type="danger" icon="Delete" size="default" @click="deleteBtn(scope.row.topicId)"
                            :disabled="scope.row.usageCount != 0">删除</el-button>
                        </el-tooltip>
                        <el-button v-else type="danger" icon="Delete" size="default" @click="deleteBtn(scope.row.topicId)">删除</el-button>
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
            {{ topic }}
            <el-form :model="topic" ref="addFormRef" :rules="rules" label-width="80px" :inline="true"
                label-position="right" style="padding: 10px 20px;">
                <el-form-item prop="topicName" label="话题">
                    <el-input v-model="topic.topicName" style="width: 150px;" placeholder="喵喵喵"></el-input>
                </el-form-item>
                <el-form-item prop="topicDescription" label="描述">
                    <el-input v-model="topic.topicDescription" type="textarea" :rows="4" placeholder="描述一下吧喵q(≧▽≦q)~"
                        style="width:360px;"></el-input>
                </el-form-item>
                <el-form-item prop="topicIcon" label="图标">
                    <UploadSingleImage :uploadParam="uploadParam" @change="fn">
                        <template #extraTip>
                            <div v-if="uploadParam.fileList.length === 0" style="color: red"><el-icon>
                                    <WarnTriangleFilled />
                                </el-icon>不上传，则使用默认图标</div>
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
import { ElMessage, ElMessageBox, ElNotification, type FormInstance, type UploadUserFile } from 'element-plus';
import { nextTick } from 'vue';
import { Calendar, Search } from '@element-plus/icons-vue'
import { getTopicListApi, addTopicApi, updateTopicApi, delTopicApi, isOccupiedTopicApi } from "@/api/topic/index"
import type { Topic, TopicParam } from "@/api/topic/TopicModel"
import UploadSingleImage from '@/components/UploadImage.vue'
import type { uploadImageParameter } from '@/api/img/uploadImageModel';
import { formatNumber } from "@/utils/number"
import { icons } from '@element-plus/icons-vue/global';
import { OBJAssignExisting } from '@/utils/ObjectCopy';
const { dialog, onClose, onConfirm, onShow } = useDialog()//初始弹窗
//搜索参数同时也是页面参数
const searchParam = ref<TopicParam>({
    name: "",
    pageSize: 7,
    curPage: 1,
    total: 10
})
let tableList = ref([])//表格数据
let getTopicList = async () => {
    let res = await getTopicListApi(searchParam.value)
    if (res && res.code == 200) {
        tableList.value = res.data.records
        searchParam.value.total = res.data.total;
    }
}
//搜索相关
let searchBtn = () => { getTopicList() }
let resetBtn = () => {
    searchParam.value.name = ""
    getTopicList()
}
//页面变动相关
let curChange = () => {
    console.log("当前页面：" + searchParam.value.curPage);
    getTopicList()
}
let sizeChange = () => {
    console.log("当前页大小：" + searchParam.value.pageSize);
    getTopicList()
}
//修改对象
// 每次添加新话题时是否正确地重置了这个对象？上次使用了topicIcon，这次是否topicIcon有值
// 当字段值为空字符串时，MyBatis-Plus会将其作为有效值插入，覆盖数据库默认值。需确保未传递的字段保持为 null 而非空字符串。
let topic = ref<Topic>({//数据
    topicId: '',
    topicName: '',
    topicIcon: '', //有了这一行则无法使用默认图标，除非增加服务器端的检测
    topicDescription: ''
})
/**调用了`addFormRef.value?.resetFields()`，但Element UI的`resetFields`方法会将表单字段重置为初始值，而初始的`topic`对象
 * 没有`topicIcon`属性，所以理论上会移除该属性。此外，`uploadParam.value.fileList = []`清空了上传列表，但在提交时，如果未选择图片，
 * `topicIcon`不会被赋值，保持为`undefined`。但需要注意，如果在编辑时修改了`topicIcon`，然后再次新增话题时，`topic`对象可能仍然
 * 保留`topicIcon`属性，因为Vue的响应式对象一旦添加了属性，会被保留。因此，在`addBtn`中，仅仅重置表单可能不够，
 * 需要彻底重置`topic.value`为一个新对象，确保没有残留属性。 */

//  配置 prop，不配置的执行此方法，该输入框值不会重置。

//弹窗相关--------------------------------------------------------
let mode = ref(0) //0 时新建模式，1 时是修改编辑模式
let uploadParam = ref<uploadImageParameter>({ //上传图片的模式
    imgCount: 1,
    moreLimitMode: 1,
    size: 10,
    fileList: []  //UploadUserFile类型
})
//表单ref属性
const addFormRef = ref<FormInstance>()

//点击新建，显示弹窗
let addBtn = () => {
    mode.value = 0
    dialog.width = 550
    dialog.visible = true
    addFormRef.value?.resetFields()//清空表单
    //清空上传信息
    uploadParam.value.fileList = []
}

let editBtn = (row: Topic) => {
    mode.value = 1
    dialog.width = 700
    dialog.title = '修改版区信息'
    dialog.visible = true
    nextTick(() => {
        // Object.assign(topic.value, row)
        OBJAssignExisting(topic.value,row)
    })
    addFormRef.value?.resetFields()//清空表单
    uploadParam.value.fileList = []
    //图片封装UploadUserFile
    let uploadedUserFile: UploadUserFile = {
        name: "",
        url: row.topicIcon
    }
    uploadParam.value.fileList.push(uploadedUserFile)

}
//点击提交
let commit = async () => {
    // 表单验证
    addFormRef.value?.validate(async (valid) => {
        if (valid) { //验证通过
            // console.log(addModel);
            let res = null
            if (uploadParam.value.fileList.length == 0) {
                topic.value.topicIcon = ''  //有了这一行则无法使用默认图标，除非增加服务器端检测
                console.log("没有选择任何图标,使用默认图标");
            }
            else topic.value.topicIcon = uploadParam.value.fileList[0].url
            if (mode.value == 0) {
                topic.value.topicId = ''    //uid自动生成，不需要填
                console.log(topic.value.topicIcon);
                res = await addTopicApi(topic.value);
            } else {
                res = await updateTopicApi(topic.value)
            }
            if (res && res.code == 200) {
                //信息提示
                ElMessage.success(res.msg)
                getTopicList()
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
            let res = await delTopicApi(id)
            if (res.code == 200) {
                ElMessage.success(res.msg)
                getTopicList()
            }
        }).catch(() => {
            ElMessage.info("删除已取消！")
        })
}

let box = ref(null)//用来挂载元素
let tableHeight = ref(0)
onMounted(() => {
    console.log(window.innerHeight);
    tableHeight.value = window.innerHeight - 60 - 20 * 2 - 32 - 20 * 2 - 50
    console.log(tableHeight.value);
    //表格高度 =  窗口高度 - (Layout el-heard) - (Layout el-main的padding) - (el-footer) -(el-main的padding) -(搜索表单)
    getTopicList()
})
// 合法性
let isOccupied = async (rule: any, value: any, callback: any) => {
    //value值就是输入的值
    if (mode.value === 1 && value === topic.value.topicName) {
        //如果现在是修改模式的话则需要检验的是修改后的值
        callback()
        return
    }
    //如果是第一次(mode==0)添加则需要直接验证
    let res = await isOccupiedTopicApi(value)
    if (res && res.code == 200 && res.data)
        callback(new Error("版区名已被占用啦~"))
    callback()
}
let rules = {
    topicName: [
        { required: true, message: '版区名称不能为空', trigger: 'blur' },
        { min: 1, max: 20, message: '名称长度在1到20个字符之间', trigger: 'blur' },
        { message: '版区名已被占用喵~', trigger: 'blur', validator: isOccupied }
    ],
    description: [
        { required: true, message: '版区描述不能为空', trigger: 'blur' },
        { max: 100, message: '描述内容不能超过100个字符', trigger: 'blur' }
    ]
}


//**------------------------以下是未使用或者是已被抛弃的函数----------------------------------------------
let fn = () => {
    console.log("测试 子组件是否有触发change事件");
}
// 修改验证规则部分
const validateIcon = (rule: any, value: any, callback: any) => {
    if (uploadParam.value.fileList.length === 0) {
        // 这里用通知代替错误提示，避免阻塞表单提交
        ElNotification({
            title: '提示',
            message: '版区图片为空，将使用默认图片',
            type: 'info',
            duration: 3000
        })
        // 设置默认图片URL 
        // board.value.icon = '/default-icon.png'
        //【20250314】数据库里面已经有默认图片
    }
    callback() // 始终通过验证
}
</script>
<style scoped>
.test {
    color: #686868;
}
</style>