<template>
    <div style="width: 100%;">
        <el-form :inline="true" size="default">
            <el-form-item>
                <el-input v-model.trim="searchName" placeholder="请输入..." :prefix-icon="Search"
                    :disabled="breadcrumbs.length > 1"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button icon="Search" @click="getAllBoardTree" :disabled="breadcrumbs.length > 1">搜索</el-button>
                <el-button icon="Close" type="danger" plain @click="resetBtn"
                    :disabled="breadcrumbs.length > 1">重置</el-button>
                <el-button type="primary" icon="Plus" @click="addBtn">新增</el-button>
            </el-form-item>
            <el-form-item>
                <div class="breadcrumb" v-if="breadcrumbs.length > 0">
                    <el-breadcrumb separator="›">
                        <el-breadcrumb-item v-for="(item, index) in breadcrumbs" :key="item.boardId"
                            @click="handleBreadcrumbClick(index)" style="cursor: pointer;">
                            {{ item.name }}
                        </el-breadcrumb-item>
                    </el-breadcrumb>
                </div>
            </el-form-item>
        </el-form>
        <!-- 所有版区展示 -->
        <el-row :gutter="10" v-if="breadcrumbs.length == 1">
            <el-col :span="4" v-for="(item) in currentBoardList">
                <div class="box" @click="handleBoardClick(item)">
                    <el-image class="boardIcon" :src="item.icon" :lazy="true" :preview-src-list="[item.icon]"
                        preview-teleported fit="cover"></el-image>
                    <div class="boardInfo">
                        <el-text line-clamp="1" size="large">{{ item.name }}</el-text>
                        <div class="postCount">帖子数：{{ item.postCount }}</div>
                    </div>
                </div>
            </el-col>
        </el-row>
        <!-- 单个版区展示  -->
        <div v-if="breadcrumbs.length > 1" class="detailBoard">
            <div class="superior">
                <div class="indexTag" v-if="breadcrumbs[breadcrumbs.length - 1].creatorId == null">官方</div>
                <el-image class="cover" :src="breadcrumbs[breadcrumbs.length - 1].icon" :lazy="true"
                    :preview-src-list="[breadcrumbs[breadcrumbs.length - 1].icon]" preview-teleported
                    fit="cover"></el-image>
                <el-divider direction="vertical" style="height: 120px;margin: 0 10px;" />
                <div class="info">
                    <h2>{{ breadcrumbs[breadcrumbs.length - 1].name }}</h2>
                    <el-text line-clamp="2" size="large">{{ breadcrumbs[breadcrumbs.length - 1].description }}</el-text>
                    <div>
                        <el-tooltip :content="'版区状态: ' + breadcrumbs[breadcrumbs.length - 1].status" placement="top" loading>
                            <el-switch class="mt-2"
                                style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
                                :inactive-icon="Close" inline-prompt :active-icon="Check" v-model="breadcrumbs[breadcrumbs.length - 1].status"
                                active-value="active" inactive-value="banned" @change="changeBoardStatus(breadcrumbs[breadcrumbs.length - 1])" />
                        </el-tooltip>
                        <span>&nbsp;&nbsp;&nbsp;</span>
                        <el-button icon="Edit" size="small"
                            @click="editBtn(breadcrumbs[breadcrumbs.length - 1])"></el-button>
                        <el-button icon="Delete" size="small" :disabled="breadcrumbs[breadcrumbs.length - 1].children?.length"
                            @click="delBoard(breadcrumbs[breadcrumbs.length - 1])"></el-button>
                    </div>
                </div>
            </div>
            <el-row :gutter="10">
                <el-col :span="4" v-for="(item) in currentBoardList">
                    <div class="box" @click="handleBoardClick(item)">
                        <el-image class="boardIcon" :src="item.icon" :lazy="true" :preview-src-list="[item.icon]"
                            preview-teleported fit="cover"></el-image>
                        <div class="boardInfo">
                            <el-text line-clamp="1" size="large">{{ item.name }}</el-text>
                        </div>
                    </div>
                </el-col>
            </el-row>
        </div>
    </div>
    <SysDialog :title="dialog.title" :dialogVisible="dialog.visible" @onClose="onClose" @onConfirm="commit"
        :width="dialog.width">
        <template #content>
            <!-- {{ board }} -->
            <!-- <div></div> -->
            <el-form :model="board" ref="addFormRef" :rules="rules" label-width="80px" :inline="true"
                label-position="right" style="padding: 10px 20px;">
                <el-form-item prop="name" label="版区名字">
                    <el-input v-model="board.name" style="width: 150px;" placeholder="喵喵喵"></el-input>
                </el-form-item>
                <el-form-item prop="sortOrder" label="排序">
                    <el-input-number v-model="board.sortOrder" :min="0" :max="10" style="width: 100px;" />
                </el-form-item>
                <el-form-item prop="description" label="版区描述" show-overflow-tooltip>
                    <el-input v-model="board.description" type="textarea" :rows="3" placeholder="描述一下吧喵q(≧▽≦q)~"
                        style="width:360px;"></el-input>
                </el-form-item>
                <el-form-item prop="icon" label="版区图标">
                    <UploadSingleImage :uploadParam="uploadParam" @change="">
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
<script lang="ts" setup>
import { addBoardApi, delBoardApi, getBoardTreeApi, getSerachBoardTreeApi, isOccupiedBoardApi, updateBoardApi } from '@/api/board'
import type { Board, changeBoardParam } from '@/api/board/BoardModel'
import { ref, onMounted, nextTick } from 'vue'
import UploadSingleImage from '@/components/UploadImage.vue'
import type { uploadImageParameter } from '@/api/img/uploadImageModel';
import SysDialog from '@/components/SysDialog.vue';
import useDialog from '@/hooks/useDialog';
import { ElMessage, type FormInstance, type UploadUserFile } from 'element-plus'
import { Calendar, Search, Check, Close } from '@element-plus/icons-vue'
import { OBJAssignExisting } from '@/utils/ObjectCopy'
const { dialog, onClose, onConfirm, onShow } = useDialog()//初始弹窗

