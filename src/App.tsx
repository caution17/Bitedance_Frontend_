import React, { useState } from 'react';
import { Box, Button, Paper, TextField } from '@mui/material';
import MessageList from './components/MessageList';
import { Message } from './types';
import { chat } from './api/chat';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Handling the response in stream
  const handleStreamResponse = async (userInput: string) => {
    setIsLoading(true);
    try {
      const tempMessage: Message = {
        id: Date.now(),
        text: '',
        isBot: true
      };
      setMessages(prev => [...prev, { id: Date.now(), text: userInput, isBot: false }, tempMessage]);

      await chat.stream(userInput, (chunk) => {
        setMessages(prev =>
          prev.map(msg =>
            msg.id === tempMessage.id ? { ...msg, text: msg.text + chunk } : msg
          )
        );
      });
    } catch (e: any) {
      setError(e.message || '请求失败');
    } finally {
      setIsLoading(false);
    }
  };

  // File upload handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setSelectedFile(file);
    console.log('已选择文件:', file.name);
    // Future upload logic goes here
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      {error && (
        <div style={{ color: 'red', padding: '10px', border: '1px solid red' }}>
          {error}
        </div>
      )}
      {!expanded && (
        <TextField
          fullWidth
          placeholder="点击开始对话"
          onClick={() => setExpanded(true)}
          InputProps={{
            readOnly: true
          }}
          sx={{
            cursor: 'pointer',
            '& .MuiInputBase-input': { cursor: 'pointer' }
          }}
        />
      )}
      {expanded && (
        <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
          <MessageList messages={messages} isLoading={isLoading} />
          <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
            <Button variant="outlined" component="label">
              上传文件
              <input
                type="file"
                hidden
                accept="image/*, .pdf"
                onChange={handleFileUpload}
              />
            </Button>
            <TextField
              fullWidth
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && inputText.trim()) {
                  handleStreamResponse(inputText.trim());
                  setInputText('');
                }
              }}
              placeholder="输入您的消息"
              sx={{ flex: 1 }}
            />
            <Button
              variant='contained'
              color="primary"
              onClick={() => {
                if (inputText.trim()) {
                  handleStreamResponse(inputText.trim());
                  setInputText('');
                }
              }}
              sx={{ px: 4 }}
            >
              发送
            </Button>
            <Button
              variant="contained"
              onClick={() => setExpanded(false)}
              sx={{ px: 2 }}
            >
              收起
            </Button>
          </Box>
        </Paper>
      )}
    </Box>
  );
};

export default App;