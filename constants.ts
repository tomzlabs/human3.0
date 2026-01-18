
import { Question, Quadrant } from './types';

export const TRANSLATIONS = {
  en: {
    title: "HUMAN 3.0",
    intro: "Life is problem-solving. Every solution reveals the next, more interesting problem. Discover your developmental level across Mind, Body, Spirit, and Vocation.",
    begin: "BEGIN DIAGNOSTIC",
    viewLast: "View Last Result",
    loadingTitle: "Synthesizing multidimensional data...",
    loadingSub: "Identifying constraints and mapping potential evolutionary cascades.",
    resultTitle: "Diagnostic Result",
    frameworkSub: "Human 3.0 Developmental Framework",
    learnMore: "Learn More",
    avgLevel: "Avg. Level",
    quadrantMap: "Quadrant Map",
    identityProfile: "Identity Profile",
    strategicInsight: "Strategic Insight",
    evoBaseline: "Evolutionary Baseline",
    recalibrate: "Recalibrate Baseline",
    protocol: "Human 3.0 Protocol",
    footer: "Framework Synthesis. Transcend and Include.",
    summaryCopied: "Summary Copied",
    archetypes: {
      specialist: "Mastery through focus and technical excellence.",
      seeker: "Prioritizing inner alignment and existential truth.",
      architect: "Designing high-leverage systems for global impact.",
      biohacker: "Optimizing the biological vessel for peak performance.",
      conventionalist: "Rooted in stability and social norms.",
      default: "A balanced but emerging profile."
    }
  },
  zh: {
    title: "人类 3.0",
    intro: "生命即是解决问题。每个解决方案都会揭示下一个更高级的问题。探索你在思维、身体、精神和职业维度的发展水平。",
    begin: "开始诊断",
    viewLast: "查看上次结果",
    loadingTitle: "正在合成多维数据...",
    loadingSub: "识别制约因素并绘制潜在的演化级联图。",
    resultTitle: "诊断结果",
    frameworkSub: "人类 3.0 发展框架",
    learnMore: "了解更多",
    avgLevel: "平均等级",
    quadrantMap: "象限图",
    identityProfile: "身份画像",
    strategicInsight: "战略洞察",
    evoBaseline: "演化基准",
    recalibrate: "重新校准基准",
    protocol: "人类 3.0 协议",
    footer: "框架综合。超越并包含。",
    summaryCopied: "摘要已复制",
    archetypes: {
      specialist: "通过专注和技术卓越实现精通。",
      seeker: "优先考虑内在对齐和存在真理。",
      architect: "为全球影响力设计高杠杆系统。",
      biohacker: "优化生物容器以实现巅峰表现。",
      conventionalist: "根植于稳定和社会规范。",
      default: "一个平衡但新兴的剖面。"
    }
  }
};

