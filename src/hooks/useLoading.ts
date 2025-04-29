// 组合式函数 useLoading.ts
import { ElLoading, type LoadingOptions } from 'element-plus'

export const useLoading = (options?: LoadingOptions) => {
    let loadingInstance: ReturnType<typeof ElLoading.service>

    const startLoading = () => {
        loadingInstance = ElLoading.service({
            lock: true,
            text: '数据提交中...',
            background: 'rgba(255, 255, 255, 0.5)',
            spinner: 'el-icon-loading', // 自定义加载图标
            ...options
        })
    }

    const stopLoading = () => {
        loadingInstance?.close()
    }

    return { startLoading, stopLoading }
}