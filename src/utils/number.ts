//数字转string
export function formatNumber(num: number): string {
    if (num < 1000) {
        return num.toString();
    } else if (num < 10000) {
        // 处理 1000~9999 范围，保留2位有效小数
        const formatted = (num / 1000).toFixed(2);
        return formatted.replace(/\.?0+$/, '') + 'K'; // 去除末尾的零和小数点
    } else {
        // 处理 10000+ 范围
        const formatted = (num / 10000).toFixed(2);
        return formatted.replace(/\.?0+$/, '') + 'W'; // 去除末尾的零和小数点
    }
}