export const QUESTIONS: (Question & { textZh: string, optionsZh: { text: string }[] })[] = [
  {
    id: 1,
    text: "How do you typically approach new challenges in your career?",
    textZh: "你通常如何应对职业生涯中的新挑战？",
    quadrant: Quadrant.VOCATION,
    options: [
      { text: "I follow the set procedures and instructions given by my superiors.", level: 1 },
      { text: "I look for ways to optimize my performance and beat the competition.", level: 2 },
      { text: "I design new systems that create value for everyone involved.", level: 3 }
    ],
    optionsZh: [
      { text: "我遵循上级给出的设定程序和指示。" },
      { text: "我寻找优化表现的方法并超越竞争对手。" },
      { text: "我设计能为所有相关方创造价值的新系统。" }
    ]
  },
  {
    id: 2,
    text: "When you encounter a belief that contradicts your own, how do you react?",
    textZh: "当你遇到与你相矛盾的观点时，你如何反应？",
    quadrant: Quadrant.MIND,
    options: [
      { text: "I feel defensive and stick to what I've always been taught.", level: 1 },
      { text: "I critically analyze the new info to see if it can improve my logic.", level: 2 },
      { text: "I seek to synthesize both perspectives into a more complex truth.", level: 3 }
    ],
    optionsZh: [
      { text: "我感到防御性，并坚持我一贯被教导的东西。" },
      { text: "我批判性地分析新信息，看它是否能改善我的逻辑。" },
      { text: "我寻求将两种观点综合成一个更复杂的真相。" }
    ]
  },
  {
    id: 3,
    text: "What is your primary relationship with your physical health?",
    textZh: "你与身体健康的主要关系是什么？",
    quadrant: Quadrant.BODY,
    options: [
      { text: "I only pay attention to it when I am sick or in pain.", level: 1 },
      { text: "I track metrics (sleep, macros, gym) to optimize my performance.", level: 2 },
      { text: "I listen to my body's intuitive wisdom to sustain my life's work.", level: 3 }
    ],
    optionsZh: [
      { text: "我只在生病或疼痛时才关注它。" },
      { text: "我跟踪指标（睡眠、宏量营养素、健身）以优化表现。" },
      { text: "我倾听身体的直觉智慧，以维持我的终生事业。" }
    ]
  },
  {
    id: 4,
    text: "How do you view your role in your community or relationships?",
    textZh: "你如何看待你在社区或关系中的角色？",
    quadrant: Quadrant.SPIRIT,
    options: [
      { text: "I follow social norms and fulfill my assigned obligations.", level: 1 },
      { text: "I seek deep personal growth through my interactions with others.", level: 2 },
      { text: "I act as an evolutionary force, enabling development in everyone I meet.", level: 3 }
    ],
    optionsZh: [
      { text: "我遵循社会规范并履行分配给我的义务。" },
      { text: "我通过与他人的互动寻求深层的个人成长。" },
      { text: "我作为一种演化力量，促进我遇到的每个人的发展。" }
    ]
  },
  {
    id: 5,
    text: "What drives your daily work?",
    textZh: "是什么驱动着你的日常工作？",
    quadrant: Quadrant.VOCATION,
    options: [
      { text: "Survival and security; it's a necessary job to pay bills.", level: 1 },
      { text: "Achievement and status; it's a career path for personal success.", level: 2 },
      { text: "Purpose and play; it's a calling that solves meaningful problems.", level: 3 }
    ],
    optionsZh: [
      { text: "生存和安全；这只是一份付账单的必要工作。" },
      { text: "成就和地位；这是一条追求个人成功的职业道路。" },
      { text: "使命和乐趣；这是一种解决有意义问题的天职。" }
    ]
  },
  {
    id: 6,
    text: "How do you handle your internal 'shadow' or negative emotions?",
    textZh: "你如何处理内在的“阴影”或负面情绪？",
    quadrant: Quadrant.MIND,
    options: [
      { text: "I try to ignore or suppress them to stay 'good'.", level: 1 },
      { text: "I use therapy or self-help techniques to fix myself.", level: 2 },
      { text: "I integrate them as necessary indicators for my next evolution.", level: 3 }
    ],
    optionsZh: [
      { text: "我试着忽视或压抑它们以保持“良好”状态。" },
      { text: "我使用治疗或自助技巧来“修复”自己。" },
      { text: "我将它们整合为下一次演化的必要指标。" }
    ]
  },
  {
    id: 7,
    text: "How do you handle your nutrition and fuel?",
    textZh: "你如何处理你的营养和能量补充？",
    quadrant: Quadrant.BODY,
    options: [
      { text: "I eat whatever is convenient or culturally standard.", level: 1 },
      { text: "I follow a specific diet or biohacking protocol for peak performance.", level: 2 },
      { text: "I treat food as medicine and energy for systemic contribution.", level: 3 }
    ],
    optionsZh: [
      { text: "我吃任何方便或符合文化习惯的东西。" },
      { text: "我遵循特定的饮食或生物黑客方案以获得巅峰表现。" },
      { text: "我将食物视为药物和用于系统性贡献的能量。" }
    ]
  },
  {
    id: 8,
    text: "What is your relationship with 'Time'?",
    textZh: "你与“时间”的关系是怎样的？",
    quadrant: Quadrant.MIND,
    options: [
      { text: "I am often running late or feel overwhelmed by the clock.", level: 1 },
      { text: "I use high-level productivity systems to maximize my output.", level: 2 },
      { text: "I operate from a state of 'Kairos'—the right moment for deep work.", level: 3 }
    ],
    optionsZh: [
      { text: "我经常迟到，或者感到被时间压得喘不过气。" },
      { text: "我使用高级生产力系统来最大化产出。" },
      { text: "我处于“Kairos”状态——即进行深度工作的恰当时机。" }
    ]
  },
  {
    id: 9,
    text: "How do you experience silence and solitude?",
    textZh: "你如何体验沉默与孤独？",
    quadrant: Quadrant.SPIRIT,
    options: [
      { text: "I find it uncomfortable and usually seek a distraction.", level: 1 },
      { text: "I use it as a tool for recovery and stress management.", level: 2 },
      { text: "I use it to access non-ordinary states and creative insights.", level: 3 }
    ],
    optionsZh: [
      { text: "我觉得很不舒服，通常会寻找分心的事。" },
      { text: "我把它作为恢复和压力管理的工具。" },
      { text: "我用它来进入非凡状态并获得创意洞见。" }
    ]
  },
  {
    id: 10,
    text: "How do you view money and financial assets?",
    textZh: "你如何看待金钱和金融资产？",
    quadrant: Quadrant.VOCATION,
    options: [
      { text: "As a scarce resource that I need to hoard for safety.", level: 1 },
      { text: "As a scorecard of my competence and competitive rank.", level: 2 },
      { text: "As 'energy' to be deployed for the scaling of impact.", level: 3 }
    ],
    optionsZh: [
      { text: "作为一种稀缺资源，我需要囤积以求安全。" },
      { text: "作为我能力和竞争排名的记分卡。" },
      { text: "作为用于扩大影响力的“能量”。" }
    ]
  },
  {
    id: 11,
    text: "How do you approach your physical environment (home/office)?",
    textZh: "你如何对待你的物理环境（家/办公室）？",
    quadrant: Quadrant.BODY,
    options: [
      { text: "It's often cluttered or I don't pay much attention to it.", level: 1 },
      { text: "It is organized and optimized for ergonomic efficiency.", level: 2 },
      { text: "It is a curated sanctuary designed to trigger specific flow states.", level: 3 }
    ],
    optionsZh: [
      { text: "它通常很凌乱，或者我不太注意它。" },
      { text: "它井井有条，并为人体工程学效率进行了优化。" },
      { text: "它是一个精心策划的圣殿，旨在触发特定的心流状态。" }
    ]
  },
  {
    id: 12,
    text: "How do you learn new, complex information?",
    textZh: "你如何学习新的复杂信息？",
    quadrant: Quadrant.MIND,
    options: [
      { text: "I wait for training or instructions from experts.", level: 1 },
      { text: "I aggressively research and self-teach to gain an edge.", level: 2 },
      { text: "I build mental models and seek 'first principles' understanding.", level: 3 }
    ],
    optionsZh: [
      { text: "我等待专家的培训或指示。" },
      { text: "我积极研究并自学以获得优势。" },
      { text: "我建立思维模型并寻求“第一性原理”的理解。" }
    ]
  },
  {
    id: 13,
    text: "What is the primary goal of your social interactions?",
    textZh: "你社交互动的首要目标是什么？",
    quadrant: Quadrant.SPIRIT,
    options: [
      { text: "To be liked, fit in, and avoid social friction.", level: 1 },
      { text: "To network and find opportunities for mutual benefit.", level: 2 },
      { text: "To practice radical honesty and mutual awakening.", level: 3 }
    ],
    optionsZh: [
      { text: "为了合群、被喜欢并避免社交摩擦。" },
      { text: "为了建立人脉并寻找互利机会。" },
      { text: "为了实践彻底的诚实和共同觉醒。" }
    ]
  },
  {
    id: 14,
    text: "How do you respond to systemic failures in your industry?",
    textZh: "你如何应对行业内的系统性失败？",
    quadrant: Quadrant.VOCATION,
    options: [
      { text: "I complain about them but assume they are unchangeable.", level: 1 },
      { text: "I find ways to profit or succeed despite the flaws.", level: 2 },
      { text: "I attempt to build a 'New Paradigm' that makes the old one obsolete.", level: 3 }
    ],
    optionsZh: [
      { text: "我抱怨它们，但认为它们无法改变。" },
      { text: "我寻找在缺陷中获利或成功的方法。" },
      { text: "我尝试建立一个让旧范式过时的“新范式”。" }
    ]
  },
  {
    id: 15,
    text: "How do you view physical exercise?",
    textZh: "你如何看待体育锻炼？",
    quadrant: Quadrant.BODY,
    options: [
      { text: "As a chore I should do to look better or avoid illness.", level: 1 },
      { text: "As a data-driven training program to achieve specific goals.", level: 2 },
      { text: "As a moving meditation and a way to maintain my 'instrument'.", level: 3 }
    ],
    optionsZh: [
      { text: "作为一项为了好看或避免生病而不得不做的苦差事。" },
      { text: "作为一项旨在实现特定目标的、数据驱动的训练计划。" },
      { text: "作为一种动态冥想和维护我“乐器”的方式。" }
    ]
  },
  {
    id: 16,
    text: "How do you define 'Success'?",
    textZh: "你如何定义“成功”？",
    quadrant: Quadrant.SPIRIT,
    options: [
      { text: "Having a stable life and being respected by my peers.", level: 1 },
      { text: "Achieving financial freedom and peak personal performance.", level: 2 },
      { text: "Aligning my unique talents with the world's deepest needs.", level: 3 }
    ],
    optionsZh: [
      { text: "拥有稳定的生活并受到同行的尊重。" },
      { text: "实现财务自由和个人巅峰表现。" },
      { text: "将我独特的才华与世界最深层的需求相结合。" }
    ]
  },
  {
    id: 17,
    text: "When facing a moral dilemma where no choice is 'perfect', what guides you?",
    textZh: "面对没有“完美”选择的道德困境时，什么是指引你的准则？",
    quadrant: Quadrant.SPIRIT,
    options: [
      { text: "Common laws, religious rules, or what most people consider 'right'.", level: 1 },
      { text: "Personal logic and the outcome that yields the most personal growth.", level: 2 },
      { text: "The path that serves the long-term evolutionary integrity of the whole.", level: 3 }
    ],
    optionsZh: [
      { text: "通用法律、宗教规则或大多数人认为“正确”的标准。" },
      { text: "个人逻辑以及能产生最多个人成长的结果。" },
      { text: "服务于整体长期演进完整性的道路。" }
    ]
  },
  {
    id: 18,
    text: "How do you relate to the concept of 'Failure' in your personal projects?",
    textZh: "你如何看待个人项目中的“失败”概念？",
    quadrant: Quadrant.MIND,
    options: [
      { text: "I avoid it at all costs and feel deep shame if it happens.", level: 1 },
      { text: "I treat it as a data point to pivot and optimize my next attempt.", level: 2 },
      { text: "I see it as a necessary breakdown for a higher-level breakthrough.", level: 3 }
    ],
    optionsZh: [
      { text: "我不惜一切代价避免它，如果发生了会感到深深的羞耻。" },
      { text: "我将其视为一个数据点，用于调整和优化下一次尝试。" },
      { text: "我将其视为实现更高层突破所必需的“瓦解”。" }
    ]
  },
  {
    id: 19,
    text: "What is your approach to 'Rest' and 'Recovery'?",
    textZh: "你对待“休息”和“恢复”的方式是怎样的？",
    quadrant: Quadrant.BODY,
    options: [
      { text: "I rest when I am exhausted or have nothing else to do.", level: 1 },
      { text: "I schedule rest as a performance tactic to avoid burnout.", level: 2 },
      { text: "I integrate rest as a sacred space for deep integration and renewal.", level: 3 }
    ],
    optionsZh: [
      { text: "我在精疲力竭或无事可做时休息。" },
      { text: "我将休息安排为一种避免倦怠的表现策略。" },
      { text: "我将休息整合为深度整合与更新的神圣空间。" }
    ]
  },
  {
    id: 20,
    text: "How do you view your relationship with large-scale global systems (Economy, Ecology)?",
    textZh: "你如何看待自己与大规模全球系统（经济、生态）的关系？",
    quadrant: Quadrant.VOCATION,
    options: [
      { text: "I feel like a small part that just tries to survive within them.", level: 1 },
      { text: "I study them to find opportunities to gain influence or capital.", level: 2 },
      { text: "I actively work to redesign these systems for regenerative futures.", level: 3 }
    ],
    optionsZh: [
      { text: "我觉得自己只是其中试图生存的一个微小部分。" },
      { text: "我研究它们以寻找获得影响力或资本的机会。" },
      { text: "我积极致力于为再生未来重新设计这些系统。" }
    ]
  }
];
