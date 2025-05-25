import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

class WebSocketService {
    private stompClient: Stomp.Client | null = null;

    constructor() { }

    public connect(): Promise<void> {
        const socket = new SockJS('http://localhost:12345/websocket-endpoint');
        this.stompClient = Stomp.over(socket);
        // 兼容处理 global
        if (typeof global === 'undefined') {
            (window as any).global = window;
        }
        return new Promise((resolve, reject) => {
            this.stompClient!.connect({}, (frame) => {
                console.log('Connected: ' + frame);
                resolve();
            }, (error) => {
                console.error('Connection error: ' + error);
                reject(error);
            });
        });
    }

    public lockPost(postId: number): Promise<any> {
        return new Promise((resolve, reject) => {
            if (this.stompClient) {
                this.stompClient.send('/app/lockPost', {}, JSON.stringify(postId));
                this.stompClient.subscribe('/topic/postUpdates', (message) => {
                    console.log('锁定'+message);
                    const res = JSON.parse(message.body);
                    console.log(res);
                    if (res && res.code==200&& res.data.postId === postId) {
                        resolve(res.data);
                    }else reject(res.msg)
                });
            } else {
                reject(new Error('WebSocket client is not initialized'));
            }
        });
    }

    public approvePost(postId: number): Promise<any> {
        return new Promise((resolve, reject) => {
            if (this.stompClient) {
                this.stompClient.send('/app/approvePost', {}, JSON.stringify(postId));
                this.stompClient.subscribe('/topic/postUpdates', (message) => {
                    console.log(message);
                    const res = JSON.parse(message.body);
                    console.log('通过'+res);
                    if (res && res.code==200&& res.data.postId === postId) {
                        resolve(res.data);
                    }
                });
            } else {
                reject(new Error('WebSocket client is not initialized'));
            }
        });
    }

    public rejectPost(postId: number): Promise<any> {
        return new Promise((resolve, reject) => {
            if (this.stompClient) {
                this.stompClient.send('/app/rejectPost', {}, JSON.stringify(postId));
                this.stompClient.subscribe('/topic/postUpdates', (message) => {
                    console.log('拒绝'+message);
                    const res = JSON.parse(message.body);
                    console.log(res);
                    if (res && res.code==200&& res.data.postId === postId) {
                        resolve(res.data);
                    }
                });
            } else {
                reject(new Error('WebSocket client is not initialized'));
            }
        });
    }

    public unlockPost(postId: number): Promise<any> {
        return new Promise((resolve, reject) => {
            if (this.stompClient) {
                this.stompClient.send('/app/unlockPost', {}, JSON.stringify(postId));
                this.stompClient.subscribe('/topic/postUpdates', (message) => {
                    console.log('解锁'+message);
                    const res = JSON.parse(message.body);
                    console.log(res);
                    if (res && res.code==200&& res.data.postId === postId) {
                        resolve(res.data);
                    }
                });
            } else {
                reject(new Error('WebSocket client is not initialized'));
            }
        });
    }
}

export default new WebSocketService();