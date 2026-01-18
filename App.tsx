
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { QUESTIONS, TRANSLATIONS } from './constants';
import { Quadrant, AssessmentResult } from './types';
import { analyzeResults } from './geminiService';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';

type Lang = 'en' | 'zh';
type Theme = 'dark' | 'light';

const FrameworkModal = ({ isOpen, onClose, lang }: { isOpen: boolean; onClose: () => void; lang: Lang }) => {
  if (!isOpen) return null;
  const t = TRANSLATIONS[lang];
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
      <div className="absolute inset-0 bg-black bg-opacity-90 backdrop-blur-2xl transition-opacity" onClick={onClose} />
      <div className="relative glass w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-4xl p-8 md:p-16 shadow-2xl animate-fade-in">
        <button onClick={onClose} className="absolute top-8 right-8 text-gray-500 hover:text-white transition-all transform hover:rotate-90">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path d="M6 18L18 6M6 6l12 12" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <h2 className="serif text-5xl mb-12 gradient-text">{t.title} Protocol</h2>
        <div className="space-y-16">
          <section>
            <h3 className="uppercase tracking-[0.3em] text-[10px] mb-6 font-bold opacity-40">Evolutionary Theory</h3>
            <p className="opacity-80 leading-relaxed text-xl md:text-2xl font-light italic">Human 3.0 is a framework for becoming "multidimensionally jacked"—maximizing potential across Mind, Body, Spirit, and Vocation. We transcend the conformist (1.0) and individualist (2.0) to become synthesists (3.0).</p>
          </section>
          <div className="grid md:grid-cols-2 gap-10">
            <div className="p-10 glass rounded-3xl space-y-4 group cursor-default">
               <h4 className="serif text-3xl group-hover:gradient-text transition-all">The Glitch</h4>
               <p className="text-gray-500 text-base font-light leading-relaxed">Glitches are accelerants like AI, PEDs, or Financial Pressure. At Level 1.0, they are death sentences. At 3.0, they are calculated risks.</p>
            </div>
            <div className="p-10 glass rounded-3xl space-y-4 group cursor-default">
               <h4 className="serif text-3xl group-hover:gradient-text transition-all">Integration</h4>
               <p className="text-gray-500 text-base font-light leading-relaxed">We don't force balance; we solve problems. Solving a Body problem often reveals a hidden Spirit block. Integration is natural cascading growth.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const HeaderTools = ({ lang, setLang, theme, toggleTheme }: { lang: Lang, setLang: (l: Lang) => void, theme: Theme, toggleTheme: () => void }) => (
  <div className="fixed top-8 right-8 z-[60] flex space-x-4 items-center animate-fade-in">
    <a href="https://x.com/okmetom_" target="_blank" rel="noopener noreferrer" className="glass p-3 rounded-full hover:bg-white hover:bg-opacity-10 transition-all group">
      <svg className="w-4 h-4 opacity-40 group-hover:opacity-100 transition-all fill-current" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    </a>
    <button 
      onClick={toggleTheme}
      className="glass p-3 rounded-full hover:bg-white hover:bg-opacity-10 transition-all group"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <svg className="w-4 h-4 opacity-40 group-hover:opacity-100 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.364 17.636l-.707.707M17.636 17.636l-.707-.707M6.364 6.364l-.707-.707M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ) : (
        <svg className="w-4 h-4 opacity-40 group-hover:opacity-100 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      )}
    </button>
    <button onClick={() => setLang(lang === 'en' ? 'zh' : 'en')} className="glass px-6 py-2.5 rounded-full text-[10px] font-mono uppercase tracking-[0.2em] font-bold opacity-60 hover:opacity-100 transition-all">
      {lang === 'en' ? '中文' : 'ENG'}
    </button>
  </div>
);

