<template>
    <el-upload :action="'http://localhost:12345/api/upload/uploadImage'" list-type="picture-card" :auto-upload="false"
        v-model:file-list="uploadParam.fileList" ref="uploadRef" :limit="uploadParam.imgCount" :on-change="handleChange"
        :on-exceed="handleExceed" :before-upload="beforeImgUpload" >
        <!-- :on-change="uploadFile" on-change文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用 -->
        <el-icon>
            <Plus />
        </el-icon>
        <template #file="{ file }">
            <div>
                <!-- <span>{{ file.percentage }}</span> -->
                <el-image ref="imageRef" :src="file.url" fit="contain" :lazy="true"
                    :preview-src-list="previewSrcList" style="width: 100%;
                    height: 100%;"></el-image>
                
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
        <template #tip>
            <div class="el-upload__tip">Image files with a size less than {{ props.uploadParam.size }}MB. </div>
            <div class="el-upload__tip">You can have up to {{ props.uploadParam.imgCount }} images. </div>
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
    <!-- <el-button @click="handleClick">show image preview</el-button> -->
    <!-- <div>文件列表：{{ fileList }}</div> -->
    <!-- <div>{{ uploadParam }}</div> -->
</template>

<script lang="ts" setup>
import SysDialog from '@/components/SysDialog.vue';
import useDialog from '@/hooks/useDialog';
const { dialog, onClose, onConfirm, onShow } = useDialog()//初始弹窗
import { ref, onMounted, reactive, type PropType } from 'vue'
import { Delete, Download, Plus, ZoomIn } from '@element-plus/icons-vue'
import { ElMessage, genFileId, type UploadFile, type UploadInstance, type UploadProps, type UploadRawFile } from 'element-plus'
import type { ImageInstance, UploadUserFile } from 'element-plus'
import { uploadImageApi } from '@/api/img';
import { type uploadImageParameter } from '@/api/img/uploadImageModel';
//父组件数据
let props = defineProps({
    uploadParam: {
        type: Object as PropType<uploadImageParameter>, // 关键修改
        required: true
    }
})
//定义事件
const emit = defineEmits(["refresh"])


const dialogImageUrl = ref('')
// const dialogVisible = ref(false)
// const disabled = ref(false)
const disabled = ref(false) //是否允许下载，删除
const uploadRef = ref<UploadInstance>()//上传组件
// const fileList = ref<UploadUserFile[]>([]) //用的是UploadUserFile,展示用户上传成功的结果

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

    //------使用element-plus 的el-image 自带预览所以不需要自己写弹窗
    //不共享
    previewSrcList.value.pop()
    previewSrcList.value.push(dialogImageUrl.value)
    //todo 共享
    // console.log('预览图片:'+dialogImageUrl.value);
    // previewSrcList.value.push(dialogImageUrl.value)
    imageRef.value!.showPreview()
}

// 下载
const handleDownload = async (file: UploadFile) => {
    try {
        console.log('下载');
        console.log(file);
        const url = new URL(file.url!);
        const filename = url.pathname.split('/').pop() || 'download.jpg';

        // 使用 fetch 获取图片的 Blob 对象
        const response = await fetch(file.url!);
        const blob = await response.blob();

        // 创建临时 URL
        const objectUrl = URL.createObjectURL(blob);

        // 创建 a 标签
        const a = document.createElement('a');
        a.href = objectUrl;
        a.download = filename;
        a.click();

        // 释放临时 URL
        URL.revokeObjectURL(objectUrl);
    } catch (error) {
        console.error('下载失败:', error);
        ElMessage.error('下载失败，请稍后重试');
    }
}

// 删除
const handleRemove = (file: UploadFile) => {
    console.log(file)
    // uploadParam
    // fileList.value.map((item, index) => {
    //     if (item.uid && item.uid === file.uid)
    //         fileList.value.splice(index, 1)
    // })
    props.uploadParam.fileList.map((item, index) => {
        if (item.uid && item.uid === file.uid)
            props.uploadParam.fileList.splice(index, 1)
    })
    ElMessage.success("删除成功")
}

