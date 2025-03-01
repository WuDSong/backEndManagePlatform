import { reactive } from "vue";
//定义弹窗相关的参数和函数
export default function useDialog() {
    //弹框属性
    const dialog = reactive({
        title: "新增",
        visible: false,
        width: 500,
        height:0
    });
    //弹框关闭
    const onClose = () => {
        dialog.visible = false
    };
    //弹框确定
    const onConfirm = () => {
        dialog.visible = false
    };
    //弹框显示
    const onShow = () => {
        dialog.visible = true;
    }
    return {
        dialog,
        onClose,
        onConfirm,
        onShow
    }
}