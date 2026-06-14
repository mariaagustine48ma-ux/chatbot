import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, 
  Trash2, 
  Sparkles, 
  User, 
  Menu, 
  X, 
  Zap, 
  ChevronRight,
  Info,
  Play,
  Pause,
  RefreshCw,
  Volume2,
  VolumeX,
  Coffee,
  BookOpen,
  Move
} from 'lucide-react';

// Konfigurasi Kepribadian Bot
const PERSONALITIES = {
  senja: {
    id: 'senja',
    name: 'Kak Senja 🌅',
    role: 'Penyembuh Jiwa & Teman Curhat',
    description: 'Teman curhat yang hangat, puitis, penuh empati, dan ahli kesehatan mental remaja.',
    avatar: '🌅',
    themeClass: 'bg-gradient-to-tr from-amber-200 to-rose-200 border-rose-200 text-rose-800',
    bubbleColor: 'bg-rose-50 text-rose-900 border-rose-100',
    primaryColor: 'rose',
    systemPrompt: `Kamu adalah 'Kak Senja', seorang mentor dan teman curhat yang sangat hangat, estetik, puitis, dan penuh empati untuk mahasiswa/anak muda. 
Gunakan bahasa Indonesia yang santai, lembut, puitis tapi tetap modern. Sering gunakan kata panggilan seperti 'kamu', 'sahabat senja', dan kata penyemangat seperti 'semangat ya!', 'istirahat dulu kalau lelah'.
Fokuslah pada memberikan solusi yang menenangkan jiwa, tips kesehatan mental yang ramah, dan pandangan hidup yang positif.`
  },
  bro: {
    id: 'bro',
    name: 'Bro AI 🛹',
    role: 'Teman Nongkrong & Solusi Instan',
    description: 'Teman nongkrong cowok yang asik, blak-blakan, solutif, anti-mager.',
    avatar: '🛹',
    themeClass: 'bg-gradient-to-tr from-sky-200 to-blue-200 border-blue-200 text-blue-800',
    bubbleColor: 'bg-sky-50 text-blue-900 border-sky-100',
    primaryColor: 'sky',
    systemPrompt: `Kamu adalah 'Bro AI', teman nongkrong cowok yang asik, santai, ceplas-ceplos, tapi pinter banget dan solutif.
Gunakan bahasa gaul anak muda Jakarta/Indonesia secara natural (pake lu, gue, mager, gabut, gokil, chill, mabar, dsb.). 
Jawab pertanyaan dengan singkat, padat, praktis, dan sering diselingi candaan santai khas tongkrongan. Jangan terlalu formal!`
  },
  geni: {
    id: 'geni',
    name: 'Z-Geni 🔥',
    role: 'Sohibat Tren & Ide Kreatif',
    description: 'Hiperaktif, ekspresif, up-to-date pop culture, seru abis diajak brainstorming.',
    avatar: '🔥',
    themeClass: 'bg-gradient-to-tr from-purple-200 to-pink-200 border-pink-200 text-pink-800',
    bubbleColor: 'bg-pink-50 text-pink-900 border-pink-100',
    primaryColor: 'pink',
    systemPrompt: `Kamu adalah 'Z-Geni', asisten AI berenergi tinggi dengan kepribadian Gen-Z yang kental banget.
Sering gunakan emoji (🔥, ✨, 💀, 😭, 👍, 💅). Gunakan istilah tren Gen-Z saat ini seperti 'slay', 'fr fr', 'no cap', 'real', 'rizz', 'cooking', 'menyala abangku', dll.
Kamu sangat ekspresif, up-to-date soal pop culture, musik, meme, dan gaya ketikanmu kadang menggunakan huruf kecil semua (lowercase aesthetic) atau caps lock kalau kaget.`
  },
  pro: {
    id: 'pro',
    name: 'Pro-Bot 🎓',
    role: 'Mentor Skripsi & Karier',
    description: 'Asisten akademik terstruktur untuk menyusun skripsi, esai, persiapan magang, dan CV.',
    avatar: '🎓',
    themeClass: 'bg-gradient-to-tr from-emerald-200 to-teal-200 border-emerald-200 text-emerald-800',
    bubbleColor: 'bg-emerald-50 text-emerald-900 border-emerald-100',
    primaryColor: 'emerald',
    systemPrompt: `Kamu adalah 'Pro-Bot', asisten akademis dan perencana karier yang sangat cerdas, terstruktur, dan profesional namun tetap ramah mahasiswa.
Gunakan bahasa Indonesia yang baik, rapi, informatif, dan sangat terorganisir (gunakan poin-poin/bullet points jika diperlukan).
Bantulah pengguna membuat outline skripsi, persiapan wawancara magang, tips belajar efektif, beasiswa, dan merumuskan ide-ide akademis secara tajam.`
  }
};

