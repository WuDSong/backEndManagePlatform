<template>
    <!--             是否显示弹窗                              弹窗宽度              通过窗口右上角的关闭       点击空白处关闭弹窗  -->
    <el-dialog :model-value="dialogVisible" :title="title" :width="width + 'px'" :before-close="handleClose"
        :close-on-click-modal="false">
        <!-- <div>传入参数：{{ props }}</div> -->
        <!-- <div class="container" :style="{ height: height + 'px' }">
            <slot name="content"></slot>
        </div> -->
        <slot name="content"></slot>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="onClose">Cancel</el-button>
                <el-button type="primary" @click="onConfirm">Confirm</el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script lang="ts" setup>
import { ref, defineProps, defineEmits } from 'vue'
import { ElMessageBox } from 'element-plus'
//父组件传值,只读
let props = defineProps({
    title: {
        type: String,
        default: "弹框标题"
    },
    dialogVisible: {//是否显示弹窗
        type: Boolean,
        require: true,
        default: "false"
    },
    width: {
        type: Number,
        default: 500
    },
    height: Number
})

//定义emit，定义组件发出的事件。
const emit = defineEmits(["onClose", "onConfirm"])
const onClose = () => {
    emit("onClose")
}
const onConfirm = () => {
    emit("onConfirm")
}

const handleClose = (done: () => void) => {
    ElMessageBox.confirm('Are you sure to close this dialog?')
        .then(() => {
            emit("onClose")
            done()
        })
        .catch(() => {
            // catch error
        })
}


//*********基本用法 */
// <SysDialog :title="dialog.title" :dialogVisible="dialog.visible" @onClose="onClose" @onConfirm="onConfirm"></SysDialog>
//js:
// import SysDialog from '@/components/SysDialog.vue';
// import useDialog from '@/hooks/useDialog';
// const { dialog, onClose, onConfirm, onShow } = useDialog()
</script>