const App: React.FC = () => {
  const [lang, setLang] = useState<Lang>('en');
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      return (localStorage.getItem('human3-theme') as Theme) || 'dark';
    } catch {
      return 'dark';
    }
  });
  const [step, setStep] = useState<'intro' | 'quiz' | 'loading' | 'result'>('intro');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [analysis, setAnalysis] = useState<AssessmentResult | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [copyStatus, setCopyStatus] = useState<string | null>(null);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'light') root.classList.add('light-theme');
    else root.classList.remove('light-theme');
    try { localStorage.setItem('human3-theme', theme); } catch (e) {}
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  const t = TRANSLATIONS[lang];

  const handleReset = useCallback(() => {
    setAnswers({});
    setCurrentIdx(0);
    setAnalysis(null);
    setSelectedLevel(null);
    setStep('intro');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleAnswer = (level: number) => {
    setSelectedLevel(level);
    setTimeout(() => {
      const nextAnswers = { ...answers, [QUESTIONS[currentIdx].id]: level };
      setAnswers(nextAnswers);
      setSelectedLevel(null);
      if (currentIdx < QUESTIONS.length - 1) setCurrentIdx(currentIdx + 1);
      else finishQuiz(nextAnswers);
    }, 400);
  };

  const finishQuiz = async (finalAnswers: Record<number, number>) => {
    setStep('loading');
    const qScores: any = {};
    const qCounts: any = {};
    const detailed = QUESTIONS.map(q => ({ 
      question: lang === 'zh' ? q.textZh : q.text, 
      answer: (lang === 'zh' ? q.optionsZh : q.options)[q.options.findIndex(o => o.level === finalAnswers[q.id])].text 
    }));
    QUESTIONS.forEach(q => {
      qScores[q.quadrant] = (qScores[q.quadrant] || 0) + finalAnswers[q.id];
      qCounts[q.quadrant] = (qCounts[q.quadrant] || 0) + 1;
    });
    const avgs = Object.fromEntries(Object.entries(qScores).map(([k, v]: any) => [k, v / qCounts[k]]));
    try {
      const res = await analyzeResults(avgs, detailed, lang);
      setAnalysis(res);
      setStep('result');
    } catch (e) { setStep('intro'); }
  };

  const handleShareX = () => {
    if (!analysis) return;
    const text = lang === 'en' 
      ? `I just completed my Human 3.0 diagnostic. \n\nMetatype: ${analysis.metatype}\nArchetype: ${analysis.lifestyleArchetype}\nAverage Level: ${analysis.averageLevel.toFixed(1)}/3.0\n\n#Human3 #EvolutionaryBaseline`
      : `我刚刚完成了我的 人类 3.0 诊断。\n\n元类型：${analysis.metatype}\n生活原型：${analysis.lifestyleArchetype}\n平均等级：${analysis.averageLevel.toFixed(1)}/3.0\n\n#人类3 #演化基准`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleCopySummary = () => {
    if (!analysis) return;
    const summary = lang === 'en'
      ? `HUMAN 3.0 DIAGNOSTIC REPORT\nMetatype: ${analysis.metatype}\nArchetype: ${analysis.lifestyleArchetype}\nAvg Level: ${analysis.averageLevel.toFixed(1)}\nTruth: ${analysis.theTruth}`
      : `人类 3.0 诊断报告\n元类型：${analysis.metatype}\n生活原型：${analysis.lifestyleArchetype}\n平均等级：${analysis.averageLevel.toFixed(1)}\n真相：${analysis.theTruth}`;
    navigator.clipboard.writeText(summary);
    setCopyStatus(TRANSLATIONS[lang].summaryCopied);
    setTimeout(() => setCopyStatus(null), 2000);
  };

  const chartData = useMemo(() => analysis ? Object.entries(analysis.quadrantScores).map(([key, value]) => ({ subject: key, A: value })) : [], [analysis]);
  const radarColor = theme === 'dark' ? '#ffffff' : '#000000';

  if (step === 'intro') return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center animate-fade-in">
      <HeaderTools lang={lang} setLang={setLang} theme={theme} toggleTheme={toggleTheme} />
      <FrameworkModal isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} lang={lang} />
      <h1 className="serif text-7xl md:text-9xl mb-8 gradient-text tracking-tighter">HUMAN 3.0</h1>
      <p className="max-w-2xl text-gray-500 text-xl md:text-2xl mb-16 font-light leading-relaxed">{t.intro}</p>
      <div className="flex flex-col space-y-8">
        <button 
          onClick={() => setStep('quiz')} 
          className="cta-pulse px-20 py-8 bg-black text-white dark:bg-white dark:text-black font-extrabold rounded-full hover:scale-110 active:scale-95 transition-all tracking-[0.4em] uppercase shadow-2xl text-lg border-2 border-transparent hover:border-gray-500 hover:border-opacity-30"
        >
          {t.begin}
        </button>
        <button onClick={() => setIsGuideOpen(true)} className="text-gray-500 underline text-xs uppercase tracking-[0.4em] opacity-40 hover:opacity-100 transition-all font-bold mt-4">
          {t.learnMore}
        </button>
      </div>
    </div>
  );

  if (step === 'quiz') return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 animate-fade-in">
      <HeaderTools lang={lang} setLang={setLang} theme={theme} toggleTheme={toggleTheme} />
      <div className="w-full max-w-2xl">
        <div className="mb-20">
          <div className="flex justify-between items-end text-[10px] text-gray-500 mb-6 uppercase tracking-[0.4em] font-bold">
            <div className="flex flex-col space-y-3">
              <span className="opacity-40">{QUESTIONS[currentIdx].quadrant}</span>
              {currentIdx > 0 && (
                <button onClick={() => setCurrentIdx(currentIdx - 1)} className="text-gray-400 hover:text-current transition-all flex items-center space-x-2 group">
                  <svg className="w-3 h-3 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                  <span>{lang === 'en' ? 'Back' : '返回'}</span>
                </button>
              )}
            </div>
            <div className="opacity-40">{currentIdx + 1} / {QUESTIONS.length}</div>
          </div>
          <div className="h-0.5 bg-gray-500 bg-opacity-10 rounded-full overflow-hidden">
            <div className="h-full bg-gray-500 dark:bg-white transition-all duration-700 ease-out" style={{width: `${((currentIdx+1)/QUESTIONS.length)*100}%`}} />
          </div>
        </div>
        <h2 className="serif text-4xl md:text-5xl mb-16 leading-[1.2] font-light">{lang === 'zh' ? QUESTIONS[currentIdx].textZh : QUESTIONS[currentIdx].text}</h2>
        <div className="space-y-6">
          {(lang === 'zh' ? QUESTIONS[currentIdx].optionsZh : QUESTIONS[currentIdx].options).map((opt, i) => (
            <button 
              key={i} 
              onClick={() => handleAnswer(QUESTIONS[currentIdx].options[i].level)} 
              className={`option-btn w-full text-left p-8 rounded-3xl border transition-all duration-300 hover:scale-[1.01] ${selectedLevel === QUESTIONS[currentIdx].options[i].level ? 'bg-black text-white dark:bg-white dark:text-black border-transparent shadow-2xl' : 'glass border-opacity-20 hover:border-opacity-60'}`}
            >
              <div className="flex items-center space-x-6 relative z-10">
                <span className="opacity-20 font-mono text-sm tracking-tighter">0{i + 1}</span>
                <span className="text-lg md:text-xl font-light leading-snug">{opt.text}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  if (step === 'loading') return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 animate-fade-in">
      <div className="w-12 h-12 border-t border-gray-500 dark:border-white rounded-full animate-spin mb-10"/>
      <h2 className="serif text-3xl font-light opacity-40 tracking-widest">{t.loadingTitle}</h2>
    </div>
  );

  return (
    <div className="min-h-screen p-8 lg:p-20 max-w-7xl mx-auto space-y-24 animate-fade-in theme-transition">
      <HeaderTools lang={lang} setLang={setLang} theme={theme} toggleTheme={toggleTheme} />
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end space-y-10 md:space-y-0 border-b border-gray-500 border-opacity-10 pb-20">
        <div className="space-y-4">
          <h1 className="serif text-6xl md:text-7xl gradient-text leading-tight">Diagnostic Result</h1>
          <p className="text-gray-500 uppercase tracking-[0.5em] text-[10px] font-black">Human 3.0 Evolutionary Profile</p>
        </div>
        <div className="flex space-x-16">
           <div className="text-right">
             <div className="text-6xl md:text-7xl serif font-light">{analysis?.averageLevel.toFixed(1)}</div>
             <div className="text-[10px] text-gray-500 uppercase tracking-[0.3em] font-black mt-4">Avg Level</div>
           </div>
           <div className="text-right">
             <div className="text-3xl md:text-4xl serif font-light truncate max-w-[280px]">{analysis?.lifestyleArchetype}</div>
             <div className="text-[10px] text-gray-500 uppercase tracking-[0.3em] font-black mt-4">Archetype</div>
           </div>
        </div>
      </header>

      <div className="grid lg:grid-cols-12 gap-12">
        <div className="lg:col-span-4 space-y-12">
          <div className="glass p-12 rounded-4xl shadow-sm hover:shadow-xl transition-all">
             <h3 className="text-gray-500 text-[10px] uppercase tracking-[0.4em] mb-12 font-black">Quadrant Map</h3>
             <div className="h-72">
               <ResponsiveContainer>
                 <RadarChart data={chartData}>
                   <PolarGrid stroke={theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}/>
                   <PolarAngleAxis dataKey="subject" tick={{fill: theme === 'dark' ? '#666' : '#999', fontSize:11, fontWeight: 700, letterSpacing: '0.1em'}}/>
                   <Radar dataKey="A" stroke={radarColor} fill={radarColor} fillOpacity={0.05} />
                 </RadarChart>
               </ResponsiveContainer>
             </div>
          </div>
          <div className="glass p-12 rounded-4xl border-l-[6px] border-gray-500 dark:border-white group">
             <h3 className="serif text-3xl mb-6 group-hover:gradient-text transition-all">{analysis?.metatype}</h3>
             <p className="text-gray-500 text-lg leading-relaxed font-light italic opacity-80">{analysis?.metatypeDescription}</p>
          </div>
        </div>

        <div className="lg:col-span-8 space-y-12">
          <section className="glass p-12 rounded-4xl relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-red-500 opacity-40 transition-all group-hover:opacity-100" />
            <h3 className="text-gray-500 text-[10px] uppercase tracking-[0.4em] mb-8 flex items-center space-x-3 font-black">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.5)]"/>
              <span>The Hard Truth</span>
            </h3>
            <p className="text-2xl md:text-4xl font-light leading-[1.4] italic opacity-90 serif group-hover:opacity-100 transition-opacity">"{analysis?.theTruth}"</p>
          </section>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="glass p-10 rounded-4xl hover-lift">
              <h4 className="text-gray-500 text-[10px] uppercase mb-6 font-black tracking-[0.3em]">Core Problem</h4>
              <p className="text-gray-500 text-lg leading-relaxed font-light">{analysis?.coreProblem}</p>
            </div>
            <div className="glass p-10 rounded-4xl border-opacity-30 hover-lift">
              <h4 className="text-gray-500 text-[10px] uppercase mb-6 font-black tracking-[0.3em]">Immediate Action</h4>
              <p className="text-2xl font-medium leading-snug serif">{analysis?.immediateAction}</p>
            </div>
          </div>

          <div className="pt-20 flex flex-col sm:flex-row items-center justify-center space-y-6 sm:space-y-0 sm:space-x-6">
            <button onClick={handleShareX} className="w-full sm:w-auto px-12 py-5 bg-black text-white dark:bg-white dark:text-black rounded-full font-bold uppercase tracking-[0.3em] text-[10px] hover:scale-110 active:scale-95 transition-all shadow-2xl flex items-center justify-center space-x-4">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              <span>{lang === 'en' ? 'Share to X' : '分享到 X'}</span>
            </button>
            <button onClick={handleCopySummary} className="w-full sm:w-auto px-12 py-5 glass border-opacity-30 rounded-full font-bold uppercase tracking-[0.3em] text-[10px] hover:scale-110 active:scale-95 transition-all flex items-center justify-center space-x-4">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
              <span>{copyStatus || (lang === 'en' ? 'Copy' : '复制')}</span>
            </button>
            <button onClick={handleReset} className="w-full sm:w-auto px-12 py-5 border border-gray-500 border-opacity-20 rounded-full font-bold uppercase tracking-[0.3em] text-[10px] hover:bg-gray-500 hover:bg-opacity-10 transition-all opacity-40 hover:opacity-100">
              {lang === 'en' ? 'Reset' : '重置'}
            </button>
          </div>
        </div>
      </div>

      <footer className="pt-40 pb-20 text-center">
         <button onClick={handleReset} className="text-[10px] uppercase tracking-[1em] text-gray-500 hover:text-current transition-all font-black opacity-30 hover:opacity-100">
           {t.recalibrate}
         </button>
      </footer>
    </div>
  );
};

export default App;
