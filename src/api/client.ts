import axios from 'axios';

// 环境变量验证（开发环境调试）
if (process.env.NODE_ENV === 'development') {
  console.assert(
    process.env.REACT_APP_LLM_API_KEY,
    'REACT_APP_LLM_API_KEY未定义,请检查:',
    {
      envKeys: Object.keys(process.env)
        .filter(key => key.startsWith('REACT_APP'))
        .map(key => `${key}: ${process.env[key]?.length ? 'defined' : 'undefined'}`)
    }
  );
}

if (!process.env.REACT_APP_LLM_API_KEY) {
  throw new Error('API 密钥未定义，请检查：\n1. .env文件存在性\n2. 变量前缀正确性\n3. 服务重启情况');
}

// 创建axios实例
const llmClient = axios.create({
  baseURL: 'https://open.bigmodel.cn/api/paas/v4/',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.REACT_APP_LLM_API_KEY}`,
    // 新增必要请求头
    'Accept': 'text/event-stream',
    'Cache-Control': 'no-cache'
  }
});


// client.ts 增强错误处理
const handleError = (error: any) => {
  let message = '未知错误';
  if (error.response) {
    const { status, data } = error.response;
    message = data.error?.message || `服务器错误 (${status})`;
    
    switch (status) {
      case 400: message = '请求参数错误'; break;
      case 401: message = 'API密钥无效或过期'; break;
      case 403: message = '权限不足'; break;
      case 429: message = '请求限速，请稍后重试'; break;
      case 500: message = '服务器内部错误'; break;
    }
  } else if (error.code === 'ECONNABORTED') {
    message = '请求超时';
  } else if (error.request) {
    message = '网络连接异常，请检查网络';
  }
  return new Error(`API请求失败: ${message}`);
};

// 导出 axios 实例和错误处理函数
export { llmClient, handleError };