const MOTIVATIONAL_QUOTES = [
  "“Gak apa-apa capek, namanya juga lagi berjuang. Tapi jangan lupa napas dan istirahat ya.” — Kak Senja 🌅",
  "“Skripsi yang baik adalah skripsi yang selesai, bukan yang sempurna tanpa batas.” — Pro-Bot 🎓",
  "“Santai aja bro, hari esok masih ada. Satu langkah kecil lebih baik daripada diem doang.” — Bro AI 🛹",
  "“You are doing great fr fr! Jangan dibandingin speed orang lain sama speed kamu ✨” — Z-Geni 🔥",
  "“Kegagalan hari ini cuma plot twist sebelum kamu dapet happy ending-mu.” 🌟"
];

const INITIAL_MOODS = [
  { emoji: '🤩', label: 'Ambis', desc: 'Lagi semangat belajar!', text: 'Aku lagi semangat banget belajar nih! Kasih aku tantangan/ide produktif dong.' },
  { emoji: '🤯', label: 'Burnout', desc: 'Capek tugas numpuk', text: 'Aku capek banget, tugas numpuk parah. Butuh dengerin curhatku sebentar.' },
  { emoji: '🫠', label: 'Gabut', desc: 'Gak tahu mau ngapain', text: 'Lagi super gabut nih. Kasih rekomendasi aktivitas seru atau obrolan santai dong.' },
  { emoji: '🥺', label: 'Overthinking', desc: 'Mikirin masa depan', text: 'Lagi overthinking soal masa depan/karier. Gimana caranya biar tetap tenang ya?' },
  { emoji: '🍵', label: 'Santai', desc: 'Lagi mau rileks', text: 'Lagi rileks sore sambil minum teh. Pengen denger quotes indah penenang jiwa.' }
];

