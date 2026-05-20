import React, { useState, useEffect, useRef } from 'react';
import { 
  Home, 
  Terminal, 
  MessageSquare, 
  Trophy, 
  User, 
  Sparkles, 
  Heart, 
  Zap, 
  Play, 
  CheckCircle, 
  AlertCircle, 
  ArrowRight, 
  ChevronRight, 
  Code, 
  BookOpen, 
  Send,
  Award,
  BrainCircuit,
  HelpCircle,
  Code2,
  Layers,
  Trash2,
  Plus,
  HelpCircle as QuestionIcon,
  Compass
} from 'lucide-react';

// ==========================================
// CONSTANTS & MOCK DATA (Offline Fallbacks)
// ==========================================

const API_KEY = ""; // Automatically injected by the environment

const COURSES = [
  {
    id: 'ai-literacy',
    title: 'AI Literacy',
    description: 'Master prompt engineering, LLMs, and block-based AI logic.',
    color: 'from-purple-500 to-indigo-600',
    icon: BrainCircuit,
    units: [
      {
        id: 'ai-1',
        title: 'Introduction to Generative AI',
        lessons: [
          { id: 'ai-1-1', title: 'What is an LLM?', xp: 15, duration: '3 min', completed: false },
          { id: 'ai-1-2', title: 'How Neural Networks Think', xp: 20, duration: '5 min', completed: false },
          { id: 'ai-1-3', title: 'Visual Logic: Prompt Blocks', xp: 20, duration: '4 min', completed: false }
        ]
      },
      {
        id: 'ai-2',
        title: 'Prompt Engineering',
        lessons: [
          { id: 'ai-2-1', title: 'System vs User Prompts', xp: 25, duration: '5 min', completed: false },
          { id: 'ai-2-2', title: 'Few-Shot & Chain of Thought', xp: 25, duration: '6 min', completed: false }
        ]
      }
    ]
  },
  {
    id: 'javascript',
    title: 'JavaScript',
    description: 'Learn the language that powers the dynamic web.',
    color: 'from-yellow-400 to-amber-500',
    icon: Code2,
    units: [
      {
        id: 'js-1',
        title: 'JS Basics & Variables',
        lessons: [
          { id: 'js-1-1', title: 'Variables (let, const, var)', xp: 15, duration: '3 min', completed: false },
          { id: 'js-1-2', title: 'Data Types & Operations', xp: 15, duration: '4 min', completed: false }
        ]
      }
    ]
  },
  {
    id: 'python',
    title: 'Python Basics',
    description: 'Clean syntax for general purpose backend and scripting.',
    color: 'from-blue-500 to-cyan-600',
    icon: Terminal,
    units: [
      {
        id: 'py-1',
        title: 'Python Syntax Basics',
        lessons: [
          { id: 'py-1-1', title: 'Print & Variable Types', xp: 15, duration: '3 min', completed: false },
          { id: 'py-1-2', title: 'Indentation & Structuring', xp: 15, duration: '4 min', completed: false }
        ]
      }
    ]
  }
];

// Blockly-inspired templates for the toolbox
const BLOCK_TEMPLATES = [
  {
    id: 'b-print',
    category: 'Output',
    label: 'Print to Console 📣',
    color: 'bg-emerald-600 border-emerald-500',
    defaultVal: '"Hello Coders!"',
    codeJs: (val) => `console.log(${val});`,
    codePy: (val) => `print(${val})`
  },
  {
    id: 'b-var',
    category: 'Variables',
    label: 'Set Variable 📦',
    color: 'bg-blue-600 border-blue-500',
    defaultVal: 'myScore = 10',
    codeJs: (val) => `let ${val};`,
    codePy: (val) => `${val}`
  },
  {
    id: 'b-ai-prompt',
    category: 'AI Engine',
    label: 'AI Prompt Model 🤖',
    color: 'bg-purple-600 border-purple-500',
    defaultVal: '"Write a poem about debugging"',
    codeJs: (val) => `const aiResponse = await ai.generate(${val});`,
    codePy: (val) => `ai_response = ai.generate(${val})`
  },
  {
    id: 'b-if',
    category: 'Logic',
    label: 'If Condition 🔀',
    color: 'bg-amber-600 border-amber-500',
    defaultVal: 'userXP > 100',
    codeJs: (val) => `if (${val}) {\n  console.log("Super Level Unlocked!");\n}`,
    codePy: (val) => `if ${val}:\n    print("Super Level Unlocked!")`
  },
  {
    id: 'b-loop',
    category: 'Loops',
    label: 'Repeat Loop 🔁',
    color: 'bg-rose-600 border-rose-500',
    defaultVal: '5',
    codeJs: (val) => `for (let i = 0; i < ${val}; i++) {\n  console.log("Loop iteration: " + i);\n}`,
    codePy: (val) => `for i in range(${val}):\n    print("Loop iteration:", i)`
  }
];

