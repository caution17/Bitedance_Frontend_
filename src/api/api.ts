// src/constants/api.ts
export const API_CONFIG = {
    // Tokenizer接口（用于计算token）
    TOKENIZER: {
      PATH: '/tokenizer',
      METHOD: 'POST',
      MODELS: [
        'glm-4-plus', 
        'glm-4-long',
        'glm-4-0520',
        'glm-4-air',
        'glm-4-flash'
      ]
    },
    
    // Chat接口（用于实际对话）
    CHAT: {
      PATH: '/chat/completions',
      METHOD: 'POST',
      MODELS: [
        'glm-4',  // 根据实际文档补充
        'glm-4-plus'
      ]
    }
  };