export default function App() {
  const [selectedBot, setSelectedBot] = useState('senja');
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'bot',
      text: 'Halo! Aku **Kak Senja**. Selamat datang di **SambatAI**, ruang aman kamu buat sambat (curhat) atau diskusi ambis (tugas & karier).\n\nSebelum kita ngobrol, **bagaimana mood kamu hari ini?** Pilih salah satu emoji mood di atas ya! ✨',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [customApiKey, setCustomApiKey] = useState('');
  const [showConfig, setShowConfig] = useState(false);
  const [showNotification, setShowNotification] = useState(null);
  
  const [currentMood, setCurrentMood] = useState(null);

  const [pomoTime, setPomoTime] = useState(25 * 60); 
  const [pomoActive, setPomoActive] = useState(false);
  const [pomoMode, setPomoMode] = useState('study'); 
  const [isPomoOpen, setIsPomoOpen] = useState(false); // Tambahan state untuk kontrol popup

  // State dan Ref untuk Logika Menggeser (Drag & Drop)
  const [pomoOffset, setPomoOffset] = useState({ x: 0, y: 0 });
  const dragRef = useRef({ isDragging: false, startX: 0, startY: 0, initX: 0, initY: 0, hasMoved: false });

  const [soundPlaying, setSoundPlaying] = useState(false);
  const audioContextRef = useRef(null);

  const [showTour, setShowTour] = useState(true);
  const [tourStep, setTourStep] = useState(0);

  const [activeQuote, setActiveQuote] = useState(MOTIVATIONAL_QUOTES[0]);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    let interval = null;
    if (pomoActive && pomoTime > 0) {
      interval = setInterval(() => {
        setPomoTime((prev) => prev - 1);
      }, 1000);
    } else if (pomoTime === 0 && pomoActive) {
      clearInterval(interval);
      if (pomoMode === 'study') {
        setPomoMode('break');
        setPomoTime(5 * 60);
        triggerNotification('Waktu belajar selesai! Waktunya istirahat 5 menit ☕');
      } else {
        setPomoMode('study');
        setPomoTime(25 * 60);
        triggerNotification('Waktu istirahat selesai! Yuk lanjut fokus lagi 💪');
      }
      setPomoActive(false);
    }
    return () => clearInterval(interval);
  }, [pomoActive, pomoTime, pomoMode]);

  const rollNewQuote = () => {
    const randomIndex = Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length);
    setActiveQuote(MOTIVATIONAL_QUOTES[randomIndex]);
    triggerNotification('Kutipan inspirasi harian diperbarui!');
  };

  // Fungsi-fungsi Pengontrol Geser (Pointer Events)
  const handlePointerDown = (e) => {
    // Hanya izinkan menggeser dari elemen yang ditandai dengan class 'drag-handle'
    if (!e.target.closest('.drag-handle')) return;
    
    dragRef.current = {
      isDragging: true,
      startX: e.clientX,
      startY: e.clientY,
      initX: pomoOffset.x,
      initY: pomoOffset.y,
      hasMoved: false
    };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e) => {
    if (!dragRef.current.isDragging) return;
    
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;
    
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
      dragRef.current.hasMoved = true;
    }

    setPomoOffset({
      x: dragRef.current.initX + dx,
      y: dragRef.current.initY + dy
    });
  };

  const handlePointerUp = (e) => {
    if (dragRef.current.isDragging) {
      dragRef.current.isDragging = false;
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch (err) {}
    }
  };

  const toggleSoundscape = () => {
    if (soundPlaying) {
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
      setSoundPlaying(false);
      triggerNotification('Soundscape relaksasi dinonaktifkan.');
    } else {
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) {
          triggerNotification('Fitur audio tidak didukung di browser ini.');
          return;
        }
        
        const ctx = new AudioContext();
        audioContextRef.current = ctx;

        const bufferSize = 2 * ctx.sampleRate;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          output[i] = Math.random() * 2 - 1;
        }

        const whiteNoise = ctx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;

        const lowpassFilter = ctx.createBiquadFilter();
        lowpassFilter.type = 'lowpass';
        lowpassFilter.frequency.setValueAtTime(350, ctx.currentTime);
        lowpassFilter.Q.setValueAtTime(1, ctx.currentTime);

        const gainNode = ctx.createGain();
        gainNode.gain.setValueAtTime(0.12, ctx.currentTime);

        whiteNoise.connect(lowpassFilter);
        lowpassFilter.connect(gainNode);
        gainNode.connect(ctx.destination);

        whiteNoise.start();
        setSoundPlaying(true);
        triggerNotification('Soundscape Hujan Lembut aktif! 🎧');
      } catch (err) {
        console.error(err);
        triggerNotification('Gagal mengaktifkan soundscape.');
      }
    }
  };

  const handleBotChange = (botId) => {
    setSelectedBot(botId);
    setSidebarOpen(false);
    setCurrentMood(null);
    
    let welcomeMessage = '';
    switch(botId) {
      case 'senja':
        welcomeMessage = 'Halo! Aku **Kak Senja**. Selamat datang kembali di ruang amanmu. Ada keluh kesah hari ini, atau mau diskusi santai sambil minum kopi? Aku siap dengerin kok. Pilih mood kamu di atas ya!';
        break;
      case 'bro':
        welcomeMessage = 'Yo! **Bro AI** di sini. Ada berita apa hari ini? Santai aja, kalau ada tugas yang bikin pusing atau mau nanya trik gokil langsung gas tanyain! Pilih mood lu dulu biar asik.';
        break;
      case 'geni':
        welcomeMessage = 'OMG HELLO bestie! 💅 **Z-Geni** is in the houseee ✨ Siap nemenin kamu masak ide-ide gokil hari ini! Spill dong apa yang lagi bikin kamu kepikiran? Tap emoji mood kamu dulu dong!';
        break;
      case 'pro':
        welcomeMessage = 'Selamat datang. Saya **Pro-Bot**, asisten akademis Anda. Mari kita diskusikan riset, tugas, atau persiapan karier Anda secara terstruktur hari ini. Tentukan kondisi kesiapan belajar Anda melalui emoji mood di atas.';
        break;
      default:
        welcomeMessage = 'Halo! Ada yang bisa kubantu hari ini?';
    }

    setMessages([
      {
        id: Date.now().toString(),
        sender: 'bot',
        text: welcomeMessage,
        timestamp: new Date()
      }
    ]);
  };

  const callGeminiAPI = async (userQuery, systemPrompt) => {
    // Variabel kunci ini dibiarkan kosong agar sistem preview bisa menyuntikkan key otomatis
    const apiKey = ""; 
    const activeKey = customApiKey.trim() !== '' ? customApiKey.trim() : apiKey;
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${activeKey}`;

    const payload = {
      contents: [{ parts: [{ text: userQuery }] }],
      systemInstruction: { parts: [{ text: systemPrompt }] }
    };

    let delay = 1000;
    const maxRetries = 5;

    for (let i = 0; i < maxRetries; i++) {
      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        if (response.ok) {
          const result = await response.json();
          const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text) return text;
          throw new Error('Respon API kosong');
        }

        if (response.status === 429) {
          await new Promise(resolve => setTimeout(resolve, delay));
          delay *= 2;
          continue;
        }

        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error?.message || `HTTP error! status: ${response.status}`);
      } catch (err) {
        if (i === maxRetries - 1) {
          throw err;
        }
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= 2;
      }
    }
  };

  const handleSendMessage = async (textToSend) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const newUserMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: text,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newUserMessage]);
    if (!textToSend) setInputText('');
    setIsTyping(true);

    try {
      const currentBot = PERSONALITIES[selectedBot];
      let contextQuery = text;
      if (currentMood) {
        contextQuery = `[Konteks Mood Pengguna Saat Ini: ${currentMood.label} - ${currentMood.desc}]. Pertanyaan pengguna: ${text}`;
      }

      const botResponse = await callGeminiAPI(contextQuery, currentBot.systemPrompt);
      
      setMessages(prev => [...prev, {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: botResponse,
        timestamp: new Date()
      }]);
    } catch (err) {
      console.error(err);
      let errorMessage = "Koneksi sedang bermasalah. Coba lagi ya!";
      setMessages(prev => [...prev, {
        id: `err-${Date.now()}`,
        sender: 'bot',
        text: `${errorMessage}\n\n*(Detail Error: ${err.message || 'Gagal terhubung'})*`,
        timestamp: new Date(),
        isError: true
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleMoodSelect = (mood) => {
    setCurrentMood(mood);
    triggerNotification(`Mood diatur ke: ${mood.emoji} ${mood.label}`);
    handleSendMessage(mood.text);
  };

  const playSpeech = (textToSpeak) => {
    if (!window.speechSynthesis) {
      triggerNotification('Browser Anda tidak mendukung Text-to-Speech.');
      return;
    }
    
    window.speechSynthesis.cancel();
    
    const cleanText = textToSpeak
      .replace(/\*\*([^*]+)\*\*/g, '$1')
      .replace(/`([^`]+)`/g, '$1')
      .replace(/#[^\n]+/g, '')
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'id-ID'; 
    
    if (selectedBot === 'senja') {
      utterance.rate = 0.95; 
      utterance.pitch = 1.0;
    } else if (selectedBot === 'bro') {
      utterance.rate = 1.1; 
      utterance.pitch = 0.9;
    } else if (selectedBot === 'geni') {
      utterance.rate = 1.15; 
      utterance.pitch = 1.2;
    } else {
      utterance.rate = 1.0; 
      utterance.pitch = 1.0;
    }

    window.speechSynthesis.speak(utterance);
    triggerNotification(`Suara ${PERSONALITIES[selectedBot].name} dibacakan...`);
  };

  const stopSpeech = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      triggerNotification('Pembacaan suara dihentikan.');
    }
  };

  const formatPomoTime = () => {
    const mins = Math.floor(pomoTime / 60);
    const secs = pomoTime % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const renderMessageContent = (text) => {
    if (typeof text !== 'string') return <div className="text-slate-700" />;
    
    let formatted = text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    formatted = formatted.replace(/```([\s\S]*?)```/g, (match, code) => {
      return `<pre class="bg-slate-900 text-teal-300 p-4 rounded-2xl my-3 font-mono text-xs overflow-x-auto border border-slate-800">${code.trim()}</pre>`;
    });

    formatted = formatted.replace(/`([^`]+)`/g, '<code class="bg-slate-100 text-teal-700 px-2 py-1 rounded-lg font-mono text-xs border border-slate-200">$1</code>');

    formatted = formatted.replace(/\*\*([^*]+)\*\*/g, '<strong class="font-bold text-slate-800">$1</strong>');

    formatted = formatted.replace(/^\s*[-*]\s+(.+)$/gm, '<li class="list-disc ml-4 my-1 text-slate-700">$1</li>');

    formatted = formatted.replace(/\n/g, '<br />');

    return <div className="text-slate-700" dangerouslySetInnerHTML={{ __html: formatted }} />;
  };

  const triggerNotification = (msg) => {
    setShowNotification(msg);
    setTimeout(() => {
      setShowNotification(null);
    }, 3500);
  };

  const handleClearChat = () => {
    handleBotChange(selectedBot);
    triggerNotification('Riwayat percakapan dibersihkan!');
  };

  const tourSteps = [
    {
      title: "Selamat datang di SambatAI! 🎉",
      desc: "Aplikasi asisten chatbot interaktif yang cerah, menenangkan, dan ramah pemula. Yuk ikut tur singkat ini untuk kenal fiturnya!",
    },
    {
      title: "Pilih Teman Obrolanmu 🎭",
      desc: "Kamu bisa mengganti karakter bot di sidebar kiri. Ada Kak Senja yang menenangkan, Bro AI yang asik, Z-Geni yang heboh, atau Pro-Bot untuk bantu skripsi!",
    },
    {
      title: "Mood Tracker Harian 🤩",
      desc: "Tentukan mood kamu sebelum chat melalui daftar emoji di atas percakapan. AI akan menyesuaikan gaya bicaranya berdasarkan perasaanmu!",
    },
    {
      title: "Ruang Belajar Pomodoro ⏱️",
      desc: "Butuh fokus mengerjakan tugas kuliah? Gunakan Pomodoro Timer terintegrasi di pojok kanan bawah agar belajarmu lebih terstruktur.",
    },
    {
      title: "Relaxing Ambient Soundscape 🎧",
      desc: "Nyalakan soundscape hujan lembut sintetis di bagian atas aplikasi untuk membantumu fokus dan rileks saat membaca balasan AI."
    }
  ];

  const handleNextTour = () => {
    if (tourStep < tourSteps.length - 1) {
      setTourStep(tourStep + 1);
    } else {
      setShowTour(false);
      triggerNotification("Selamat mengobrol! Semoga harimu menyenangkan ✨");
    }
  };

  return (
    <div className="flex h-screen bg-stone-50 text-slate-800 font-sans overflow-hidden">
      
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        ::-webkit-scrollbar {
          width: 6px;
        }
        ::-webkit-scrollbar-track {
          background: transparent;
        }
        ::-webkit-scrollbar-thumb {
          background: #E2E8F0;
          border-radius: 99px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #CBD5E1;
        }
      `}} />

      {/* Modal Panduan */}
      {showTour && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl border border-emerald-100 p-6 md:p-8 max-w-md w-full shadow-2xl text-center space-y-6 relative overflow-hidden">
            <div className="absolute -top-12 -left-12 w-28 h-28 bg-emerald-50 rounded-full blur-2xl" />
            <div className="absolute -bottom-12 -right-12 w-28 h-28 bg-amber-50 rounded-full blur-2xl" />
            
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-tr from-emerald-100 to-amber-100 text-emerald-700 rounded-2xl mx-auto flex items-center justify-center text-2xl font-bold shadow-sm">
                💡
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-extrabold text-slate-800 tracking-tight">
                {tourSteps[tourStep].title}
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                {tourSteps[tourStep].desc}
              </p>
            </div>

            <div className="flex justify-center gap-1.5">
              {tourSteps.map((_, i) => (
                <span 
                  key={i} 
                  className={`h-1.5 rounded-full transition-all duration-300 ${i === tourStep ? 'w-6 bg-emerald-600' : 'w-1.5 bg-slate-200'}`} 
                />
              ))}
            </div>

            <div className="flex gap-3 justify-center pt-2">
              <button 
                onClick={() => setShowTour(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-slate-600 transition"
              >
                Lewati Panduan
              </button>
              <button 
                onClick={handleNextTour}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-md shadow-emerald-200 flex items-center gap-1.5"
              >
                {tourStep === tourSteps.length - 1 ? 'Mulai Sekarang! 🚀' : 'Lanjut'}
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {showNotification && (
        <div className="fixed top-5 right-5 z-50 bg-white border border-emerald-100 text-emerald-800 px-4 py-3 rounded-2xl shadow-xl shadow-emerald-100 flex items-center gap-2.5 animate-fade-in">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span className="text-xs font-bold tracking-wide">{showNotification}</span>
        </div>
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-40 w-80 bg-stone-50 border-r border-stone-200 flex flex-col transform transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-5 border-b border-stone-200 flex justify-between items-center bg-stone-100/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-md shadow-emerald-200">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-black text-lg tracking-tight text-slate-800 flex items-center gap-1">
                SambatAI <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">Muda</span>
              </h1>
              <p className="text-[10px] text-emerald-700 font-mono tracking-wider uppercase font-semibold">Teman Santai & Ambis</p>
            </div>
          </div>
          <button 
            className="md:hidden p-2 rounded-xl hover:bg-slate-200 text-slate-500 hover:text-slate-800"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          <div>
            <div className="flex items-center justify-between px-2 mb-3">
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Ganti Karakter AI 🎭
              </h2>
              <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">4 Pilihan</span>
            </div>
            <div className="space-y-2.5">
              {Object.values(PERSONALITIES).map((bot) => (
                <button
                  key={bot.id}
                  onClick={() => handleBotChange(bot.id)}
                  className={`
                    w-full text-left p-3 rounded-2xl border transition-all duration-300 flex gap-3.5 items-start
                    ${selectedBot === bot.id 
                      ? 'bg-white border-emerald-500/40 shadow-sm shadow-emerald-100' 
                      : 'bg-stone-50 border-transparent hover:bg-white hover:border-slate-200'}
                  `}
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${bot.themeClass} flex items-center justify-center text-2xl shrink-0 shadow-sm`}>
                    {bot.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-slate-800 truncate">{bot.name}</span>
                      {selectedBot === bot.id && (
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-500 font-semibold block">{bot.role}</span>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                      {bot.description}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-stone-200 bg-stone-100/50 space-y-3">
          <button 
            onClick={() => setShowConfig(!showConfig)}
            className="w-full py-2 px-3 rounded-xl text-xs bg-white hover:bg-slate-50 border border-stone-200 transition flex items-center justify-between font-semibold text-slate-600 shadow-sm"
          >
            <span className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" />
              API Key Sendiri (Opsional)
            </span>
            <span className="text-[9px] bg-slate-100 text-slate-600 px-2 py-1 rounded-md font-bold uppercase">
              {customApiKey ? 'Aktif' : 'Bawaan'}
            </span>
          </button>

          {showConfig && (
            <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-3 animate-fade-in shadow-inner">
              <p className="text-xs text-slate-500 leading-relaxed">
                Gunakan kunci API Google Gemini Anda sendiri jika kuota bawaan sedang sibuk:
              </p>
              <input
                type="password"
                placeholder="Masukkan API Key Gemini..."
                value={customApiKey}
                onChange={(e) => setCustomApiKey(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-mono shadow-inner"
              />
              {customApiKey && (
                <button 
                  onClick={() => { setCustomApiKey(''); triggerNotification('Menggunakan API default kembali.'); }}
                  className="text-[10px] text-rose-500 hover:underline block text-right font-semibold"
                >
                  Hapus & Reset
                </button>
              )}
            </div>
          )}

          <div className="flex items-center justify-between text-[11px] text-slate-500 px-1 pt-1">
            <span className="flex items-center gap-1.5 font-medium">
              <Coffee className="w-4 h-4 text-emerald-600" />
              Aplikasi Rileks
            </span>
            <button 
              onClick={() => { setTourStep(0); setShowTour(true); }}
              className="text-emerald-700 hover:underline flex items-center gap-1 font-semibold"
            >
              <Info className="w-3.5 h-3.5" />
              Bantuan
            </button>
          </div>
        </div>
      </div>

      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-full bg-stone-50 relative">
        
        <header className="h-20 border-b border-stone-200 px-4 md:px-6 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-10 shadow-sm">
          <div className="flex items-center gap-3">
            <button 
              className="md:hidden p-2 rounded-xl hover:bg-slate-100 text-slate-600"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
            
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${PERSONALITIES[selectedBot].themeClass} flex items-center justify-center text-2xl shadow-inner shrink-0`}>
                {PERSONALITIES[selectedBot].avatar}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-extrabold text-sm md:text-base text-slate-800 tracking-tight">
                    {PERSONALITIES[selectedBot].name}
                  </h2>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                </div>
                <p className="text-xs text-slate-500 font-semibold flex items-center gap-1">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                  {PERSONALITIES[selectedBot].role}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleSoundscape}
              className={`p-2.5 rounded-2xl border transition-all flex items-center gap-1.5 text-xs font-bold shadow-sm
                ${soundPlaying 
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-700 animate-pulse' 
                  : 'bg-white border-stone-200 text-slate-600 hover:bg-slate-50'}`}
              title="Suara Musik Latar Belakang Tenang"
            >
              {soundPlaying ? <Volume2 className="w-4 h-4 text-emerald-600" /> : <Volume2 className="w-4 h-4" />}
              <span className="hidden lg:inline">{soundPlaying ? 'Soundscape Aktif' : 'Nyalakan Hujan 🎧'}</span>
            </button>

            <button
              onClick={handleClearChat}
              className="p-2.5 rounded-2xl bg-white hover:bg-rose-50 text-slate-500 hover:text-rose-600 border border-stone-200 hover:border-rose-200 transition-colors flex items-center gap-1.5 text-xs font-bold shadow-sm"
              title="Mulai Ulang Percakapan"
            >
              <Trash2 className="w-4 h-4" />
              <span className="hidden sm:inline">Reset Obrolan</span>
            </button>
          </div>
        </header>

        <div className="bg-gradient-to-r from-emerald-50/80 via-amber-50/80 to-teal-50/80 border-b border-stone-200 px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-lg">✨</span>
            <p className="text-slate-600 italic font-medium leading-relaxed text-center sm:text-left">
              {activeQuote}
            </p>
          </div>
          <button 
            onClick={rollNewQuote}
            className="text-[10px] bg-white border border-stone-200 hover:bg-stone-100 text-slate-600 px-3 py-1.5 rounded-full font-bold transition shrink-0 shadow-sm"
          >
            Minta Kata Bijak Lain 🔮
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm max-w-2xl mx-auto space-y-4">
            <div className="text-center">
              <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full">
                {currentMood ? `Mood Kamu: ${currentMood.emoji} ${currentMood.label}` : 'Lagi gimana perasaanmu saat ini? 🧐'}
              </span>
              <p className="text-xs text-slate-400 mt-2">
                AI akan merespons obrolanmu dengan pendekatan empati yang sesuai
              </p>
            </div>
            
            <div className="grid grid-cols-5 gap-2 pt-1">
              {INITIAL_MOODS.map((m) => (
                <button
                  key={m.label}
                  onClick={() => handleMoodSelect(m)}
                  className={`
                    flex flex-col items-center p-3 rounded-2xl border transition-all duration-300
                    ${currentMood?.label === m.label 
                      ? 'bg-emerald-50 border-emerald-300 scale-105 shadow-sm' 
                      : 'bg-stone-50 border-transparent hover:bg-white hover:border-slate-200'}
                  `}
                >
                  <span className="text-2xl mb-1">{m.emoji}</span>
                  <span className="text-[10px] font-bold text-slate-700">{m.label}</span>
                </button>
              ))}
            </div>
          </div>

          {messages.map((msg) => {
            const isBot = msg.sender === 'bot';
            return (
              <div 
                key={msg.id}
                className={`flex gap-3 md:gap-4 ${isBot ? 'justify-start' : 'justify-end'} animate-fade-in`}
              >
                {isBot && (
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${PERSONALITIES[selectedBot].themeClass} flex items-center justify-center text-lg shadow-sm shrink-0 self-end mb-1`}>
                    {PERSONALITIES[selectedBot].avatar}
                  </div>
                )}

                <div className={`max-w-[85%] md:max-w-[70%] flex flex-col`}>
                  <div className={`
                    px-5 py-3 rounded-3xl text-sm leading-relaxed border relative group/bubble
                    ${isBot 
                      ? `${PERSONALITIES[selectedBot].bubbleColor} rounded-bl-none shadow-sm` 
                      : 'bg-emerald-600 border-emerald-500 text-white rounded-br-none shadow-md shadow-emerald-200'}
                  `}>
                    {isBot ? (
                      renderMessageContent(msg.text)
                    ) : (
                      <p className="font-medium text-white">{msg.text}</p>
                    )}

                    {isBot && !msg.isError && (
                      <div className="absolute right-3 -bottom-4 bg-white border border-stone-200 rounded-full px-2 py-1 flex items-center gap-1.5 opacity-0 group-hover/bubble:opacity-100 transition-opacity duration-200 shadow-sm z-20">
                        <button
                          onClick={() => playSpeech(msg.text)}
                          className="p-1 hover:bg-slate-100 rounded-full text-slate-500 hover:text-emerald-700 transition"
                          title="Bacakan Balasan Suara"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={stopSpeech}
                          className="p-1 hover:bg-slate-100 rounded-full text-slate-400 hover:text-rose-600 transition"
                          title="Hentikan Suara"
                        >
                          <VolumeX className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                  <span className={`text-[10px] text-slate-400 font-semibold mt-2 ${isBot ? 'text-left pl-2' : 'text-right pr-2'}`}>
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                {!isBot && (
                  <div className="w-10 h-10 rounded-xl bg-white border border-stone-200 flex items-center justify-center text-emerald-700 shadow-sm shrink-0 self-end mb-1">
                    <User className="w-5 h-5" />
                  </div>
                )}
              </div>
            );
          })}

          {isTyping && (
            <div className="flex gap-3 justify-start animate-pulse">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${PERSONALITIES[selectedBot].themeClass} flex items-center justify-center text-lg shrink-0 self-end mb-1`}>
                {PERSONALITIES[selectedBot].avatar}
              </div>
              <div className="flex flex-col">
                <div className={`px-5 py-4 rounded-3xl rounded-bl-none text-sm ${PERSONALITIES[selectedBot].bubbleColor} border flex items-center gap-2`}>
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 md:p-6 border-t border-stone-200 bg-white">
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
            className="relative flex items-center max-w-4xl mx-auto"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={`Ngobrol atau sambat apa aja dengan ${PERSONALITIES[selectedBot].name}...`}
              className="w-full bg-stone-50 border border-slate-200 text-slate-800 placeholder-slate-400 text-sm pl-5 pr-16 py-4 rounded-3xl focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all shadow-inner"
              disabled={isTyping}
            />
            
            <div className="absolute right-2.5 flex items-center gap-1">
              <button
                type="submit"
                disabled={!inputText.trim() || isTyping}
                className={`
                  p-3 rounded-2xl flex items-center justify-center transition-all
                  ${inputText.trim() && !isTyping
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-200' 
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'}
                `}
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </form>

          <div className="mt-4 max-w-4xl mx-auto flex flex-wrap gap-2 items-center justify-between text-[11px] text-slate-400 px-2">
          <p className="flex items-center gap-1.5 font-medium text-slate-500">
            <BookOpen className="w-4 h-4 text-emerald-600" />
            Ingin fokus? Coba aktifkan fitur Pomodoro di sebelah kanan bawah layar!
          </p>
          <p className="font-mono text-[10px] font-bold uppercase text-slate-300">SambatAI • Stable Build</p>
        </div>
      </div>

      {/* FITUR POMODORO TIMER DOCK (POPUP VERSI BARU - BISA DIGESER) */}
      <div 
        className="absolute bottom-28 right-4 md:right-8 z-30 flex flex-col items-end"
        style={{ transform: `translate(${pomoOffset.x}px, ${pomoOffset.y}px)` }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        
        {/* Tampilan Timer Pop-up (Terbuka) */}
        {isPomoOpen && (
          <div className="bg-white border border-stone-200 rounded-3xl p-5 shadow-xl shadow-slate-200 w-64 space-y-4 mb-4 animate-fade-in origin-bottom-right">
            <div className="flex items-center justify-between drag-handle cursor-move touch-none pb-1" title="Geser dari sini">
              <span className="flex items-center gap-1.5 text-xs font-black text-slate-700 pointer-events-none">
                <Coffee className="w-5 h-5 text-emerald-600" />
                Ruang Fokus
              </span>
              <div className="flex items-center gap-1.5">
                <Move className="w-4 h-4 text-slate-400 pointer-events-none" />
                <button 
                  onClick={(e) => {
                    if (dragRef.current.hasMoved) return; // Mencegah popup tertutup saat digeser
                    e.stopPropagation();
                    setIsPomoOpen(false);
                  }}
                  className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-100 rounded-full transition cursor-pointer"
                  title="Kecilkan Timer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="text-center">
                <span className="text-4xl font-black text-slate-800 tracking-tight font-mono block">
                  {formatPomoTime()}
                </span>
                <span className={`text-[9px] font-bold px-2 py-1 rounded-full uppercase mt-2 inline-block
                  ${pomoMode === 'study' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}`}>
                  {pomoMode === 'study' ? 'Fokus Tugas' : 'Istirahat'}
                </span>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setPomoActive(!pomoActive)}
                  className={`flex-1 py-2 px-3 rounded-2xl text-xs font-bold transition flex items-center justify-center gap-1.5
                    ${pomoActive 
                      ? 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200' 
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm shadow-emerald-200'}`}
                >
                  {pomoActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  {pomoActive ? 'Jeda' : 'Mulai'}
                </button>
                
                <button
                type="button"
                onClick={() => { setPomoActive(false); setPomoTime(pomoMode === 'study' ? 25 * 60 : 5 * 60); }}
                className="p-2 rounded-2xl border border-slate-200 hover:bg-slate-100 text-slate-500 transition"
                title="Reset Timer"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Tampilan Ikon Singkat (Tertutup) */}
        {!isPomoOpen && (
          <button
            onClick={(e) => {
              if (dragRef.current.hasMoved) {
                e.preventDefault();
                e.stopPropagation();
                return; // Mencegah popup terbuka saat digeser
              }
              setIsPomoOpen(true);
            }}
            className={`drag-handle cursor-move touch-none flex items-center gap-2 p-3.5 rounded-full shadow-lg transition-transform hover:scale-105 border animate-fade-in
              ${pomoActive 
                ? 'bg-emerald-600 border-emerald-500 text-white shadow-emerald-200 animate-pulse' 
                : 'bg-white border-stone-200 text-slate-600 hover:bg-slate-50'}`}
            title="Buka Ruang Fokus (Bisa digeser)"
          >
            <Coffee className={`w-5 h-5 pointer-events-none ${pomoActive ? 'text-white' : 'text-emerald-600'}`} />
            {pomoActive && (
              <span className="font-mono font-bold text-sm pr-1 pointer-events-none">{formatPomoTime()}</span>
            )}
          </button>
        )}

      </div>

    </div>
  </div>
);
}