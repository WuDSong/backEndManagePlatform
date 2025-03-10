//使用我定义的图片上传组件 要传的对象类型
import type { UploadFile, UploadUserFile } from 'element-plus';

export type uploadImageParameter = {
    imgCount: number; // 上传图片数量
    moreLimitMode:number// 超出处理。 0默认不处理;  1直接全删，重传 ; 2替换最后一个
    size:number // 图片的大小，单位MB
    fileList: UploadUserFile[] // 文件列表，每个元素是 UploadUserFile 类型
}