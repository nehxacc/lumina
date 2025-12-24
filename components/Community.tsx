
import React, { useState, useEffect, useRef } from 'react';
import { Group, User, Message, GroupPost } from '../types';
// Add missing Heart icon to imports
import { Search, Send, Mic, Image as ImageIcon, Smile, ChevronLeft, Plus, Users, Lock, ChevronRight, MessageCircle, Video, Type as TextIcon, Paperclip, MoreHorizontal, Headphones, Play, Pause, XCircle, Upload, Sparkles, Shield, PenTool, Heart } from 'lucide-react';

interface CommunityProps {
  groups: Group[];
  currentUser: User;
  initialWhisperId?: string | null;
  onWhisperChange?: (id: string | null) => void;
}

interface LocalMessage {
  id: string;
  senderId: string;
  type: 'text' | 'image' | 'video' | 'thought' | 'audio';
  content: string;
  mediaUrl?: string;
  timestamp: number;
}

const AudioPlayer: React.FC<{ url: string; isMe: boolean }> = ({ url, isMe }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  // Fix: Added 'const' to declare audioRef
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
  };

  const onTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      if (audioRef.current.duration) {
        setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100);
      }
    }
  };

  const onLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const onEnded = () => {
    setIsPlaying(false);
    setProgress(0);
    setCurrentTime(0);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (progressBarRef.current && audioRef.current && audioRef.current.duration) {
      const rect = progressBarRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percentage = Math.max(0, Math.min(1, x / rect.width));
      audioRef.current.currentTime = percentage * audioRef.current.duration;
    }
  };

  const formatAudioTime = (time: number) => {
    if (isNaN(time) || !isFinite(time)) return '0:00';
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col gap-1 w-full max-w-[240px] animate-in fade-in duration-300">
      <div className="flex items-center gap-3 mb-1 px-1">
        <audio
          ref={audioRef}
          src={url}
          onTimeUpdate={onTimeUpdate}
          onLoadedMetadata={onLoadedMetadata}
          onEnded={onEnded}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          className="hidden"
        />
        <button
          onClick={togglePlay}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-sm active:scale-90 ${
            isMe
              ? 'bg-white/20 hover:bg-white/30 text-white'
              : 'bg-[#FAF9F6] hover:bg-[#F2F1ED] text-[#2D2D2D] border border-[#E6D5C5]/20'
          }`}
        >
          {isPlaying ? <Pause size={16} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-0.5" />}
        </button>
        <div
          ref={progressBarRef}
          onClick={handleSeek}
          className={`h-2 flex-1 rounded-full relative cursor-pointer overflow-hidden ${
            isMe ? 'bg-white/20' : 'bg-gray-100'
          }`}
        >
          <div
            className="h-full bg-[#C2D1C2] transition-all duration-100 ease-linear shadow-[0_0_8px_rgba(194,209,194,0.4)]"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      <div className="flex justify-between px-2">
        <span className={`text-[8px] font-bold tracking-widest uppercase opacity-60 ${isMe ? 'text-white' : 'text-[#7A7A7A]'}`}>
          {formatAudioTime(currentTime)}
        </span>
        <span className={`text-[8px] font-bold tracking-widest uppercase opacity-60 ${isMe ? 'text-white' : 'text-[#7A7A7A]'}`}>
          {formatAudioTime(duration)}
        </span>
      </div>
    </div>
  );
};

const Community: React.FC<CommunityProps> = ({ groups, currentUser, initialWhisperId, onWhisperChange }) => {
  const [activeTab, setActiveTab] = useState<'whispers' | 'circles'>('whispers');
  const [selectedContact, setSelectedContact] = useState<string | null>(initialWhisperId || null);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [messageText, setMessageText] = useState('');
  const [isMediaMenuOpen, setIsMediaMenuOpen] = useState(false);
  const [isEmojiMenuOpen, setIsEmojiMenuOpen] = useState(false);
  const [messages, setMessages] = useState<Record<string, LocalMessage[]>>({});
  
  // Circle Posting State
  const [circlePostText, setCirclePostText] = useState('');
  const [isCirclePostAnonymous, setIsCirclePostAnonymous] = useState(false);
  const [groupPosts, setGroupPosts] = useState<Record<string, GroupPost[]>>({});

  // Audio Recording & Visualization State
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingIntervalRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const whisperEndRef = useRef<HTMLDivElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const whisperInputRef = useRef<HTMLTextAreaElement>(null);
  const circlePostInputRef = useRef<HTMLTextAreaElement>(null);
  const postAreaRef = useRef<HTMLDivElement>(null);

  const contacts = [
    { id: '2', name: 'Sarah Chen', lastMsg: 'I loved that aesthetic you shared!', time: '2h ago', avatar: 'https://picsum.photos/id/65/100/100', online: true },
    { id: '3', name: 'Maya Blue', lastMsg: 'Are you going to the gallery?', time: '5h ago', avatar: 'https://picsum.photos/id/70/100/100', online: false },
  ];

  const aestheticEmojis = [
    '✨', '🌿', '🍂', '🌙', '🌊', '🦢', '☁️', '🤍', '🌸', '🏹', '🍵', '🕯️',
    '🤎', '🩰', '🐚', '🍄', '🎻', '🥞', '📖', '🧶', '🪴', '⛅', '🌷', '🦋',
    '🧸', '🧺', '🥐', '🧁', '🥂', '🎹', '🎨', '💌', '💭', '🫂', '🕊️', '🍒',
    '🍊', '🥨', '🍯', '🍇', '🎐'
  ];

  useEffect(() => {
    const initialMessages: Record<string, LocalMessage[]> = {
      '2': [
        { id: 'm1', senderId: '2', type: 'text', content: "I loved that aesthetic you shared! There's something so peaceful about the way you see the world. ✨", timestamp: Date.now() - 3600000 },
        { id: 'm2', senderId: currentUser.id, type: 'text', content: "Hey Sarah! Thank you so much for saying that. It's really just a reflection of how I'm feeling today. Quiet and calm. 🌿", timestamp: Date.now() - 3000000 },
        { id: 'm3', senderId: '2', type: 'image', content: "This reminded me of you.", mediaUrl: "https://picsum.photos/id/102/600/400", timestamp: Date.now() - 2000000 },
      ],
      '3': [
        { id: 'm4', senderId: '3', type: 'text', content: "Are you going to the gallery tonight?", timestamp: Date.now() - 5000000 },
      ]
    };
    setMessages(initialMessages);

    const initialGroupPosts: Record<string, GroupPost[]> = {};
    groups.forEach(g => {
      initialGroupPosts[g.id] = g.posts;
    });
    setGroupPosts(initialGroupPosts);
  }, [groups]);

  useEffect(() => {
    if (initialWhisperId) {
      setSelectedContact(initialWhisperId);
      setActiveTab('whispers');
      setSelectedGroup(null);
    }
  }, [initialWhisperId]);

  useEffect(() => {
    if (whisperEndRef.current) {
      whisperEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedContact, messages]);

  useEffect(() => {
    if (whisperInputRef.current) {
      whisperInputRef.current.style.height = 'auto';
      whisperInputRef.current.style.height = `${Math.min(whisperInputRef.current.scrollHeight, 120)}px`;
    }
  }, [messageText]);

  useEffect(() => {
    if (circlePostInputRef.current) {
      circlePostInputRef.current.style.height = 'auto';
      circlePostInputRef.current.style.height = `${Math.min(circlePostInputRef.current.scrollHeight, 250)}px`;
    }
  }, [circlePostText]);

  const handleContactSelect = (id: string | null) => {
    setSelectedContact(id);
    onWhisperChange?.(id);
  };

  const handleSendMessage = (type: LocalMessage['type'] = 'text', content: string = messageText, mediaUrl?: string) => {
    if (!selectedContact) return;
    if (type === 'text' && !content.trim()) return;

    const newMessage: LocalMessage = {
      id: Math.random().toString(36).substr(2, 9),
      senderId: currentUser.id,
      type,
      content,
      mediaUrl,
      timestamp: Date.now(),
    };

    setMessages(prev => ({
      ...prev,
      [selectedContact]: [...(prev[selectedContact] || []), newMessage]
    }));

    setMessageText('');
    setIsMediaMenuOpen(false);
    setIsEmojiMenuOpen(false);
    
    setTimeout(() => {
      if (whisperInputRef.current) {
        whisperInputRef.current.style.height = 'auto';
        whisperInputRef.current.focus();
      }
    }, 0);
  };

  const handleSendCirclePost = () => {
    if (!selectedGroup || !circlePostText.trim()) return;

    const newPost: GroupPost = {
      id: Math.random().toString(36).substr(2, 9),
      authorId: isCirclePostAnonymous ? 'anon' : currentUser.id,
      authorName: isCirclePostAnonymous ? 'Anonymous Soul' : currentUser.name,
      content: circlePostText,
      timestamp: Date.now(),
      likes: 0
    };

    setGroupPosts(prev => ({
      ...prev,
      [selectedGroup.id]: [newPost, ...(prev[selectedGroup.id] || [])]
    }));

    setCirclePostText('');
    setIsCirclePostAnonymous(false);
  };

  const scrollToPostArea = () => {
    if (postAreaRef.current) {
      postAreaRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(() => circlePostInputRef.current?.focus(), 500);
    }
  };

  const visualize = () => {
    if (!canvasRef.current || !analyserRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const analyser = analyserRef.current;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      animationFrameRef.current = requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const barWidth = (canvas.width / bufferLength) * 2.5;
      let barHeight;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i] / 2;

        ctx.fillStyle = `rgba(194, 209, 194, ${barHeight / 100})`;
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
        ctx.fillRect(x, 0, barWidth, barHeight / 4);

        x += barWidth + 1;
      }
    };

    draw();
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      
      audioContextRef.current = audioContext;
      analyserRef.current = analyser;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        handleSendMessage('audio', `Voice Whisper • ${formatTime(recordingTime)}`, audioUrl);
        setRecordingTime(0);
        
        if (audioContextRef.current) {
          audioContextRef.current.close();
        }
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
        
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      recordingIntervalRef.current = window.setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

      setTimeout(visualize, 50);
    } catch (err) {
      console.error("Error accessing microphone:", err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (recordingIntervalRef.current) clearInterval(recordingIntervalRef.current);
    }
  };

  const cancelRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (recordingIntervalRef.current) clearInterval(recordingIntervalRef.current);
      setRecordingTime(0);
      mediaRecorderRef.current.onstop = () => {
        setRecordingTime(0);
        if (audioContextRef.current) audioContextRef.current.close();
        if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      };
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleSendMessage('image', "Sent an image", reader.result as string);
      };
      reader.readAsDataURL(file);
    }
    if (imageInputRef.current) imageInputRef.current.value = '';
  };

  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const videoUrl = URL.createObjectURL(file);
      handleSendMessage('video', "Shared a video mood...", videoUrl);
    }
    if (videoInputRef.current) videoInputRef.current.value = '';
  };

  const handleAttachMedia = (type: 'image' | 'video' | 'thought') => {
    if (type === 'image') {
      imageInputRef.current?.click();
      return;
    }
    if (type === 'video') {
      videoInputRef.current?.click();
      return;
    }
    
    let mediaUrl = '';
    let content = '';
    
    if (type === 'thought') {
      content = "Thinking of a quiet morning by the lake, where the mist still hangs low over the water...";
    }

    handleSendMessage(type, content, mediaUrl);
  };

  const addEmoji = (emoji: string) => {
    setMessageText(prev => prev + emoji);
    setTimeout(() => whisperInputRef.current?.focus(), 0);
  };

  const renderWhispersList = () => (
    <div className="px-2 animate-in fade-in duration-500 max-w-4xl mx-auto">
      <div className="relative mb-8">
        <label htmlFor="search-whispers" className="sr-only">Search whispers</label>
        <input 
          id="search-whispers"
          type="text" 
          placeholder="Find a soul..." 
          className="w-full bg-white border border-[#E6D5C5]/30 py-4 pl-14 pr-4 rounded-[1.5rem] text-sm focus:outline-none focus:ring-2 focus:ring-[#E6D5C5]/50 transition-all shadow-sm"
        />
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
      </div>

      <div className="space-y-4" role="list">
        {contacts.map(contact => (
          <button 
            key={contact.id}
            onClick={() => handleContactSelect(contact.id)}
            aria-label={`Open conversation with ${contact.name}`}
            className="w-full bg-white p-5 rounded-[2rem] flex items-center gap-5 hover:bg-[#E6D5C5]/10 transition-all border border-[#E6D5C5]/10 hover:shadow-md active:scale-[0.98] group"
          >
            <div className="relative">
              <img src={contact.avatar} alt="" className="w-16 h-16 rounded-full border-2 border-white shadow-sm object-cover group-hover:scale-105 transition-transform" />
              {contact.online && (
                <div className="absolute bottom-0.5 right-0.5 w-4 h-4 bg-[#C2D1C2] border-2 border-white rounded-full shadow-sm"></div>
              )}
            </div>
            <div className="flex-1 text-left min-w-0">
              <div className="flex justify-between items-center mb-1 gap-2">
                <span className="font-semibold text-base text-[#2D2D2D] truncate">{contact.name}</span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-300 flex-shrink-0">{contact.time}</span>
              </div>
              <p className="text-sm text-[#7A7A7A] line-clamp-1 italic font-light leading-relaxed">"{contact.lastMsg}"</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  const renderCirclesList = () => (
    <div className="px-2 animate-in fade-in duration-500 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8 gap-4">
        <div className="relative flex-1">
          <label htmlFor="search-circles" className="sr-only">Search circles</label>
          <input 
            id="search-circles"
            type="text" 
            placeholder="Search circles..." 
            className="w-full bg-white border border-[#E6D5C5]/30 py-4 pl-14 pr-4 rounded-[1.5rem] text-sm focus:outline-none focus:ring-2 focus:ring-[#E6D5C5]/50 transition-all shadow-sm"
          />
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
        </div>
        <button 
          aria-label="Create new circle"
          className="bg-[#2D2D2D] p-4 rounded-2xl shadow-lg text-white hover:scale-105 transition-transform active:scale-95 flex-shrink-0"
        >
          <Plus size={20} />
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4" role="list">
        {groups.map(group => (
          <button 
            key={group.id}
            onClick={() => setSelectedGroup(group)}
            aria-label={`View ${group.name} community`}
            className="bg-white p-6 rounded-[2rem] border border-[#E6D5C5]/20 text-left hover:shadow-md transition-all flex items-center justify-between group"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                {group.isPrivate ? <Lock size={12} className="text-[#E5B7B7]" /> : <Users size={12} className="text-[#C2D1C2]" />}
                <h3 className="font-serif text-xl italic text-[#2D2D2D] truncate">{group.name}</h3>
              </div>
              <p className="text-sm text-[#7A7A7A] line-clamp-2 leading-relaxed font-light">{group.description}</p>
            </div>
            <ChevronRight size={20} className="text-gray-200 group-hover:text-[#2D2D2D] transition-all group-hover:translate-x-1 flex-shrink-0" />
          </button>
        ))}
      </div>
    </div>
  );

  const renderWhisperDetail = () => {
    const contact = contacts.find(c => c.id === selectedContact);
    const contactMessages = messages[selectedContact || ''] || [];

    return (
      <div className="fixed inset-0 z-[100] bg-white flex flex-col h-full h-[100svh] animate-in slide-in-from-bottom-6 duration-700 sm:relative sm:inset-auto sm:z-auto sm:flex-1 sm:h-[calc(100vh-160px)] sm:rounded-[3rem] sm:shadow-[0_20px_60px_-15px_rgba(230,213,197,0.4)] sm:border sm:border-[#E6D5C5]/20 sm:overflow-hidden sm:mb-8">
        <header className="px-6 py-5 sm:px-8 sm:py-6 pt-[calc(1.25rem+env(safe-area-inset-top))] flex items-center justify-between border-b border-gray-50 bg-[#FAF9F6]/80 backdrop-blur-md relative z-10">
          <div className="flex items-center gap-4 min-w-0">
            <button 
              onClick={() => handleContactSelect(null)} 
              aria-label="Back to whispers"
              className="p-2.5 hover:bg-white rounded-full transition-all border border-transparent hover:border-gray-100 flex-shrink-0"
            >
               <ChevronLeft size={24} className="text-[#2D2D2D]" />
            </button>
            <div className="relative flex-shrink-0">
              <img src={contact?.avatar} alt="" className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full shadow-md border-2 border-white object-cover" />
              {contact?.online && (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#C2D1C2] border-2 border-white rounded-full"></div>
              )}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-base sm:text-lg font-serif italic text-[#2D2D2D] leading-tight truncate">{contact?.name}</span>
              <span className="text-[9px] sm:text-[10px] text-[#AFAFAF] font-black uppercase tracking-widest">{contact?.online ? 'Currently Dreaming' : 'Resting'}</span>
            </div>
          </div>
          <button aria-label="More options" className="p-2.5 hover:bg-white rounded-full transition-all text-gray-300 hover:text-[#2D2D2D] flex-shrink-0">
            <MoreHorizontal size={20} />
          </button>
        </header>

        <div className="flex-1 px-4 sm:px-8 py-8 overflow-y-auto space-y-8 no-scrollbar bg-[#FAF9F6]/20 flex flex-col">
          <div className="mt-auto" />
          
          <div className="flex justify-center mb-4">
            <span className="text-[10px] uppercase font-black tracking-[0.3em] text-[#E6D5C5] px-4 py-1.5 bg-white border border-[#E6D5C5]/20 rounded-full shadow-sm text-center">Connection Established</span>
          </div>

          {contactMessages.map((msg) => {
            const isMe = msg.senderId === currentUser.id;
            const timeString = new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            return (
              <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`
                  ${isMe ? 'bg-[#2D2D2D] text-white rounded-tr-none' : 'bg-white text-[#2D2D2D] rounded-tl-none border border-[#E6D5C5]/10 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)]'} 
                  p-4 sm:p-5 rounded-[2rem] max-w-[90%] sm:max-w-[85%] relative overflow-hidden group/msg transition-all
                  ${msg.type === 'thought' ? 'border-l-4 border-[#C2D1C2]' : ''}
                  ${msg.type === 'image' ? 'p-2 sm:p-3 rounded-[2.5rem] transform -rotate-1 shadow-md' : ''}
                  ${msg.type === 'video' ? 'p-2 sm:p-3 rounded-[2.5rem] shadow-md' : ''}
                `}>
                  {msg.type === 'image' && msg.mediaUrl && (
                    <div className="rounded-[1.75rem] overflow-hidden mb-3 sm:mb-4 shadow-inner bg-gray-50 aspect-[4/3]">
                      <img src={msg.mediaUrl} alt="" className="w-full h-full object-cover" />
                    </div>
                  )}
                  {msg.type === 'video' && msg.mediaUrl && (
                    <div className="rounded-[1.75rem] overflow-hidden mb-3 sm:mb-4 shadow-inner bg-black aspect-video relative">
                      <video src={msg.mediaUrl} className="w-full h-full object-contain" controls />
                    </div>
                  )}
                  {msg.type === 'audio' && msg.mediaUrl && (
                    <AudioPlayer url={msg.mediaUrl} isMe={isMe} />
                  )}
                  <p className={`text-[14px] sm:text-[15px] leading-relaxed font-light ${!isMe ? 'italic' : ''} break-words`}>
                    {msg.type === 'thought' ? `"${msg.content}"` : msg.content}
                  </p>
                  <span className={`text-[8px] uppercase font-bold mt-3 block text-right tracking-widest ${isMe ? 'text-white/40' : 'text-[#AFAFAF]'}`}>
                    {timeString}
                  </span>
                </div>
              </div>
            );
          })}
          
          <div ref={whisperEndRef} />
        </div>

        <div className="px-4 sm:px-8 py-4 sm:py-6 border-t border-gray-50 bg-white relative pb-[calc(1rem+env(safe-area-inset-bottom))] sm:pb-8 shadow-[0_-10px_30px_rgba(0,0,0,0.02)]">
          <input type="file" ref={imageInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
          <input type="file" ref={videoInputRef} onChange={handleVideoFileChange} accept="video/*" className="hidden" />

          {isEmojiMenuOpen && (
            <div className="absolute bottom-[calc(100%+0.5rem)] right-4 sm:right-6 w-[calc(100vw-2rem)] sm:w-72 bg-white rounded-[2.5rem] p-4 sm:p-5 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.15)] border border-[#E6D5C5]/30 animate-in fade-in zoom-in duration-300 z-[110]">
               <div className="mb-3 flex items-center justify-between px-2">
                 <span className="text-[10px] uppercase font-black text-[#C2D1C2] tracking-widest">Select Mood</span>
                 <button onClick={() => setIsEmojiMenuOpen(false)} className="text-gray-300 hover:text-gray-500">
                   <XCircle size={14} />
                 </button>
               </div>
               <div className="max-h-48 overflow-y-auto no-scrollbar grid grid-cols-6 gap-2">
                {aestheticEmojis.map((emoji, idx) => (
                  <button key={idx} onClick={() => addEmoji(emoji)} className="w-10 h-10 flex items-center justify-center text-lg sm:text-xl hover:bg-[#FAF9F6] rounded-xl transition-all hover:scale-110 active:scale-90">{emoji}</button>
                ))}
              </div>
            </div>
          )}

          {isMediaMenuOpen && (
            <div className="absolute bottom-[calc(100%+0.5rem)] left-4 sm:left-6 bg-white/95 backdrop-blur-xl rounded-[2.5rem] p-3 sm:p-4 shadow-2xl border border-[#E6D5C5]/30 flex gap-2 sm:gap-4 animate-in slide-in-from-bottom-4 duration-500 z-[110]">
              <button onClick={() => handleAttachMedia('image')} aria-label="Attach image" className="flex flex-col items-center gap-1.5 p-3 sm:p-4 hover:bg-[#E6D5C5]/10 rounded-[2rem] transition-all group">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#E5B7B7]/10 flex items-center justify-center text-[#E5B7B7] group-hover:scale-110 transition-transform shadow-sm"><ImageIcon size={20} /></div>
                <span className="text-[8px] font-black uppercase tracking-widest text-gray-500">Image</span>
              </button>
              <button onClick={() => handleAttachMedia('video')} aria-label="Attach video" className="flex flex-col items-center gap-1.5 p-3 sm:p-4 hover:bg-[#C2D1C2]/10 rounded-[2rem] transition-all group">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#C2D1C2]/10 flex items-center justify-center text-[#C2D1C2] group-hover:scale-110 transition-transform shadow-sm"><Video size={20} /></div>
                <span className="text-[8px] font-black uppercase tracking-widest text-gray-500">Video</span>
              </button>
              <button onClick={() => handleAttachMedia('thought')} aria-label="Write a text thought" className="flex flex-col items-center gap-1.5 p-3 sm:p-4 hover:bg-[#E6D5C5]/10 rounded-[2rem] transition-all group">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#E6D5C5]/10 flex items-center justify-center text-[#E6D5C5] group-hover:scale-110 transition-transform shadow-sm"><TextIcon size={20} /></div>
                <span className="text-[8px] font-black uppercase tracking-widest text-gray-500">Thought</span>
              </button>
            </div>
          )}

          <div className="flex items-end gap-3 sm:gap-4 min-h-[50px] sm:min-h-[60px]">
             {isRecording ? (
               <div className="flex-1 flex items-center gap-3 sm:gap-4 bg-[#FAF9F6] py-3 sm:py-4 px-4 sm:px-6 rounded-full border border-[#E6D5C5]/30 animate-in fade-in slide-in-from-bottom-2 h-full">
                 <div className="flex flex-col flex-1 gap-0.5">
                   <div className="flex items-center gap-2">
                      <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-red-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(248,113,113,0.5)]" />
                      <span className="text-[#2D2D2D] font-mono font-bold text-xs">{formatTime(recordingTime)}</span>
                      <span className="text-[8px] sm:text-[9px] text-[#AFAFAF] font-black uppercase tracking-widest truncate">Whispering...</span>
                   </div>
                   <canvas ref={canvasRef} width="300" height="30" className="w-full h-6 sm:h-8 opacity-60" />
                 </div>
                 <div className="flex items-center gap-2 sm:gap-3">
                    <button onClick={cancelRecording} className="text-[#AFAFAF] hover:text-[#E5B7B7] transition-colors p-1.5"><XCircle size={20} /></button>
                    <button onClick={stopRecording} className="bg-[#2D2D2D] text-white p-2.5 sm:p-3 rounded-full shadow-md hover:scale-110 active:scale-95 transition-all flex-shrink-0"><Send size={16} /></button>
                 </div>
               </div>
             ) : (
               <form className="flex-1 flex items-end gap-3 sm:gap-4" onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}>
                 <button type="button" onClick={() => { setIsMediaMenuOpen(!isMediaMenuOpen); setIsEmojiMenuOpen(false); }} className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex-shrink-0 flex items-center justify-center transition-all border shadow-sm mb-0.5 ${isMediaMenuOpen ? 'bg-[#2D2D2D] text-white border-[#2D2D2D] rotate-45' : 'bg-white text-gray-400 border-gray-100 hover:text-[#2D2D2D] hover:border-gray-200'}`}><Plus size={24} /></button>
                 <div className="flex-1 relative group bg-gray-100 rounded-[1.75rem] transition-all overflow-hidden border-2 border-transparent focus-within:border-[#E6D5C5]/30 focus-within:bg-white shadow-inner">
                    <textarea 
                      id="whisper-input" 
                      ref={whisperInputRef}
                      value={messageText} 
                      onChange={(e) => setMessageText(e.target.value)} 
                      onFocus={() => { setIsMediaMenuOpen(false); setIsEmojiMenuOpen(false); }} 
                      placeholder="Whisper..." 
                      rows={1}
                      className="w-full bg-transparent py-3 sm:py-4.5 px-4 sm:px-6 pr-16 sm:pr-24 text-[15px] sm:text-[16px] focus:outline-none resize-none placeholder:text-gray-400 min-h-[44px] sm:min-h-[56px] max-h-[120px] leading-relaxed scrollbar-hide"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                    />
                    <div className="absolute right-2 sm:right-4 bottom-2.5 sm:bottom-3 flex items-center gap-1 sm:gap-2">
                       <button type="button" onClick={startRecording} className="p-1.5 text-gray-400 hover:text-[#C2D1C2] transition-colors focus:outline-none"><Mic size={18}/></button>
                       <button type="button" onClick={() => { setIsEmojiMenuOpen(!isEmojiMenuOpen); setIsMediaMenuOpen(false); }} className={`p-1.5 transition-colors focus:outline-none ${isEmojiMenuOpen ? 'text-[#E6D5C5]' : 'text-gray-400 hover:text-[#E6D5C5]'}`}><Smile size={18}/></button>
                    </div>
                 </div>
                 <button type="submit" className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex-shrink-0 mb-0.5 flex items-center justify-center shadow-lg transition-all transform active:scale-90 ${messageText.trim() ? 'bg-[#2D2D2D] text-white hover:shadow-xl' : 'bg-gray-100 text-gray-300'}`} disabled={!messageText.trim()}><Send size={20} className={messageText.trim() ? 'translate-x-0.5 -translate-y-0.5' : ''} /></button>
              </form>
             )}
          </div>
        </div>
      </div>
    );
  };

  const renderCircleDetail = () => {
    const posts = groupPosts[selectedGroup?.id || ''] || [];

    return (
      <div className="px-2 h-full flex flex-col animate-in slide-in-from-right duration-500 max-w-4xl mx-auto pb-24 relative overflow-x-hidden">
        <button onClick={() => setSelectedGroup(null)} className="text-[11px] font-black uppercase tracking-[0.2em] text-[#AFAFAF] mb-6 flex items-center gap-2 hover:text-[#2D2D2D] transition-colors group">
          <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Community List
        </button>
        
        <div className="bg-white p-6 sm:p-12 rounded-[3.5rem] border border-[#E6D5C5]/20 mb-8 shadow-[0_20px_60px_-15px_rgba(230,213,197,0.3)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-[#FAF9F6] rounded-bl-full opacity-40 -mr-6 -mt-6 sm:-mr-8 sm:-mt-8" />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4 sm:mb-6">
               <div className="px-3 py-1 bg-[#C2D1C2]/15 rounded-full text-[9px] font-bold text-[#C2D1C2] uppercase tracking-[0.2em] border border-[#C2D1C2]/30">Active Circle</div>
               {selectedGroup?.isPrivate && <Lock size={12} className="text-[#E5B7B7]" />}
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl italic mb-4 sm:mb-6 text-[#2D2D2D] tracking-tight truncate">{selectedGroup?.name}</h2>
            <p className="text-[#7A7A7A] text-base sm:text-lg leading-relaxed mb-8 sm:mb-10 font-light italic max-w-2xl">"{selectedGroup?.description}"</p>
            <div className="flex flex-col sm:flex-row sm:items-center gap-6 sm:gap-8">
               <div className="flex items-center gap-3 sm:gap-4">
                 <div className="flex -space-x-3 overflow-visible">
                   {[1, 2, 3, 4].map(i => <img key={i} src={`https://picsum.photos/id/${60+i}/80/80`} alt="" className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-white shadow-md object-cover" />)}
                 </div>
                 <span className="text-[10px] font-black uppercase text-[#AFAFAF] tracking-[0.2em] truncate">+{selectedGroup?.members.length} Joined</span>
               </div>
               <button onClick={scrollToPostArea} className="bg-[#2D2D2D] text-white px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all active:scale-95 flex items-center justify-center gap-3 w-full sm:w-auto">
                 <PenTool size={16} /> Share a Muse
               </button>
            </div>
          </div>
        </div>

        {/* Share a Muse Interface - Redesigned for Accessibility */}
        <div ref={postAreaRef} className="bg-white p-6 sm:p-10 rounded-[3.5rem] border border-[#E6D5C5]/30 mb-12 shadow-[0_30px_70px_-20px_rgba(0,0,0,0.05)] animate-in zoom-in-95 duration-500">
           <div className="flex items-center justify-between mb-6 sm:mb-8 px-2">
              <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#FAF9F6] shadow-inner flex items-center justify-center border border-[#E6D5C5]/10 overflow-hidden flex-shrink-0">
                   {isCirclePostAnonymous ? <Shield size={22} className="text-[#E6D5C5]" /> : <img src={currentUser.avatar} className="w-full h-full object-cover" alt="" />}
                </div>
                <div className="min-w-0">
                  <span className="text-[14px] sm:text-[15px] font-bold block text-[#2D2D2D] leading-none mb-1 truncate">{isCirclePostAnonymous ? 'Anonymous Soul' : currentUser.name}</span>
                  <button 
                    onClick={() => setIsCirclePostAnonymous(!isCirclePostAnonymous)}
                    className={`text-[9px] font-black uppercase tracking-[0.2em] transition-all px-2 py-1 rounded-md border truncate max-w-full ${isCirclePostAnonymous ? 'bg-[#C2D1C2]/10 text-[#C2D1C2] border-[#C2D1C2]/20' : 'text-[#AFAFAF] hover:text-[#2D2D2D] border-transparent hover:border-gray-100'}`}
                  >
                     {isCirclePostAnonymous ? 'Stealth Mode' : 'Go Anonymous?'}
                  </button>
                </div>
              </div>
              <Sparkles size={24} className="text-[#E6D5C5] opacity-40 flex-shrink-0 hidden xs:block" />
           </div>
           
           <div className="bg-[#FAF9F6] rounded-[2.5rem] p-6 sm:p-8 mb-6 sm:mb-8 group-focus-within:bg-white transition-colors border-2 border-transparent focus-within:border-[#E6D5C5]/30 shadow-inner">
             <textarea 
                ref={circlePostInputRef}
                value={circlePostText}
                onChange={(e) => setCirclePostText(e.target.value)}
                placeholder="What is visiting your soul today?"
                className="w-full bg-transparent text-xl sm:text-2xl font-serif italic text-[#2D2D2D] focus:outline-none resize-none placeholder:text-[#E6D5C5] min-h-[80px] leading-[1.6]"
             />
           </div>

           <div className="flex flex-col sm:flex-row justify-between items-center gap-4 px-2">
              <div className="hidden md:flex items-center gap-3">
                 <div className="w-1 h-1 rounded-full bg-[#E6D5C5]" />
                 <span className="text-[10px] uppercase font-black text-[#E6D5C5] tracking-[0.3em]">Circle Contribution</span>
              </div>
              <div className="flex gap-3 w-full sm:w-auto">
                <button 
                  onClick={() => setCirclePostText('')}
                  className="flex-1 sm:flex-none px-6 sm:px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-[#7A7A7A] hover:bg-gray-50 transition-colors"
                >
                  Discard
                </button>
                <button 
                  onClick={handleSendCirclePost}
                  disabled={!circlePostText.trim()}
                  className={`flex-1 sm:flex-none py-4 sm:py-4.5 px-8 sm:px-12 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl transition-all transform active:scale-95 ${circlePostText.trim() ? 'bg-[#2D2D2D] text-white hover:shadow-2xl' : 'bg-gray-100 text-gray-300 pointer-events-none'}`}
                >
                  Publish Muse
                </button>
              </div>
           </div>
        </div>

        <div className="space-y-8 sm:space-y-10 flex-1 px-1">
          <div className="flex items-center justify-between mb-6 sm:mb-8">
            <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-[#E6D5C5] pl-2 flex-shrink-0">Muses History</h4>
            <div className="h-px bg-[#E6D5C5]/20 flex-1 ml-4 sm:ml-6" />
          </div>
          
          {posts.length > 0 ? (
            posts.map(post => (
              <div key={post.id} className="bg-white p-6 sm:p-10 rounded-[3rem] border border-[#E6D5C5]/10 shadow-[0_15px_45px_-15px_rgba(0,0,0,0.03)] hover:shadow-xl transition-all group animate-in fade-in slide-in-from-bottom-6 overflow-hidden">
                <div className="flex items-center justify-between mb-6 sm:mb-8 gap-4">
                  <div className="flex items-center gap-4 sm:gap-5 min-w-0">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-tr from-[#FAF9F6] to-[#E6D5C5] p-0.5 shadow-md flex-shrink-0">
                        <div className="w-full h-full rounded-full bg-white flex items-center justify-center font-serif italic text-xl text-[#2D2D2D] overflow-hidden">
                          {post.authorId === 'anon' ? <Shield size={24} className="text-[#E6D5C5]" /> : <img src={`https://picsum.photos/id/${post.authorId.charCodeAt(0) + 50}/100/100`} className="w-full h-full object-cover" alt="" />}
                        </div>
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className={`text-[15px] sm:text-[16px] font-bold truncate ${post.authorId === 'anon' ? 'italic text-[#AFAFAF]' : 'text-[#2D2D2D]'}`}>{post.authorName}</span>
                      <span className="text-[9px] text-[#AFAFAF] uppercase tracking-[0.25em] font-black leading-none mt-1.5 truncate">{new Date(post.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                  </div>
                  <button className="text-[#E6D5C5] opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"><MoreHorizontal size={20} /></button>
                </div>
                <p className="text-[#4A4A4A] text-lg sm:text-2xl leading-[1.5] italic font-light pl-6 sm:pl-8 border-l-4 border-[#E6D5C5]/40 tracking-tight break-words">"{post.content}"</p>
                <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-gray-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                   <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C2D1C2] flex-shrink-0" />
                      <span className="text-[9px] font-black uppercase text-[#AFAFAF] tracking-widest truncate">Thought Shared</span>
                   </div>
                   <button className="flex items-center gap-2.5 px-6 py-2.5 bg-[#FAF9F6] rounded-full text-[#AFAFAF] hover:text-[#E5B7B7] hover:bg-[#E5B7B7]/10 transition-all group/like ml-auto sm:ml-0">
                      <span className="text-[11px] font-black">{post.likes}</span>
                      <Heart size={16} className="group-hover/like:scale-125 transition-transform" />
                   </button>
                </div>
              </div>
            ))
          ) : (
            <div className="py-24 sm:py-32 text-center bg-[#FAF9F6]/50 rounded-[4rem] border-2 border-[#E6D5C5]/20 border-dashed">
              <Sparkles size={40} className="mx-auto text-[#E6D5C5] mb-6 opacity-40" />
              <p className="font-serif italic text-[#AFAFAF] text-xl sm:text-2xl px-6">This space is waiting for its first muse.</p>
              <button onClick={scrollToPostArea} className="mt-8 text-[10px] font-black uppercase tracking-[0.3em] text-[#C2D1C2] hover:text-[#2D2D2D] transition-colors">Start the conversation</button>
            </div>
          )}
        </div>

        {/* Floating Access Button for Posting */}
        <button 
          onClick={scrollToPostArea}
          className="fixed bottom-[calc(5rem+env(safe-area-inset-bottom))] right-6 sm:bottom-12 sm:right-12 w-14 h-14 sm:w-16 sm:h-16 bg-[#2D2D2D] text-white rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex items-center justify-center transform hover:scale-110 active:scale-90 transition-all z-40 group"
          aria-label="New Muse"
        >
          <div className="absolute -top-12 right-0 bg-white px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest text-[#2D2D2D] shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-[#E6D5C5]/20 pointer-events-none">Share a Muse</div>
          <Plus size={28} className="sm:w-8 sm:h-8" />
        </button>
      </div>
    );
  };

  return (
    <div className={`py-4 min-h-[80vh] flex flex-col ${selectedContact ? 'h-screen h-[100svh] fixed inset-0 z-[100] bg-white sm:relative sm:inset-auto sm:h-auto sm:z-auto sm:bg-transparent' : 'max-w-6xl mx-auto'}`}>
      {(!selectedContact && !selectedGroup) && (
        <div className="mb-12 animate-in fade-in slide-in-from-bottom-2 duration-500 text-center max-w-4xl mx-auto w-full px-4">
          <h2 className="font-serif text-4xl sm:text-5xl italic mb-6 sm:mb-8 tracking-tighter">Community</h2>
          <div className="flex justify-center">
            <div className="flex bg-[#F2F1ED]/50 backdrop-blur-md p-1.5 rounded-[2.5rem] border border-white/50 shadow-sm w-full max-w-xs" role="tablist">
              <button onClick={() => setActiveTab('whispers')} role="tab" aria-selected={activeTab === 'whispers'} className={`flex-1 py-3 px-4 sm:py-3.5 sm:px-6 flex items-center justify-center gap-3 rounded-[2rem] text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 truncate ${activeTab === 'whispers' ? 'bg-white text-[#2D2D2D] shadow-md' : 'text-[#AFAFAF] hover:text-[#2D2D2D]'}`}>Whispers</button>
              <button onClick={() => setActiveTab('circles')} role="tab" aria-selected={activeTab === 'circles'} className={`flex-1 py-3 px-4 sm:py-3.5 sm:px-6 flex items-center justify-center gap-3 rounded-[2rem] text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 truncate ${activeTab === 'circles' ? 'bg-white text-[#2D2D2D] shadow-md' : 'text-[#AFAFAF] hover:text-[#2D2D2D]'}`}>Circles</button>
            </div>
          </div>
        </div>
      )}
      <div className={`flex-1 flex flex-col ${selectedContact ? 'h-full overflow-hidden' : ''}`}>
        {activeTab === 'whispers' ? (selectedContact ? renderWhisperDetail() : renderWhispersList()) : (selectedGroup ? renderCircleDetail() : renderCirclesList())}
      </div>
    </div>
  );
};

export default Community;
