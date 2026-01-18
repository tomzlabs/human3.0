
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
      <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={onClose} />
      <div className="relative glass w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[2rem] p-8 md:p-12 shadow-2xl">
        <button onClick={onClose} className="absolute top-8 right-8 text-zinc-500 hover:text-white transition-colors">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path d="M6 18L18 6M6 6l12 12" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <h2 className="serif text-4xl mb-8 gradient-text">{t.title} Protocol</h2>
        <div className="space-y-12">
          <section>
            <h3 className="uppercase tracking-widest text-xs mb-4 font-semibold opacity-60">Evolutionary Theory</h3>
            <p className="opacity-80 leading-relaxed text-lg italic">Human 3.0 is a framework for becoming "multidimensionally jacked"—maximizing potential across Mind, Body, Spirit, and Vocation. We transcend the conformist (1.0) and individualist (2.0) to become synthesists (3.0).</p>
          </section>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-8 bg-black/5 dark:bg-white/5 rounded-3xl border border-zinc-500/10 space-y-4 group hover:bg-zinc-500/10 transition-all">
               <h4 className="serif text-2xl">The Glitch</h4>
               <p className="text-zinc-500 text-sm">Glitches are accelerants like AI, PEDs, or Financial Pressure. At Level 1.0, they are death sentences. At 3.0, they are calculated risks.</p>
            </div>
            <div className="p-8 bg-black/5 dark:bg-white/5 rounded-3xl border border-zinc-500/10 space-y-4 group hover:bg-zinc-500/10 transition-all">
               <h4 className="serif text-2xl">Integration</h4>
               <p className="text-zinc-500 text-sm">We don't force balance; we solve problems. Solving a Body problem often reveals a hidden Spirit block. Integration is natural cascading growth.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const HeaderTools = ({ lang, setLang, theme, toggleTheme }: { lang: Lang, setLang: (l: Lang) => void, theme: Theme, toggleTheme: () => void }) => (
  <div className="fixed top-6 right-6 z-[60] flex gap-3 items-center">
    <a href="https://x.com/okmetom_" target="_blank" rel="noopener noreferrer" className="glass p-2.5 rounded-full hover:bg-zinc-500/10 transition-all">
      <svg className="w-4 h-4 opacity-60 hover:opacity-100 transition-opacity fill-current" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    </a>
    <button 
      onClick={toggleTheme}
      className="glass p-2.5 rounded-full hover:bg-zinc-500/10 transition-all"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <svg className="w-4 h-4 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.364 17.636l-.707.707M17.636 17.636l-.707-.707M6.364 6.364l-.707-.707M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ) : (
        <svg className="w-4 h-4 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      )}
    </button>
    <button onClick={() => setLang(lang === 'en' ? 'zh' : 'en')} className="glass px-4 py-2 rounded-full text-[10px] font-mono uppercase tracking-widest font-semibold opacity-70 hover:opacity-100 transition-all">
      {lang === 'en' ? '中文' : 'ENG'}
    </button>
  </div>
);

