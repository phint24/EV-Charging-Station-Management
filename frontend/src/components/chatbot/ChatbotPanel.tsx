import { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Trash2, X, MessageSquare } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

interface ChatbotPanelProps {
  onSendMessage: (message: string) => Promise<string>;
  onClearHistory?: () => Promise<void>;
  isOpen: boolean;
  onToggle: () => void;
}

export function ChatbotPanel({ 
  onSendMessage, 
  onClearHistory,
  isOpen,
  onToggle 
}: ChatbotPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await onSendMessage(inputMessage);
      
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: Date.now()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau.',
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClearChat = async () => {
    if (window.confirm('Bạn có chắc muốn xóa toàn bộ lịch sử chat?')) {
      setMessages([]);
      if (onClearHistory) {
        try {
          await onClearHistory();
        } catch (error) {
          console.error('Error clearing history:', error);
        }
      }
    }
  };

  if (!isOpen) {
    return (
      <Button
        onClick={onToggle}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg bg-[#0f766e] hover:bg-[#0d5f57] text-white z-50"
      >
        <MessageSquare className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 h-[600px] z-50 flex flex-col">
      <Card className="flex flex-col h-full rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0f766e] to-[#14b8a6] p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
              <Bot className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-white">EV Assistant</h3>
              <p className="text-xs text-white/80">Trợ lý AI của bạn</p>
            </div>
          </div>
          <div className="flex gap-2">
            {messages.length > 0 && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClearChat}
                className="h-8 w-8 text-white hover:bg-white/20"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggle}
              className="h-8 w-8 text-white hover:bg-white/20"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center p-6">
              <Bot className="h-16 w-16 text-[#0f766e] mb-4" />
              <h4 className="font-semibold text-gray-900 mb-2">
                Xin chào! 👋
              </h4>
              <p className="text-sm text-gray-600">
                Tôi là trợ lý AI của hệ thống EV Charging. Hãy hỏi tôi bất cứ điều gì về việc sạc xe điện!
              </p>
              <div className="mt-4 space-y-2 w-full">
                <button
                  onClick={() => setInputMessage('Làm thế nào để đặt lịch sạc xe?')}
                  className="w-full text-left p-2 text-sm rounded-lg border hover:bg-white transition-colors"
                >
                  💡 Làm thế nào để đặt lịch sạc xe?
                </button>
                <button
                  onClick={() => setInputMessage('Giá sạc xe là bao nhiêu?')}
                  className="w-full text-left p-2 text-sm rounded-lg border hover:bg-white transition-colors"
                >
                  💰 Giá sạc xe là bao nhiêu?
                </button>
                <button
                  onClick={() => setInputMessage('Tôi nên nạp tiền vào ví như thế nào?')}
                  className="w-full text-left p-2 text-sm rounded-lg border hover:bg-white transition-colors"
                >
                  💳 Tôi nên nạp tiền vào ví như thế nào?
                </button>
              </div>
            </div>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${
                message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              <div
                className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.role === 'user'
                    ? 'bg-[#0f766e]'
                    : 'bg-gray-200'
                }`}
              >
                {message.role === 'user' ? (
                  <User className="h-5 w-5 text-white" />
                ) : (
                  <Bot className="h-5 w-5 text-gray-600" />
                )}
              </div>
              <div
                className={`max-w-[75%] rounded-2xl p-3 ${
                  message.role === 'user'
                    ? 'bg-[#0f766e] text-white'
                    : 'bg-white border shadow-sm'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap break-words">
                  {message.content}
                </p>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3">
              <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                <Bot className="h-5 w-5 text-gray-600" />
              </div>
              <div className="bg-white border shadow-sm rounded-2xl p-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t">
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Nhập tin nhắn..."
              disabled={isLoading}
              className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-[#0f766e] disabled:opacity-50"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="h-10 w-10 rounded-full bg-[#0f766e] hover:bg-[#0d5f57] disabled:opacity-50"
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}