import React, { useRef, useEffect } from 'react';
import { Box, Paper, Typography, CircularProgress } from '@mui/material';
import Markdown from 'react-markdown';

interface Message {
  id: number;
  text: string;
  isBot: boolean;
  timestamp?: Date;
}

interface MessageListProps {
  messages: Message[];
  isLoading?: boolean;
}

const MessageList: React.FC<MessageListProps> = ({ messages, isLoading }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages]); // 监听 messages 数组的变化

  return (
    <Paper elevation={3} sx={{ height: '60vh', overflowY: 'auto', p: 2, borderRadius: 2 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {messages.map((message) => (
          <Box
            key={message.id}
            sx={{
              alignSelf: message.isBot ? 'flex-start' : 'flex-end',
              maxWidth: '70%',
              bgcolor: message.isBot ? '#f5f5f5' : '#e3f2fd',
              p: 2,
              borderRadius: 2,
              boxShadow: 1,
            }}
          >
            <Markdown
              components={{
                code({ children, ...props }) {
                  return (
                    <code
                      style={{
                        background: '#333',
                        color: 'white',
                        padding: '2px 4px',
                        borderRadius: '4px',
                        fontFamily: 'monospace',
                      }}
                      {...props}
                    >
                      {children}
                    </code>
                  );
                }
              }}
            >
              {message.text}
            </Markdown>
            {message.timestamp && (
              <Typography variant="caption" sx={{ display: 'block', mt: 1, color: 'text.secondary', textAlign: 'right' }}>
                {message.timestamp.toLocaleTimeString()}
              </Typography>
            )}
          </Box>
        ))}
        <div ref={messagesEndRef} />
        {isLoading && (
          <CircularProgress size={24} />
        )}
        {messages.length === 0 && !isLoading && (
          <Typography 
            variant="body1"
            sx={{ textAlign: 'center', color: 'text.secondary', mt: 4 }}
          >
            暂无消息，开始对话吧！
          </Typography>
        )}
      </Box>
    </Paper>
  );
};

export default MessageList;