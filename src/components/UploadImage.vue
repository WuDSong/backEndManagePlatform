<template>
    <el-upload :action="'http://localhost:12345/api/upload/uploadImage'" list-type="picture-card" :auto-upload="false"
        v-model:file-list="fileList" ref="uploadRef"  :limit="2" 
        :on-change="handleChange" :on-exceed="handleExceed">
        <!-- :on-change="uploadFile" on-change文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用 -->
        <el-icon>
            <Plus />
        </el-icon>
        <template #file="{ file }">
            <div>
                <el-image ref="imageRef" :src="file.url" fit="fill" :lazy="true"
                    :preview-src-list="previewSrcList"></el-image>
                <span class="el-upload-list__item-actions">
                    <span class="el-upload-list__item-preview" @click="handlePictureCardPreview(file)">
                        <el-icon><zoom-in /></el-icon>
                    </span>
                    <span v-if="!disabled" class="el-upload-list__item-delete" @click="handleDownload(file)">
                        <el-icon>
                            <Download />
                        </el-icon>
                    </span>
                    <span v-if="!disabled" class="el-upload-list__item-delete" @click="handleRemove(file)">
                        <el-icon>
                            <Delete />
                        </el-icon>
                    </span>
                </span>
            </div>
        </template>
    </el-upload>
    <!-- <SysDialog :title="dialog.title" :dialogVisible="dialog.visible" :width="dialog.width" @onClose="onClose" @onConfirm="onConfirm">
        <template #content>
            123
        </template>
    </SysDialog> -->
    <!-- <el-image ref="imageRef" style="width: 100px;
    height: 100px;" :src="dialogImageUrl" fit="cover"
        :preview-src-list="previewSrcList" /> -->
    <el-button @click="handleClick">show image preview</el-button>
    <div>文件列表：{{ fileList }}</div>
    <h2>原文件</h2>
    <div v-for="item in fileList">
        {{ item.raw?.name }}
    </div>
</template>

<script lang="ts" setup>
import SysDialog from '@/components/SysDialog.vue';
import useDialog from '@/hooks/useDialog';
const { dialog, onClose, onConfirm, onShow } = useDialog()//初始弹窗
import { ref, onMounted, reactive } from 'vue'
import { Delete, Download, Plus, ZoomIn } from '@element-plus/icons-vue'
import { ElMessage, genFileId, type UploadFile, type UploadInstance, type UploadProps, type UploadRawFile } from 'element-plus'
import type { ImageInstance, UploadUserFile } from 'element-plus'
import { uploadImageApi } from '@/api/img';

const dialogImageUrl = ref('')
// const dialogVisible = ref(false)
// const disabled = ref(false)
const disabled = ref(false) //是否允许下载，删除
const uploadRef = ref<UploadInstance>()//上传组件
const fileList = ref<UploadUserFile[]>([]) //用的是UploadUserFile,展示用户上传成功的结果
//预览
let previewSrcList = ref<string[]>([]) //el-image的预览列表
const imageRef = ref<ImageInstance>()
const handlePictureCardPreview = (file: UploadFile) => {
    dialogImageUrl.value = file.url! //非空断言操作符（`!`）用于告诉编译器某个变量不会是null或undefined
    // dialogVisible.value = true
    // console.log(dialogImageUrl.value);
    // dialog.title = '预览'   
    // dialog.width = 800
    // dialog.visible = true

    //使用element-plus 的el-image 自带预览所以不需要自己写弹窗
    //不共享
    previewSrcList.value.pop()
    previewSrcList.value.push(dialogImageUrl.value)
    //todo 共享
    // console.log('预览图片:'+dialogImageUrl.value);
    // previewSrcList.value.push(dialogImageUrl.value)
    imageRef.value!.showPreview()
}

const handleClick = () => { //预览测试事件
    // imageRef.value!.showPreview()
    console.log('组件内部文件列表:', uploadRef.value);
}
//下载
const handleDownload = (file: UploadFile) => {
    console.log(file)
}
//删除
const handleRemove = (file: UploadFile) => {
    console.log(file)
    fileList.value.map((item,index)=>{
        if(item.uid&&item.uid===file.uid)
            fileList.value.splice(index,1)
    })
}
//超出，清除所有图片
const handleExceed: UploadProps['onExceed'] = (files) => {
    uploadRef.value!.clearFiles()
    const file = files[0] as UploadRawFile
    file.uid = genFileId()
    uploadRef.value!.handleStart(file)
}
//上传
const handleChange: UploadProps['onChange'] = async (file: UploadFile, fileList: UploadFile[]) => {
    // console.log("上传前的file和fileList");
    // console.log(file);
    // console.log(fileList)
    if (file.status === 'ready') {
        try {
            // 创建表单数据对象，组装上传的数据
            const formData = new FormData()
            formData.append('file', file.raw as File)
            file.status = 'uploading'
            let res = await uploadImageApi(formData)
            if (res && res.code == 200 && res.data) {
                file.status = 'success'
                // console.log("上传图片结果：");
                // console.log(res)
                file.url = "http://localhost:12345"+res.data
                ElMessage.success('文件上传成功')
                // console.log("现在上传后的file和fileList")
                // console.log(file);
                // console.log(fileList);
                //修改file会影响到fileList
            } else {
                file.status = 'fail'
                ElMessage.error('文件上传失败');
            }
        } catch (error) {
            file.status = 'fail'
            console.error('文件上传出错:', error);
            ElMessage.error('文件上传出错，请稍后重试');
        }finally{
            checkFailedFiles()
        }
    }
};
const checkSuccessFiles=()=>{
    fileList.value.map((item)=>{
        if(item.status&&item.status==='success')
            console.log(item.name+"上传成功");
    })
}
//删除上传失败的文件
const checkFailedFiles = ()=>{
    fileList.value.map((item,index)=>{
        if(item.status&&item.status==='fail')
            fileList.value.splice(index,1)
    })
}

</script>