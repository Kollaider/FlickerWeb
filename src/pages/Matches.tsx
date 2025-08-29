import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

import { useChatStore } from '@/lib/store';
import { MessageType } from '@/lib/api';

export default function Matches() {
  const { t } = useTranslation();
  const { 
    matches, 
    currentChat, 
    messages, 
    isLoading, 
    loadMatches, 
    loadMessages, 
    sendMessage, 
    setCurrentChat 
  } = useChatStore();
  
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    loadMatches();
  }, []);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !currentChat) return;
    
    try {
      await sendMessage(currentChat, newMessage);
      setNewMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (isLoading && matches.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 dark:from-gray-900 dark:via-purple-900 dark:to-indigo-900">
      <div className="flex h-screen">
        {/* Matches Sidebar */}
        <div className={`${currentChat ? 'hidden md:block' : 'block'} w-full md:w-80 border-r border-border bg-background/50 backdrop-blur-sm`}>
          <div className="p-4 border-b border-border">
            <h1 className="text-xl font-bold">{t('matches')}</h1>
          </div>
          
          <ScrollArea className="h-full">
            <div className="p-4 space-y-2">
              {matches.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No matches yet</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Start swiping to find your perfect match!
                  </p>
                </div>
              ) : (
                matches.map((match) => (
                  <Card
                    key={match.chat_id}
                    className={`cursor-pointer transition-colors hover:bg-muted/50 ${
                      currentChat === match.chat_id ? 'bg-muted' : ''
                    }`}
                    onClick={() => setCurrentChat(match.chat_id)}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarImage src={match.user.photos[0]?.url} />
                          <AvatarFallback>
                            {match.user.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="font-medium truncate">{match.user.name}</p>
                            <Badge variant="outline" className="ml-2">
                              <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                              Online
                            </Badge>
                          </div>
                          
                          {match.last_message && (
                            <p className="text-sm text-muted-foreground truncate">
                              {match.last_message.text}
                            </p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Chat Area */}
        <div className={`${currentChat ? 'block' : 'hidden md:block'} flex-1 flex flex-col`}>
          {currentChat ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-border bg-background/50 backdrop-blur-sm">
                <div className="flex items-center space-x-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="md:hidden"
                    onClick={() => setCurrentChat(null)}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </Button>
                  
                  {(() => {
                    const match = matches.find(m => m.chat_id === currentChat);
                    return match ? (
                      <>
                        <Avatar>
                          <AvatarImage src={match.user.photos[0]?.url} />
                          <AvatarFallback>
                            {match.user.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h2 className="font-semibold">{match.user.name}</h2>
                          <p className="text-sm text-muted-foreground">{t('online')}</p>
                        </div>
                      </>
                    ) : null;
                  })()}
                </div>
              </div>

              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {(messages[currentChat] || []).map((message: MessageType) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.from_user_id === 'current-user' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.from_user_id === 'current-user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}
                      >
                        <p className="text-sm">{message.text}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {formatTime(message.created_at)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              {/* Message Input */}
              <div className="p-4 border-t border-border bg-background/50 backdrop-blur-sm">
                <div className="flex space-x-2">
                  <Input
                    placeholder={t('type_message')}
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="flex-1"
                  />
                  <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                    {t('send')}
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <svg className="w-16 h-16 mx-auto mb-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <h2 className="text-xl font-semibold mb-2">Select a match to start chatting</h2>
                <p className="text-muted-foreground">Choose from your matches to begin a conversation</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}