const allBoardTree = ref<Board[]>([])  //审核过的版区
const currentBoardList = ref<Board[]>([])  // 当前展示的版区列表（初始为顶级版区）
const breadcrumbs = ref<Board[]>([])  // 面包屑导航路径
// 搜索
let searchName = ref<string>("")
// 获取所有审核通过的版区
let getAllBoardTree = async () => {
    // 清空数据
    allBoardTree.value = []
    breadcrumbs.value = []
    let res = await getSerachBoardTreeApi(searchName.value)
    if (res && res.code == 200) {
        allBoardTree.value = res.data
        currentBoardList.value = res.data
        let tempBoard = <Board>{
            name: "所有",
            children: allBoardTree.value
        }
        breadcrumbs.value.push(tempBoard)
    }
}

let resetBtn = () => {
    searchName.value = ''
    getAllBoardTree()
}
// 处理版区点击
const handleBoardClick = (board: Board) => {
    if (board.children?.length) {
        // 进入子版区
        currentBoardList.value = board.children
        breadcrumbs.value.push(board)
    } else { // 没有子版区时
        currentBoardList.value = []
        breadcrumbs.value.push(board)

    }
    console.log(breadcrumbs.value);
}

// 处理面包屑点击
const handleBreadcrumbClick = (index: number) => {
    // 截断路径
    breadcrumbs.value = breadcrumbs.value.slice(0, index + 1)
    // 获取对应层级的版区列表
    currentBoardList.value = index === 0
        ? allBoardTree.value
        : breadcrumbs.value[index].children || []
}

let board = ref<changeBoardParam>({ // 基本必传信息
    boardId: '',
    name: '',
    icon: '',
    description: '',
    sortOrder:10
})

