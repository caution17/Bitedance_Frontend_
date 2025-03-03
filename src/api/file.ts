import { llmClient, handleError } from './client';

export const file = {
  upload: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await llmClient.post('/file/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error: any) {
      handleError(error); // 使用通用错误处理函数
    }
  }
};