// 超出上传图片的数量
const handleExceed: UploadProps['onExceed'] = async (files) => {
    //mode 0默认不处理;  1直接全删，重传; 2替换最后一个
    ElMessage.error("只能上传" + props.uploadParam.imgCount + "张图片")
    if (props.uploadParam.moreLimitMode === 0) return
    else if (props.uploadParam.moreLimitMode === 1) {
        uploadRef.value!.clearFiles()
        const file = files[0] as UploadRawFile
        file.uid = genFileId()
        uploadRef.value!.handleStart(file)
    }
    else if (props.uploadParam.moreLimitMode === 2) {
        // 将之前上传的最后一个文件替换
        const newFile = files[0] as UploadRawFile
        // newFile.uid = genFileId()
        // // 创建新文件项
        // const newUserFileItem: UploadUserFile = {
        //     uid: newFile.uid,
        //     name: newFile.name,
        //     status: 'ready',
        //     raw: newFile
        // }
        props.uploadParam.fileList.pop()
        // props.uploadParam.fileList.push(newUserFileItem)

        // 20250310新创建的 UploadUserFile 对象的状态可能没有正确设置，或者 el-upload 组件对状态的处理存在问题，导致无法正确上传新文件。
        // 采用手动方式
        // 清空组件的文件列表
        // uploadRef.value!.clearFiles()

        // 20250310重新添加新的文件列表,不可以用handleStart，handleStart会将所有status设置ready,导致之前的要重新上传
        // props.uploadParam.fileList.forEach(file => {
        //     uploadRef.value!.handleStart(file.raw!) 
        // })

        uploadRef.value!.handleStart(newFile)
        uploadRef.value!.submit()
        ElMessage.info("最后一张被替换")
    }
}

let beforeImgUpload: UploadProps['beforeUpload'] = (rawFile) => {

}


// 上传
const handleChange: UploadProps['onChange'] = async (file, uploadFiles) => {
    // console.dir(uploadFiles);
    // console.log("上传前的file和fileList");
    // console.log(file);
    // console.log(fileList)
    //检查图片
    const typeArr = ["image/png", "image/gif", "image/jpeg", "image/jpg"];
    const isImg = typeArr.indexOf(file.raw!.type) !== -1
    const isMore = (file.raw!.size) / 1024 / 1024 < props.uploadParam.size
    if (!isImg) {
        ElMessage.warning("只能上传图片类型!")
        // uploadRef.value?.clearFiles() 
        file.status = 'fail'
    }
    if (!isMore) {
        ElMessage.warning("图片大小不能超过10M!")
        // uploadRef.value?.clearFiles()
        file.status = 'fail'
    }
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
                file.url = "http://localhost:12345" + res.data
                ElMessage.success('图片上传成功')
                emit('refresh', props.uploadParam.fileList)
                // console.log("现在上传后的file和fileList")
                // console.log(file)
                // console.log(fileList)

                // 修改file会影响到fileList,但是...为什么页面显示刚刚上传的url还是本地url?

                // 20250310
                // 注意：fileList 是 UploadUserFile类型 ，而file: UploadFile ,
                // 可能导致响应式更新出现问题，从而使得 fileList 里的文件 url 没有及时更新。
                // 尽管 file 和 fileList 中的对应元素在内存里指向同一个对象，但因为类型不同，Vue 的响应式系统也许无法正确追踪到变化

                // 手动更新 fileList 中的对应元素
                // const index = fileList.value.findIndex(item => item.uid === file.uid);
                // if (index!== -1) {
                //     fileList.value[index].url = file.url;
                // }

                //作用域问题?
                // let index=fileList.value.findIndex(item => item.uid === file.uid)
                // if(index!=-1)
                //     fileList.value[index].url=file.url

            } else {
                file.status = 'fail'
                ElMessage.error('图片上传失败');
            }
        } catch (error) {
            file.status = 'fail'
            ElMessage.error('图片上传出错，请稍后重试');
        } finally {
            delFailedFiles()
            // console.log('list 相关文件');
            // console.log(fileList)
        }
    }
    delFailedFiles()
}

const checkSuccessFiles = () => {
    // fileList.value.map((item) => {
    //     if (item.status && item.status === 'success')
    //         console.log(item.name + "上传成功");
    // })
}
// 删除上传失败的文件
const delFailedFiles = () => {
    // fileList.value.map((item, index) => {
    //     if (item.status && item.status === 'fail')
    //         fileList.value.splice(index, 1)
    // })
    // console.log('删除上传失败的文件')
    // console.log(fileList);  
    props.uploadParam.fileList.map((item, index) => {
        if (item.status && item.status === 'fail')
            props.uploadParam.fileList.splice(index, 1)
    })
}

const handleClick = () => { //预览测试事件
    // imageRef.value!.showPreview()
    console.log('组件内部文件列表:', uploadRef.value)
    console.log(props.uploadParam.fileList)
}
const uploadProgress = ref(0)
</script>