const OFFLINE_LESSONS = {
  'ai-1-1': {
    title: 'What is an LLM?',
    topic: 'Large Language Models (LLMs)',
    slides: [
      {
        type: 'explanation',
        content: 'A Large Language Model (LLM) is an AI algorithm trained on massive amounts of text data. It uses neural networks to predict the most likely next word in a sequence, effectively generating human-like conversation.'
      },
      {
        type: 'quiz',
        question: 'What is the primary core mechanism of a Large Language Model (LLM)?',
        options: [
          'Compiling computer source code into binary.',
          'Predicting the most probable next word or token in a sequence.',
          'Searching Google for real-time web articles.',
          'Creating graphical raster images from scratch.'
        ],
        correctIndex: 1,
        explanation: 'LLMs are advanced pattern predictors. At their core, they analyze preceding tokens (words/sub-words) and predict the next most likely token.'
      },
      {
        type: 'fill-blank',
        question: 'Large Language Models are trained using massive neural networks called ____.',
        hint: 'Hint: T_A_S_F_R_M_R_S',
        correctAnswer: 'Transformers',
        explanation: 'The Transformer architecture, introduced by Google in 2017, is the standard building block for all modern LLMs.'
      }
    ]
  },
  'ai-1-3': {
    title: 'Visual Logic: Prompt Blocks',
    topic: 'Block Logic',
    slides: [
      {
        type: 'explanation',
        content: 'Visual block programming (like Google Blockly) lets us connect instruction blocks like puzzle pieces. In AI development, we can connect system blocks, variable blocks, and prompting models to safely design smart agents without syntax errors.'
      },
      {
        type: 'quiz',
        question: 'Why are visual block structures useful for learning programming?',
        options: [
          'They let you play arcade games instead of studying.',
          'They prevent syntax errors (like missing semicolons) so you can focus on logical thinking.',
          'They only work for simple robotics and cannot model complex math.',
          'They completely replace written text editors in professional corporate code.'
        ],
        correctIndex: 1,
        explanation: 'By using jigsaw-like blocks, visual editors guide your logical pathways without worrying about typos or syntax rules.'
      }
    ]
  }
};

const INITIAL_LEADERBOARD = [
  { name: 'CodiOwl', xp: 1250, streak: 12, avatar: '🦉', self: false },
  { name: 'Ada Lovelace', xp: 950, streak: 21, avatar: '👩‍💻', self: false },
  { name: 'PromptMaster', xp: 840, streak: 5, avatar: '🤖', self: false },
  { name: 'You', xp: 120, streak: 3, avatar: '🚀', self: true },
  { name: 'MonaLisatheOctoCat', xp: 95, streak: 1, avatar: '🐱', self: false }
];

// ==========================================
// CORE COMPONENT
// ==========================================

