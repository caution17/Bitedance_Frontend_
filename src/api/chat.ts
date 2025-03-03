import { llmClient, handleError } from './client';

interface ChatParams {
  model: string;
  messages: Array<{
    role: 'user' | 'assistant';
    content: string;
  }>;
  stream?: boolean;
  temperature?: number;
  meta?: {
    user_info?: string;
    bot_info?: string;
  };
}

  // 在client.ts添加调试输出
console.log('API端点:', process.env.REACT_APP_API_BASE_URL);
console.log('请求头:', llmClient.defaults.headers);

// chat.ts 修改
export const chat = {
    stream: async (message: string, onChunk: (chunk: string) => void) => { // 新增回调函数
      const params: ChatParams = {
          model: 'glm-4',
          messages: [{role: 'user', content: message}], // ███ 必须包含用户消息
          stream: true
      };
      
      try {
        const response = await llmClient.post('/chat/completions', params, { // ███ 修正路径错误（baseURL已包含）
          responseType: 'stream'
        });
  
        const stream = response.data;
        const decoder = new TextDecoder();
        let buffer = '';

        // ███ 简单流式处理（按字符分割）
        for await (const chunk of stream) {
            buffer += decoder.decode(chunk, { stream: true });
                
                // 按SSE规范分割事件
             const events = buffer.split('\n\n');
             buffer = events.pop() || ''; // 保留未完成部分
                
                for (const event of events) {
                    const line = event.trim();
                    if (!line.startsWith('data:')) continue;
                    
                    try {
                        const data = JSON.parse(line.slice(5).trim());
                        if (data.event === 'add' && data.content) {
                            onChunk(data.content);
                        }
                    } catch (e) {
                        console.error('解析异常:', e, '原始数据:', line);
                    }
                }
            }
          }
        catch (error) {
        throw handleError(error); // ███ 必须重新抛出错误
      }
    }
  };
  


// 在client.ts添加验证输出
console.log('当前环境模式:', process.env.NODE_ENV);
console.log('API端点:', process.env.REACT_APP_API_BASE_URL);
console.log('密钥长度:', process.env.REACT_APP_LLM_API_KEY?.length);