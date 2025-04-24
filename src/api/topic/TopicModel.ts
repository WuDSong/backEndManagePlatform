//board 添加
export type Topic = { 
    topicId?: string,  
    topicName: string,
    topicIcon?: string,
    topicDescription?: string,
}

//board查找
export type TopicParam={
    name: string,
    curPage:Number,
    pageSize:Number,
    total?:number
}