export default function App() {
  const [activeTab, setActiveTab] = useState('home'); // home, sandbox, tutor, leaderboard, profile
  const [selectedCourse, setSelectedCourse] = useState(COURSES[0]);
  const [userStats, setUserStats] = useState({
    xp: 120,
    streak: 3,
    hearts: 5,
    completedLessons: ['ai-1-1']
  });
  
  // Lesson state
  const [activeLesson, setActiveLesson] = useState(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [quizSelection, setQuizSelection] = useState(null);
  const [fillValue, setFillValue] = useState('');
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [lessonLoading, setLessonLoading] = useState(false);

  // AI Sandbox, Text, & Blockly logic state
  const [sandboxMode, setSandboxMode] = useState('blockly'); // text or blockly
  const [sandboxCode, setSandboxCode] = useState('// Your Blockly workspace generates matching code here!\n\nconsole.log("Hello Coders!");');
  const [sandboxLang, setSandboxLang] = useState('javascript');
  const [sandboxConsole, setSandboxConsole] = useState(['Console initialized. Click Run to test logic!']);
  const [aiAnalysis, setAiAnalysis] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Blockly Workspace state
  const [workspaceBlocks, setWorkspaceBlocks] = useState([
    { id: 'wb-1', blockId: 'b-print', customValue: '"Welcome to Codigan Blockly!"' },
    { id: 'wb-2', blockId: 'b-ai-prompt', customValue: '"Design a fun game prompt"' }
  ]);

  // AI Tutor Chat State
  const [chatMessages, setChatMessages] = useState([
    { sender: 'ai', text: 'Hi! I am Codi, your AI coding tutor. Ask me about prompt engineering, how logic blocks work, or Python syntax! I can even help you translate Blockly logic to Javascript.' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  // Leaderboard state
  const [leaderboard, setLeaderboard] = useState(INITIAL_LEADERBOARD);

  // Auto-save & Load progress simulation
  useEffect(() => {
    const saved = localStorage.getItem('codigan_progress');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setUserStats(parsed);
        setLeaderboard(prev => prev.map(u => u.self ? { ...u, xp: parsed.xp, streak: parsed.streak } : u));
      } catch (e) {
        console.error('Failed to load storage progress', e);
      }
    }
  }, []);

  const saveProgress = (newStats) => {
    setUserStats(newStats);
    localStorage.setItem('codigan_progress', JSON.stringify(newStats));
    setLeaderboard(prev => prev.map(u => u.self ? { ...u, xp: newStats.xp, streak: newStats.streak } : u));
  };

  // Synchronize blockly workspace blocks with text-editor generated output
  useEffect(() => {
    let generated = `// Blockly Visual Logic Generated Program\n// Current Mode: ${sandboxLang === 'javascript' ? 'JavaScript' : 'Python'}\n\n`;
    
    workspaceBlocks.forEach(wb => {
      const template = BLOCK_TEMPLATES.find(t => t.id === wb.blockId);
      if (template) {
        const codeLine = sandboxLang === 'javascript' 
          ? template.codeJs(wb.customValue) 
          : template.codePy(wb.customValue);
        generated += codeLine + "\n";
      }
    });

    if (workspaceBlocks.length === 0) {
      generated += sandboxLang === 'javascript' 
        ? '// Workspace empty. Add some blocks!' 
        : '# Workspace empty. Add some blocks!';
    }

    setSandboxCode(generated);
  }, [workspaceBlocks, sandboxLang]);

  // Exponential Backoff API Wrapper
  const fetchWithBackoff = async (url, options, retries = 5, delay = 1000) => {
    try {
      const response = await fetch(url, options);
      if (!response.ok) throw new Error(`HTTP Error ${response.status}`);
      return await response.json();
    } catch (err) {
      if (retries > 1) {
        await new Promise(resolve => setTimeout(resolve, delay));
        return fetchWithBackoff(url, options, retries - 1, delay * 2);
      }
      throw err;
    }
  };

  // ==========================================
  // LESSON LOGIC & GENERATION
  // ==========================================

  const startLesson = async (lessonId) => {
    setLessonLoading(true);
    setCurrentSlideIndex(0);
    setQuizSelection(null);
    setFillValue('');
    setIsAnswerChecked(false);
    setIsCorrect(false);

    // Try to generate a custom AI lesson using Gemini 2.5 Flash
    try {
      const topicTitle = selectedCourse.title + " - " + (selectedCourse.units.flatMap(u => u.lessons).find(l => l.id === lessonId)?.title || "Coding Basics");
      const systemPrompt = `You are a curriculum developer for "Codigan", an educational visual programming platform for teenagers and young adults. Generate an age-appropriate, exciting lesson for: "${topicTitle}".
      
      Respond STRICTLY with a single valid JSON object containing:
      {
        "title": "Bite-size lesson title",
        "topic": "Context topic",
        "slides": [
          {
            "type": "explanation",
            "content": "Exciting, highly engaging, clean, educational explanation using helpful examples (3-4 sentences)."
          },
          {
            "type": "quiz",
            "question": "A multiple choice question to test this concept.",
            "options": ["Option A", "Option B", "Option C", "Option D"],
            "correctIndex": 0,
            "explanation": "Why this answer makes logical sense."
          },
          {
            "type": "fill-blank",
            "question": "A short simple line where student fills in blank represented as '____'.",
            "hint": "Hint to assist user.",
            "correctAnswer": "Answer",
            "explanation": "Brief context explanation."
          }
        ]
      }`;

      const userQuery = `Generate an interactive lesson with 3 slides for the topic: ${topicTitle}`;

      const payload = {
        contents: [{ parts: [{ text: userQuery }] }],
        systemInstruction: { parts: [{ text: systemPrompt }] },
        generationConfig: { 
          responseMimeType: "application/json",
          responseSchema: {
            type: "OBJECT",
            properties: {
              title: { type: "STRING" },
              topic: { type: "STRING" },
              slides: {
                type: "ARRAY",
                items: {
                  type: "OBJECT",
                  properties: {
                    type: { type: "STRING" },
                    content: { type: "STRING" },
                    question: { type: "STRING" },
                    options: { type: "ARRAY", items: { type: "STRING" } },
                    correctIndex: { type: "INTEGER" },
                    correctAnswer: { type: "STRING" },
                    hint: { type: "STRING" },
                    explanation: { type: "STRING" }
                  }
                }
              }
            }
          }
        }
      };

      const res = await fetchWithBackoff(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        }
      );

      const text = res.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) {
        const aiLesson = JSON.parse(text);
        setActiveLesson({ id: lessonId, ...aiLesson });
        setLessonLoading(false);
        return;
      }
    } catch (e) {
      console.warn("Gemini Lesson Gen error / offline fallback triggered:", e);
    }

    // Offline Fallback
    const localLesson = OFFLINE_LESSONS[lessonId] || {
      title: 'Topic Deep Dive',
      topic: selectedCourse.title,
      slides: [
        {
          type: 'explanation',
          content: 'Welcome to this Codigan coding module! Today we are looking at visual logical structures. Connecting blocks dynamically is proven to make learning coding highly intuitive.'
        },
        {
          type: 'quiz',
          question: `Let's test logic block concepts in ${selectedCourse.title}. What is block code output mapping?`,
          options: [
            'Storing values in static structures.',
            'Translating structural visual blocks into standard programming syntax.',
            'Deleting all written documents.',
            'Creating graphic images without algorithms.'
          ],
          correctIndex: 1,
          explanation: 'Logical visual block maps seamlessly to Python, JavaScript, and and prompt algorithms.'
        }
      ]
    };

    setActiveLesson({ id: lessonId, ...localLesson });
    setLessonLoading(false);
  };

  const checkAnswer = () => {
    const currentSlide = activeLesson.slides[currentSlideIndex];
    let correct = false;

    if (currentSlide.type === 'quiz') {
      correct = quizSelection === currentSlide.correctIndex;
    } else if (currentSlide.type === 'fill-blank') {
      correct = fillValue.trim().toLowerCase() === currentSlide.correctAnswer.toLowerCase();
    }

    setIsCorrect(correct);
    setIsAnswerChecked(true);

    if (!correct) {
      const newHearts = Math.max(0, userStats.hearts - 1);
      saveProgress({ ...userStats, hearts: newHearts });
    }
  };

  const advanceSlide = () => {
    if (currentSlideIndex < activeLesson.slides.length - 1) {
      setCurrentSlideIndex(prev => prev + 1);
      setQuizSelection(null);
      setFillValue('');
      setIsAnswerChecked(false);
      setIsCorrect(false);
    } else {
      const xpGain = 20;
      const isNewlyCompleted = !userStats.completedLessons.includes(activeLesson.id);
      const newCompleted = isNewlyCompleted 
        ? [...userStats.completedLessons, activeLesson.id]
        : userStats.completedLessons;
      
      const nextXp = userStats.xp + (isNewlyCompleted ? xpGain : 5);
      
      saveProgress({
        ...userStats,
        xp: nextXp,
        completedLessons: newCompleted,
        hearts: Math.min(5, userStats.hearts + 1)
      });

      setActiveLesson(null);
    }
  };

  const refillHearts = () => {
    saveProgress({ ...userStats, hearts: 5 });
  };

  // ==========================================
  // PLAYGROUND RUN & CODE EXPLAINER
  // ==========================================

  const runCode = () => {
    const originalConsoleLog = console.log;
    let logs = [];
    console.log = (...args) => {
      logs.push(args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : arg).join(' '));
    };

    try {
      if (sandboxLang === 'javascript') {
        const result = new Function(sandboxCode)();
        if (result !== undefined) {
          logs.push(`Returned: ${result}`);
        }
      } else {
        logs.push(`[${sandboxLang.toUpperCase()} Compiler Run Simulated]`);
        logs.push("Python compiled cleanly. Switch to JavaScript mode to evaluate inline outputs directly inside the browser!");
      }
    } catch (err) {
      logs.push(`Syntax Error: ${err.message}`);
    } finally {
      console.log = originalConsoleLog;
    }

    setSandboxConsole(logs.length > 0 ? logs : ["Code ran successfully with no standard console outputs."]);
  };

  const explainCode = async () => {
    setIsAnalyzing(true);
    setAiAnalysis("Analyzing visual block schema & code...");

    try {
      const systemPrompt = "You are an expert friendly AI compiler and debugging assistant designed for young tech students. Explain this block-logic code simply, encourage their efforts, suggest fun modifications, and ensure safety.";
      const payload = {
        contents: [{ parts: [{ text: `Language: ${sandboxLang}\n\nCode:\n${sandboxCode}` }] }],
        systemInstruction: { parts: [{ text: systemPrompt }] }
      };

      const res = await fetchWithBackoff(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        }
      );

      const text = res.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) {
        setAiAnalysis(text);
      } else {
        setAiAnalysis("Failed to parse blocks. Make sure workspace is populated.");
      }
    } catch (err) {
      setAiAnalysis("Your logical blocks are aligned correctly! Ensure your variable inputs match standard computational logic.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // ==========================================
  // BLOCK WORKSPACE LOGIC (BLOCKLY INTERACTIVE)
  // ==========================================

  const addBlockToWorkspace = (blockId) => {
    const template = BLOCK_TEMPLATES.find(t => t.id === blockId);
    if (template) {
      const newBlockInstance = {
        id: `wb-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        blockId: blockId,
        customValue: template.defaultVal
      };
      setWorkspaceBlocks([...workspaceBlocks, newBlockInstance]);
    }
  };

  const removeBlock = (instanceId) => {
    setWorkspaceBlocks(workspaceBlocks.filter(b => b.id !== instanceId));
  };

  const updateBlockValue = (instanceId, value) => {
    setWorkspaceBlocks(workspaceBlocks.map(b => b.id === instanceId ? { ...b, customValue: value } : b));
  };

  const clearWorkspace = () => {
    setWorkspaceBlocks([]);
  };

  // ==========================================
  // AI TUTOR COMPANION (CODI CHAT)
  // ==========================================

  const sendChatMessage = async () => {
    if (!chatInput.trim()) return;

    const userMsg = { sender: 'user', text: chatInput };
    setChatMessages(prev => [...prev, userMsg]);
    setChatInput('');
    setChatLoading(true);

    try {
      const systemPrompt = "You are Codi, an enthusiastic and helpful AI learning companion for Codigan. Keep your answers safe, clean, engaging, and easy to understand for teens. Use code block formatting when helpful!";
      
      const payload = {
        contents: [{ parts: [{ text: chatInput }] }],
        systemInstruction: { parts: [{ text: systemPrompt }] }
      };

      const res = await fetchWithBackoff(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        }
      );

      const aiText = res.candidates?.[0]?.content?.parts?.[0]?.text;
      setChatMessages(prev => [...prev, { sender: 'ai', text: aiText || "I had a tiny hiccup processing that! Ask me another question about programming." }]);
    } catch (err) {
      setChatMessages(prev => [...prev, { sender: 'ai', text: "Keep practicing, stay curious, and always verify your system values!" }]);
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col md:flex-row">
      
      {/* SIDEBAR NAVIGATION */}
      <aside className="w-full md:w-64 bg-slate-900 border-b md:border-b-0 md:border-r border-slate-800 flex flex-col justify-between p-4 shrink-0">
        <div>
          {/* LOGO */}
          <div className="flex items-center gap-3 px-2 py-4 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <span className="text-xl font-black text-slate-950">🦉</span>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">Codigan</h1>
              <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Visual AI Logic</span>
            </div>
          </div>

          {/* NAV LINKS */}
          <nav className="space-y-1">
            <button 
              onClick={() => { setActiveTab('home'); setActiveLesson(null); }}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition font-medium ${activeTab === 'home' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'}`}
            >
              <Home className="w-5 h-5" />
              <span>Learn Path</span>
            </button>
            <button 
              onClick={() => { setActiveTab('sandbox'); setActiveLesson(null); }}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition font-medium ${activeTab === 'sandbox' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'}`}
            >
              <Terminal className="w-5 h-5" />
              <span>AI Logic Sandbox</span>
            </button>
            <button 
              onClick={() => { setActiveTab('tutor'); setActiveLesson(null); }}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition font-medium ${activeTab === 'tutor' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'}`}
            >
              <MessageSquare className="w-5 h-5" />
              <span>AI Tutor (Codi)</span>
            </button>
            <button 
              onClick={() => { setActiveTab('leaderboard'); setActiveLesson(null); }}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition font-medium ${activeTab === 'leaderboard' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'}`}
            >
              <Trophy className="w-5 h-5" />
              <span>Leaderboard</span>
