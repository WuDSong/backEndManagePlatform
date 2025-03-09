//使用我定义的图片上传组件 要传的对象类型
import type { UploadFile } from 'element-plus';

export type uploadImageParameter = {
    imgCount: number; // 图片数量
    fileList?: UploadFile[]; // 文件列表，每个元素是 UploadFile 类型
    moreLimitMode:number// 0默认不处理;  1直接全删，重传 ; 2替换最后一个
}