let uploadParam = ref<uploadImageParameter>({ //上传图片的模式
    imgCount: 1,
    moreLimitMode: 1,
    size: 10,
    fileList: []  //UploadUserFile类型
})
let mode = ref(0) //0 时新建模式，1 时是修改编辑模式
const addFormRef = ref<FormInstance>()//表单ref属性

//点击新建，显示弹窗
let addBtn = () => {
    mode.value = 0
    dialog.width = 550
    dialog.visible = true
    dialog.title = "新增版区 至 [" + breadcrumbs.value[breadcrumbs.value.length - 1].name + "]"
    addFormRef.value?.resetFields()//清空表单
    //清空上传信息
    uploadParam.value.fileList = []
    board.value.boardId = ''
}
//编辑
let editBtn = (superior: Board) => {
    mode.value = 1
    dialog.width = 700
    dialog.title = '修改版区信息'
    dialog.visible = true
    nextTick(() => {
        // Object.assign(board.value, row)
        OBJAssignExisting(board.value, superior)
    })
    addFormRef.value?.resetFields()//清空表单
    uploadParam.value.fileList = []
    //图片封装UploadUserFile
    let uploadedUserFile: UploadUserFile = {
        name: "",
        url: superior.icon
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
            else board.value.icon = uploadParam.value.fileList[0].url!
            if (mode.value == 0) {
                board.value.boardId = ''
                board.value.parentId = breadcrumbs.value[breadcrumbs.value.length - 1].boardId
                res = await addBoardApi(board.value);
            } else {
                res = await updateBoardApi(board.value)
            }
            if (res && res.code == 200) {
                //信息提示
                ElMessage.success(res.msg)
                getAllBoardTree()
                // await updateBoardData(); // 替换原来的 getAllBoardTree()
                //关闭弹框
                dialog.visible = false;
            }
        } else {
            ElMessage.error("验证未通过！重新填写信息！！！")
        }
    });
}
// 直接删除版区
const delBoard=async(board:Board)=>{
    let res=await delBoardApi(board.boardId!)
    if (res && res.code == 200) {
        ElMessage.success("删除成功")
        getAllBoardTree()
    } else ElMessage.error("删除失败")
}

// 修改状态
const changeBoardStatus = async (board: Board) => {
    let res = await updateBoardApi(board)
    if (res && res.code == 200) {
        ElMessage.success("状态修改成功")
    } else ElMessage.error("状态修改失败")
}

// 合法性
let isOccupied = async (rule: any, value: any, callback: any) => {
    //value值就是输入的值
    if (mode.value === 1 && value === board.value.name) {
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


onMounted(() => {
    getAllBoardTree()
})

</script>
<style lang="scss" scoped>
.breadcrumb {
    background-color: white;
    margin-bottom: 10px;
    height: 100%;
    display: flex;
    align-items: center;
    padding: 2px;
}

.detailBoard {
    .superior {
        background-color: white;
        padding: 12px;
        border-radius: 15px;
        margin-bottom: 10px;
        display: flex;
        align-items: center;
        position: relative;
        overflow: hidden;

        .cover {
            width: 120px;
            height: 120px;
        }

        .indexTag {
            position: absolute;
            right: 0;
            top: 0;
            padding: 0 12px;
            border-radius: 0 0 0 4px;
            font-size: 14px;
            background-color: rgb(220, 220, 220);
        }
    }
}


.box {
    // border: rgb(198, 198, 198) 1px solid;
    margin-bottom: 10px;
    display: flex;
    padding: 6px;
    background-color: white;
    border-radius: 10px;

    .boardIcon {
        width: 65px;
        height: 65px;
        flex-shrink: 0;
        // 避免挤压图片
    }

    .boardInfo {
        margin-left: 6px;

        .postCount {
            font-size: 14px;
        }
    }
}
</style>