const App: React.FC = () => {
  const [lang, setLang] = useState<Lang>('en');
  const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem('human3-theme') as Theme) || 'dark');
  const [step, setStep] = useState<'intro' | 'quiz' | 'loading' | 'result'>('intro');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [analysis, setAnalysis] = useState<AssessmentResult | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [copyStatus, setCopyStatus] = useState<string | null>(null);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'light') {
      root.classList.add('light-theme');
    } else {
      root.classList.remove('light-theme');
    }
    localStorage.setItem('human3-theme', theme);
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
    }, 300);
  };

  const handlePrevious = () => {
    if (currentIdx > 0) {
      setCurrentIdx(currentIdx - 1);
      setSelectedLevel(null);
    }
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
    } catch (e) { 
      console.error(e); 
      setStep('intro'); 
    }
  };

  const handleShareX = () => {
    if (!analysis) return;
    const text = lang === 'en' 
      ? `I just completed my Human 3.0 diagnostic. 
      \nMetatype: ${analysis.metatype}
      \nArchetype: ${analysis.lifestyleArchetype}
      \nAverage Level: ${analysis.averageLevel.toFixed(1)}/3.0
      \n#Human3 #EvolutionaryBaseline`
      : `我刚刚完成了我的 人类 3.0 诊断。
      \n元类型：${analysis.metatype}
      \n生活原型：${analysis.lifestyleArchetype}
      \n平均等级：${analysis.averageLevel.toFixed(1)}/3.0
      \n#人类3 #演化基准`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const handleCopySummary = () => {
    if (!analysis) return;
    const summary = lang === 'en'
      ? `HUMAN 3.0 DIAGNOSTIC REPORT\nMetatype: ${analysis.metatype}\nArchetype: ${analysis.lifestyleArchetype}\nAverage Level: ${analysis.averageLevel.toFixed(1)}\nHard Truth: ${analysis.theTruth}\nAction: ${analysis.immediateAction}`
      : `人类 3.0 诊断报告\n元类型：${analysis.metatype}\n生活原型：${analysis.lifestyleArchetype}\n平均等级：${analysis.averageLevel.toFixed(1)}\n扎心真相：${analysis.theTruth}\n立即行动：${analysis.immediateAction}`;
    
    navigator.clipboard.writeText(summary);
    setCopyStatus(TRANSLATIONS[lang].summaryCopied);
    setTimeout(() => setCopyStatus(null), 2000);
  };

  const chartData = useMemo(() => 
    analysis ? Object.entries(analysis.quadrantScores).map(([key, value]) => ({ subject: key, A: value, fullMark: 3 })) : [], 
  [analysis]);

  const radarColor = theme === 'dark' ? '#fff' : '#000';

  if (step === 'intro') return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center theme-transition">
      <HeaderTools lang={lang} setLang={setLang} theme={theme} toggleTheme={toggleTheme} />
      <FrameworkModal isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} lang={lang} />
      <h1 className="serif text-6xl md:text-8xl mb-6 gradient-text">HUMAN 3.0</h1>
      <p className="max-w-2xl text-zinc-500 text-lg mb-12 font-light">{t.intro}</p>
      <div className="flex flex-col gap-6">
        <button 
          onClick={() => setStep('quiz')} 
          className="px-12 py-5 bg-zinc-900 text-white dark:bg-white dark:text-black font-bold rounded-full hover:scale-105 active:scale-95 transition-all tracking-widest uppercase shadow-xl"
        >
          {t.begin}
        </button>
        <button onClick={() => setIsGuideOpen(true)} className="text-zinc-500 underline text-xs uppercase tracking-widest opacity-60 hover:opacity-100 transition-opacity">
          {t.learnMore}
        </button>
      </div>
    </div>
  );

  if (step === 'quiz') return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 theme-transition">
      <HeaderTools lang={lang} setLang={setLang} theme={theme} toggleTheme={toggleTheme} />
      <div className="w-full max-w-xl">
        <div className="mb-12">
          <div className="flex justify-between items-end text-xs text-zinc-500 mb-4 uppercase tracking-widest">
            <div className="flex flex-col gap-2">
              <span className="font-semibold opacity-60">{QUESTIONS[currentIdx].quadrant}</span>
              {currentIdx > 0 && (
                <button 
                  onClick={handlePrevious}
                  className="text-zinc-400 hover:text-current transition-colors flex items-center gap-1 group"
                >
                  <svg className="w-3 h-3 group-hover:-translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  {lang === 'en' ? 'Previous' : '上一个'}
                </button>
              )}
            </div>
            <div className="text-right opacity-60">
              <span>{currentIdx + 1} / {QUESTIONS.length}</span>
            </div>
          </div>
          <div className="h-0.5 bg-zinc-500/10"><div className="h-full bg-zinc-500 dark:bg-white transition-all duration-500" style={{width: `${((currentIdx+1)/QUESTIONS.length)*100}%`}}/></div>
        </div>
        <h2 className="serif text-3xl mb-12 leading-tight">{lang === 'zh' ? QUESTIONS[currentIdx].textZh : QUESTIONS[currentIdx].text}</h2>
        <div className="space-y-4">
          {(lang === 'zh' ? QUESTIONS[currentIdx].optionsZh : QUESTIONS[currentIdx].options).map((opt, i) => (
            <button 
              key={i} 
              onClick={() => handleAnswer(QUESTIONS[currentIdx].options[i].level)} 
              className={`w-full text-left p-6 rounded-3xl border transition-all ${selectedLevel === QUESTIONS[currentIdx].options[i].level ? 'bg-zinc-900 text-white dark:bg-white dark:text-black border-zinc-900 dark:border-white shadow-2xl scale-[1.02]' : 'glass hover:border-zinc-500/50'}`}
            >
              <div className="flex gap-4">
                <span className="opacity-30 font-mono text-sm">{i + 1}.</span>
                <span className="text-lg font-light leading-snug">{opt.text}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  if (step === 'loading') return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 animate-pulse theme-transition">
      <div className="w-16 h-16 border-t-2 border-zinc-500 dark:border-white rounded-full animate-spin mb-8"/>
      <h2 className="serif text-2xl opacity-60">{t.loadingTitle}</h2>
    </div>
  );

  return (
    <div className="min-h-screen p-6 lg:p-12 max-w-6xl mx-auto space-y-12 theme-transition">
      <HeaderTools lang={lang} setLang={setLang} theme={theme} toggleTheme={toggleTheme} />
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-zinc-500/10 pb-12">
        <div>
          <h1 className="serif text-5xl mb-3 gradient-text">Assessment Result</h1>
          <p className="text-zinc-500 uppercase tracking-[0.3em] text-[10px] font-bold">Human 3.0 Evolutionary Profile</p>
        </div>
        <div className="flex gap-12">
           <div className="text-right"><div className="text-5xl serif">{analysis?.averageLevel.toFixed(1)}</div><div className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mt-1">Avg Level</div></div>
           <div className="text-right"><div className="text-2xl serif truncate max-w-[200px]">{analysis?.lifestyleArchetype}</div><div className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mt-1">Archetype</div></div>
        </div>
      </header>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-8">
          <div className="glass p-8 rounded-[2rem] shadow-sm">
             <h3 className="text-zinc-500 text-[10px] uppercase tracking-widest mb-8 font-bold">Quadrant Map</h3>
             <div className="h-64">
               <ResponsiveContainer>
                 <RadarChart data={chartData}>
                   <PolarGrid stroke={theme === 'dark' ? '#222' : '#e5e5e5'}/>
                   <PolarAngleAxis dataKey="subject" tick={{fill: theme === 'dark' ? '#555' : '#888', fontSize:10, fontWeight: 600}}/>
                   <Radar dataKey="A" stroke={radarColor} fill={radarColor} fillOpacity={0.1}/>
                 </RadarChart>
               </ResponsiveContainer>
             </div>
          </div>
          <div className="glass p-8 rounded-[2rem] border-l-4 border-l-zinc-500 dark:border-l-white">
             <h3 className="serif text-2xl mb-3">{analysis?.metatype}</h3>
             <p className="text-zinc-500 text-sm leading-relaxed font-light">{analysis?.metatypeDescription}</p>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-8">
          <section className="glass p-10 rounded-[2rem] relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-red-500/50" />
            <h3 className="text-zinc-500 text-[10px] uppercase tracking-widest mb-6 flex items-center gap-2 font-bold">
              <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping"/>The Hard Truth
            </h3>
            <p className="text-xl md:text-2xl font-light leading-relaxed italic opacity-90">"{analysis?.theTruth}"</p>
          </section>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="glass p-8 rounded-[2rem]">
              <h4 className="text-zinc-500 text-[10px] uppercase mb-4 font-bold tracking-widest">Core Problem</h4>
              <p className="text-zinc-500 text-sm leading-relaxed">{analysis?.coreProblem}</p>
            </div>
            <div className="glass p-8 rounded-[2rem] border-zinc-500/20">
              <h4 className="text-zinc-500 text-[10px] uppercase mb-4 font-bold tracking-widest">Immediate Action</h4>
              <p className="text-lg font-medium">{analysis?.immediateAction}</p>
            </div>
          </div>

          <div className="glass p-8 rounded-[2rem] space-y-6">
             <h3 className="text-zinc-500 text-[10px] uppercase tracking-widest font-bold">Cross-Quadrant Dynamics</h3>
             <div className="grid sm:grid-cols-3 gap-8">
                <div>
                  <div className="text-[10px] text-zinc-500 uppercase mb-2 font-bold opacity-60">Primary Block</div>
                  <div className="text-xs leading-relaxed opacity-80">{analysis?.crossQuadrantDynamics?.primaryBlock}</div>
                </div>
                <div>
                  <div className="text-[10px] text-zinc-500 uppercase mb-2 font-bold opacity-60">Unlock Catalyst</div>
                  <div className="text-xs leading-relaxed opacity-80">{analysis?.crossQuadrantDynamics?.unlockOpportunity}</div>
                </div>
                <div>
                  <div className="text-[10px] text-zinc-500 uppercase mb-2 font-bold opacity-60">Hidden Pattern</div>
                  <div className="text-xs leading-relaxed opacity-80">{analysis?.crossQuadrantDynamics?.hiddenPattern}</div>
                </div>
             </div>
          </div>

          <div className="space-y-6">
             <h3 className="text-zinc-500 text-[10px] uppercase tracking-widest ml-4 font-bold">Transformation Strategy</h3>
             <div className="grid gap-6">
                <div className="p-8 glass rounded-[2rem] border-zinc-500/10">
                   <div className="flex justify-between items-center mb-6">
                     <span className="text-xs font-bold px-4 py-1.5 bg-zinc-900 text-white dark:bg-white dark:text-black rounded-full uppercase tracking-tighter">Day 1-30</span>
                     <span className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest">Problem Recognition</span>
                   </div>
                   <ul className="text-zinc-500 text-sm space-y-3 font-light">
                     {analysis?.strategy?.shortTerm?.daily.map((s,i)=><li key={i} className="flex gap-2"><span>•</span> {s}</li>)}
                   </ul>
                </div>
                <div className="p-8 glass rounded-[2rem] border-zinc-500/10">
                   <div className="flex justify-between items-center mb-6">
                     <span className="text-xs border border-zinc-500/30 px-4 py-1.5 rounded-full uppercase font-bold tracking-tighter">Day 30-90</span>
                     <span className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest">Implementation</span>
                   </div>
                   <p className="text-zinc-500 text-sm leading-relaxed font-light">{analysis?.strategy?.midTerm?.shift}</p>
                </div>
             </div>
          </div>

          <section className={`p-10 rounded-[2.5rem] border ${analysis && analysis.averageLevel < 2.5 ? 'border-red-500/20 bg-red-500/5' : 'border-emerald-500/20 bg-emerald-500/5'}`}>
            <h3 className="text-zinc-500 text-[10px] uppercase tracking-widest mb-6 font-bold">Glitch Assessment</h3>
            <p className="text-sm leading-relaxed font-light opacity-90">{analysis?.glitchAssessment}</p>
          </section>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={handleShareX}
              className="w-full sm:w-auto px-10 py-4 bg-zinc-900 text-white dark:bg-white dark:text-black rounded-full font-bold uppercase tracking-[0.2em] text-xs hover:scale-105 active:scale-95 transition-all shadow-xl flex items-center justify-center gap-3"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
              {lang === 'en' ? 'Share to X' : '分享到 X'}
            </button>
            <button 
              onClick={handleCopySummary}
              className="w-full sm:w-auto px-10 py-4 glass border-zinc-500/30 rounded-full font-bold uppercase tracking-[0.2em] text-xs hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
              </svg>
              {copyStatus || (lang === 'en' ? 'Copy Summary' : '复制摘要')}
            </button>
            <button 
              onClick={handleReset}
              className="w-full sm:w-auto px-10 py-4 border border-zinc-500/50 rounded-full font-bold uppercase tracking-[0.2em] text-xs hover:bg-zinc-500/10 transition-all opacity-70 hover:opacity-100"
            >
              {lang === 'en' ? 'New Diagnostic' : '新诊断'}
            </button>
          </div>
        </div>
      </div>

      <footer className="pt-32 pb-12 text-center">
         <button 
           onClick={handleReset} 
           className="text-[10px] uppercase tracking-[0.5em] text-zinc-500 hover:text-current transition-all font-bold opacity-60 hover:opacity-100"
         >
           {t.recalibrate}
         </button>
      </footer>
    </div>
  );
};

export default App;
