// src/types.ts
export interface Message {
    id: number;       // 消息唯一标识
    text: string;     // 消息文本内容
    isBot: boolean;   // 是否为AI回复
    timestamp?: Date; // 可选时间戳
  }