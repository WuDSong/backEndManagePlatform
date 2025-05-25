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
                <el-table-column prop="boardId" label="BoardID" width="120" align="center" sortable></el-table-column>
                <el-table-column prop="name" label="版区" align="center"></el-table-column>
                <el-table-column prop="icon" label="图标" width="75">
                    <template #default="scope">
                        <!-- <div style="color: #686868">{{ scope.row.icon }}</div> -->
                        <el-image :src="scope.row.icon" :lazy="true" :preview-src-list="[scope.row.icon]" preview-teleported > </el-image>
                    </template>
                </el-table-column>
                <el-table-column prop="description" label="描述" min-width="200"></el-table-column>
                <el-table-column prop="status" label="状态" width="100" align="center">
                    <template #default="scope">
                        <el-tag type="warning" effect="plain">等待审核</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center" min-width="200">
                    <template #default="scope">
                        <el-button type="primary" icon="Edit" size="default" @click="resolvedBoardStatus(scope.row)">通过</el-button>
                        <el-button type="danger" icon="Delete" size="default"
                            @click="deleteBtn(scope.row.boardId)">驳回</el-button>
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
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import SysDialog from '@/components/SysDialog.vue';
import useDialog from '@/hooks/useDialog';
import { ElMessage, ElMessageBox, ElNotification, type FormInstance, type UploadUserFile } from 'element-plus';
import { nextTick } from 'vue';
import { Calendar, Search } from '@element-plus/icons-vue'
import { getBoardListApi, addBoardApi, updateBoardApi, delBoardApi, isOccupiedBoardApi, getPendingBoardListApi, resolvedBoardApi } from "@/api/board/index"
import { type Board, type BoardParam } from "@/api/board/BoardModel"
import UploadSingleImage from '@/components/UploadImage.vue'
import type { uploadImageParameter } from '@/api/img/uploadImageModel';
import { icons } from '@element-plus/icons-vue/global';
import { OBJAssignExisting } from '@/utils/ObjectCopy';
const { dialog, onClose, onConfirm, onShow } = useDialog()//初始弹窗
//搜索参数同时也是页面参数
const searchParam = ref<BoardParam>({
    name: "",
    pageSize: 7,
    curPage: 1,
    total: 10
})
let tableList = ref([])//表格数据
let getPendingBoardList = async () => {
    let res = await getPendingBoardListApi(searchParam.value)
    if (res && res.code == 200) {
        tableList.value = res.data.records
        searchParam.value.total = res.data.total;
    }
}
//搜索相关
let searchBtn = () => { getPendingBoardList() }
let resetBtn = () => {
    searchParam.value.name = ""
    getPendingBoardList()
}
//页面变动相关
let curChange = () => {
    console.log("当前页面：" + searchParam.value.curPage);
    getPendingBoardList()
}
let sizeChange = () => {
    console.log("当前页大小：" + searchParam.value.pageSize);
    getPendingBoardList()
}
//修改对象
let board = ref<Board>({//数据
    boardId:'',
    name: '',
    icon: '',
    description: '',
    sortOrder: 0
})

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
    board.value.boardId=''
}

let editBtn = (row: Board) => {
    mode.value = 1
    dialog.width = 700
    dialog.title = '修改版区信息'
    dialog.visible = true
    nextTick(() => {
        // Object.assign(board.value, row)
        OBJAssignExisting(board.value, row)
    })
    addFormRef.value?.resetFields()//清空表单
    uploadParam.value.fileList = []
    //图片封装UploadUserFile
    let uploadedUserFile: UploadUserFile = {
        name: "",
        url: row.icon
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
            if (uploadParam.value.fileList.length == 0)
                board.value.icon = ''
            else board.value.icon = uploadParam.value.fileList[0].url
            if (mode.value == 0) {
                board.value.boardId=''
                res = await addBoardApi(board.value);
            } else {
                res = await updateBoardApi(board.value)
            }
            if (res && res.code == 200) {
                //信息提示
                ElMessage.success(res.msg)
                getPendingBoardList()
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
            let res = await delBoardApi(id)
            if (res.code == 200) {
                ElMessage.success(res.msg)
                getPendingBoardList()
            }
        }).catch(() => {
            ElMessage.info("删除已取消！")
        })
}

const resolvedBoardStatus = async (board: Board) => {
    let res = await resolvedBoardApi(board)
    if (res && res.code == 200) {
        ElMessage.success("审核通过成功，请到版区管理启用")
        getPendingBoardList()
    } else ElMessage.error("请求失败")

}

let box = ref(null)//用来挂载元素
let tableHeight = ref(0)
onMounted(() => {
    console.log(window.innerHeight);
    tableHeight.value = window.innerHeight - 60 - 20 * 2 - 32 - 20 * 2 - 50
    console.log(tableHeight.value);
    //表格高度 =  窗口高度 - (Layout el-heard) - (Layout el-main的padding) - (el-footer) -(el-main的padding) -(搜索表单)
    getPendingBoardList()
})
// 合法性
let isOccupied = async (rule: any, value: any, callback: any) => {
    //value值就是输入的值
    if (mode.value === 1&&value===board.value.name) {
        //如果现在是修改模式的话则需要检验的是修改后的值
        callback()
        return
    }
    //如果是第一次(mode==0)添加则需要直接验证
    let res = await isOccupiedBoardApi(value)
    if (res && res.code == 200 && res.data)
        callback(new Error("版区名已被占用啦~"))
    callback()
}
let rules = {
    name: [
        { required: true, message: '版区名称不能为空', trigger: 'blur' },
        { min: 1, max: 20, message: '名称长度在1到20个字符之间', trigger: 'blur' },
        { message: '版区名已被占用喵~', trigger: 'blur', validator: isOccupied }
    ],
    sortOrder: [
        {
            type: 'number',
            required: true,
            message: '排序值不能为空',
            trigger: 'blur'
        },
        {
            type: 'number',
            min: 0,
            max: 10,
            message: '排序值需在0-10之间',
            trigger: ['blur', 'change']
        }
    ],
    description: [
        { required: true, message: '版区描述不能为空', trigger: 'blur' },
        { max: 100, message: '描述内容不能超过100个字符', trigger: 'blur' }
    ]
}
</script>
<style scoped>
.test {
    color: #686868;
}
</style>