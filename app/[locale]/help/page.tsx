'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useLocale } from 'next-intl';
import {
  HelpCircle,
  Search,
  Sparkles,
  ChevronDown,
  BookOpen,
  Grid,
  Laptop,
  Pill,
  ShieldCheck,
  Lightbulb,
  Table
} from 'lucide-react';
import { SectionHeader } from '@/frontend/components/ui/SectionHeader';
import { Input } from '@/frontend/components/ui/Input';
import lettersData from '@/mocks/rules/letters.json';

interface FaqItem {
  id: string;
  question: { en: string; hi: string };
  answer: { en: string; hi: string };
  extraContent?: React.ReactNode;
}

interface FaqSection {
  id: string;
  title: { en: string; hi: string };
  icon: React.ReactNode;
  items: FaqItem[];
}

export default function HelpPage() {
  const locale = (useLocale() || 'en') as 'en' | 'hi';
  const [search, setSearch] = useState('');
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

  const lettersMap = lettersData.letters as Record<string, number>;
  const numberGroups = lettersData.numberGroups as Record<string, string[]>;

  // Build the FAQ hierarchy
  const sections: FaqSection[] = useMemo(() => [
    {
      id: 'basics',
      title: { en: 'Basics & Core Numbers', hi: 'मूल सिद्धांत एवं प्रमुख अंक' },
      icon: <BookOpen className="w-4 h-4 text-[var(--gold)]" />,
      items: [
        {
          id: 'driver-conductor',
          question: {
            en: 'What is the difference between Mulank (Driver) and Bhagyank (Conductor / Life Path)?',
            hi: 'मूलांक (ड्राइवर) और भाग्यांक (कंडक्टर) में क्या अंतर है?'
          },
          answer: {
            en: 'Mulank (Driver) is derived from the day you were born (e.g. 23rd -> 2+3 = 5). It dictates your inner persona, instinctual drives, and personal identity. Bhagyank (Conductor / Life Path) is the reduced sum of your complete birth date (Day + Month + Year). It reveals your overarching life destiny, karmic path, and sustained career direction.',
            hi: 'मूलांक आपके जन्म दिवस का एकल अंक है (जैसे 23 तारीख -> 2+3 = 5)। यह आपके अंतर्मन, स्वाभाविक आदतों और व्यक्तिगत स्वभाव को दर्शाता है। भाग्यांक आपकी सम्पूर्ण जन्म तिथि (दिन + माह + वर्ष) का कुल योग है, जो आपके जीवन के दीर्घकालिक लक्ष्य, कर्म मार्ग और भाग्य को प्रकट करता है।'
          }
        },
        {
          id: 'destiny-calculation',
          question: {
            en: 'How is the Destiny (Name) number calculated?',
            hi: 'नामांक (डेस्टिनी अंक) की गणना कैसे की जाती है?'
          },
          answer: {
            en: 'The Destiny number is calculated using sacred Vedic phonetic values assigned to each letter of your full name. Digits 1 through 8 correspond to specific cosmic vibrations (9 is considered sacred and unassigned). Summing each letter and reducing to a root reveals your outer reputation and commercial resonance.',
            hi: 'नामांक की गणना आपके पूर्ण नाम के प्रत्येक अक्षर के प्राचीन वैदिक ध्वनि-मूल्य (Vedic sound vibrations) के आधार पर की जाती है। 1 से 8 तक के अंक विशिष्ट ग्रहों से जुड़े हैं (9 को ईश्वरीय माना गया है)। सभी अक्षरों का योग नामांक निर्धारित करता है।'
          },
          extraContent: (
            <div className="mt-3 p-3.5 rounded-xl bg-[var(--surface-muted)]/50 border border-[var(--border)] space-y-2">
              <span className="text-xs font-bold font-serif text-[var(--heading)] flex items-center gap-1.5">
                <Table className="w-3.5 h-3.5 text-[var(--gold)]" />
                <span>{locale === 'hi' ? 'वैदिक अक्षर मूल्य सारणी' : 'Vedic Letter Vibration Table'}</span>
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                {Object.entries(numberGroups).map(([num, letters]) => (
                  <div key={num} className="p-2 rounded-lg bg-[var(--surface)] border border-[var(--border)] flex items-center justify-between">
                    <span className="font-bold text-[var(--gold)] font-mono">अंक {num}:</span>
                    <span className="font-mono font-medium text-[var(--heading)]">{letters.join(', ')}</span>
                  </div>
                ))}
              </div>
            </div>
          )
        },
        {
          id: 'compound-numbers',
          question: {
            en: 'What are Compound Numbers and how do they work?',
            hi: 'संयुक्त अंक (Compound Numbers) क्या हैं और इनका क्या महत्व है?'
          },
          answer: {
            en: 'Before reducing to a single-digit root, numbers like 23, 30, or 45 carry their own distinct energetic vibration. For example, Compound 23 reduces to Root 5, but carries the Royal Star of the Lion influence (success through communication and noble friends), whereas Compound 14 reduces to 5 with financial caution warnings.',
            hi: 'एकल अंक में बदलने से पूर्व जैसे 23, 30 या 45 अपनी विशिष्ट ऊर्जा रखते हैं। उदाहरण के लिए, संयुक्त अंक 23 का मूल अंक 5 है, किंतु यह "सिंह का राज-नक्षत्र" प्रभाव देता है (मित्रों व संवाद से सफलता), जबकि 14 का योग भी 5 है किंतु उसमें वित्तीय सतर्कता आवश्यक होती है।'
          }
        },
        {
          id: 'reading-guidelines',
          question: {
            en: 'How to read and synthesize your complete numerology reading?',
            hi: 'अपनी संपूर्ण अंक ज्योतिष गणना का समग्र विश्लेषण कैसे करें?'
          },
          answer: {
            en: 'Begin with your Driver (Mulank) to understand your natural strengths, cross-examine with your Conductor (Bhagyank) for life alignment, check your Destiny for name resonance, and review your Vedic 3x3 Grid for active support planes and missing balancing points.',
            hi: 'सर्वप्रथम अपने मूलांक से अपनी स्वाभाविक क्षमताओं को समझें, फिर भाग्यांक से जीवन की दिशा का मिलान करें, नामांक से सामाजिक छवि देखें, और वैदिक ग्रिड से उपस्थित तलों व उपायों का समन्वय करें।'
          }
        }
      ]
    },
    {
      id: 'grid',
      title: { en: 'Vedic 3x3 Grid', hi: 'वैदिक 3x3 ग्रिड' },
      icon: <Grid className="w-4 h-4 text-[var(--gold)]" />,
      items: [
        {
          id: 'grid-layout',
          question: {
            en: 'How is the Indian Vedic Grid arranged (3 1 9 / 6 7 5 / 2 8 4)?',
            hi: 'भारतीय वैदिक ग्रिड (3 1 9 / 6 7 5 / 2 8 4) की संरचना क्या है?'
          },
          answer: {
            en: 'The Indian Vedic Grid maps numbers into three functional horizontal planes: Top Row (3 1 9) represents Thought, Intellect & Vision; Middle Row (6 7 5) represents Willpower, Family & Emotion; Bottom Row (2 8 4) represents Action, Practicality & Wealth Foundation.',
            hi: 'वैदिक ग्रिड को तीन मुख्य तलों में समझा जाता है: प्रथम पंक्ति (3 1 9) ज्ञान, चेतना व बौद्धिक दृष्टि; मध्य पंक्ति (6 7 5) इच्छाशक्ति, परिवार व भावनात्मक संतुलन; अंतिम पंक्ति (2 8 4) कर्म, व्यावहारिक दक्षता व भौतिक आधार का प्रतीक है।'
          }
        },
        {
          id: 'missing-repeating',
          question: {
            en: 'What do Missing and Repeating Numbers indicate?',
            hi: 'अनुपस्थित और पुनरावृत्त अंकों का क्या अर्थ है?'
          },
          answer: {
            en: 'Missing numbers represent dormant or unmanifested qualities that can be balanced via simple lifestyle remedies, crystals, or colors. Repeating numbers indicate intensified karmic focus—an abundance of that planet’s energy requiring conscious channelization.',
            hi: 'अनुपस्थित अंक सुप्त ऊर्जाओं को दर्शाते हैं जिन्हें रंग, रत्न या आचरण से संतुलित किया जा सकता है। पुनरावृत्त अंक उस ग्रह के अत्यधिक प्रभाव और कर्म क्षेत्र को इंगित करते हैं जिन्हें सही दिशा देना आवश्यक होता है।'
          }
        },
        {
          id: 'yogas-explained',
          question: {
            en: 'What are Vedic Yogas in the grid?',
            hi: 'वैदिक ग्रिड में योग (Yogas) क्या होते हैं?'
          },
          answer: {
            en: 'When all numbers along a vertical, horizontal, or diagonal axis are present (such as 3-1-9 Thought Plane or 2-5-8 Property Yoga), a special cosmic synergy or "Yoga" is activated, conferring natural mastery and protection in those life domains.',
            hi: 'जब किसी पंक्ति, स्तंभ या विकर्ण के सभी अंक ग्रिड में उपस्थित होते हैं (जैसे 3-1-9 ज्ञान तल या 2-5-8 भूमि-भवन योग), तो विशेष वैदिक योग सक्रिय होता है जो संबंधित क्षेत्र में सहज सफलता प्रदान करता है।'
          }
        }
      ]
    },
    {
      id: 'app',
      title: { en: 'Using the App', hi: 'एप्लिकेशन का उपयोग' },
      icon: <Laptop className="w-4 h-4 text-[var(--gold)]" />,
      items: [
        {
          id: 'profile-once',
          question: {
            en: 'Do I need to re-enter my details across different modules?',
            hi: 'क्या मुझे प्रत्येक मॉड्यूल में बार-बार विवरण दर्ज करना होगा?'
          },
          answer: {
            en: 'No. Once you fill your Full Name, Date of Birth, and Birth Time in the User Detail module, all 19 modules immediately compute their specialized calculations for you.',
            hi: 'नहीं। उपयोगकर्ता विवरण (User Detail) में एक बार अपना नाम, जन्म तिथि व समय सुरक्षित करने पर सभी 19 मॉड्यूल स्वतः आपकी व्यक्तिगत गणनाएं प्रदर्शित करते हैं।'
          }
        },
        {
          id: 'add-to-report',
          question: {
            en: 'How does "Add to Report" and PDF Export work?',
            hi: '"रिपोर्ट में जोड़ें" और पीडीएफ एक्सपोर्ट कैसे कार्य करता है?'
          },
          answer: {
            en: 'Every module and remedy includes an "Add to report" button. Selecting these curates a personalized Vedic consultation dossier, which you can preview and download as a high-resolution PDF from the Final Report page.',
            hi: 'प्रत्येक मॉड्यूल और उपाय कार्ड पर "रिपोर्ट में जोड़ें" बटन उपलब्ध है। इन्हें चुनकर आप अपनी संपूर्ण परामर्श रिपोर्ट तैयार कर सकते हैं और फाइनल रिपोर्ट पेज से डाउनलोड कर सकते हैं।'
          }
        },
        {
          id: 'bilingual-switch',
          question: {
            en: 'How do I switch between English and Hindi?',
            hi: 'अंग्रेजी और हिंदी भाषा में कैसे बदलें?'
          },
          answer: {
            en: 'Use the Language switcher pill in the top header (EN / HI). The entire application—including Vedic calculations, interpretations, and PDF previews—instantly adapts.',
            hi: 'शीर्ष हेडर में स्थित भाषा चयन बटन (EN / HI) पर क्लिक करें। पूरी एप्लिकेशन व रिपोर्ट तुरंत चुनी गई भाषा में रूपांतरित हो जाती है।'
          }
        }
      ]
    },
    {
      id: 'remedies',
      title: { en: 'Remedies Master', hi: 'वैदिक उपाय' },
      icon: <Pill className="w-4 h-4 text-[var(--gold)]" />,
      items: [
        {
          id: 'remedy-philosophy',
          question: {
            en: 'What is the philosophy behind Vedic Numerology remedies?',
            hi: 'वैदिक अंकशास्त्र उपायों का मुख्य दर्शन क्या है?'
          },
          answer: {
            en: 'Vedic remedies are practical harmonic adjustments rather than superstitious dogmas. They utilize color therapy, natural crystals, metal hydration (copper/silver), sacred mantras, and compassionate charity to bring internal elemental harmony.',
            hi: 'वैदिक उपाय अंधविश्वास नहीं बल्कि प्रकृति के तत्वों का सामंजस्य हैं। ये रंग चिकित्सा, प्राकृतिक उपरत्न, तांबे-चांदी के पात्र, मंत्र जप और परोपकार द्वारा जीवन ऊर्जा को संतुलित करते हैं।'
          }
        }
      ]
    },
    {
      id: 'privacy',
      title: { en: 'Privacy & Data Security', hi: 'गोपनीयता एवं डेटा सुरक्षा' },
      icon: <ShieldCheck className="w-4 h-4 text-[var(--gold)]" />,
      items: [
        {
          id: 'local-storage-only',
          question: {
            en: 'Where is my personal birth data stored?',
            hi: 'मेरा व्यक्तिगत जन्म विवरण कहाँ सुरक्षित रहता है?'
          },
          answer: {
            en: 'Your profile and calculations are stored exclusively on your local device browser storage. We never transmit or store your birth information on remote external databases.',
            hi: 'आपकी जन्म तिथि व व्यक्तिगत विवरण केवल आपके इस डिवाइस के ब्राउज़र में स्थानीय रूप से सुरक्षित रहता है। कोई भी डेटा बाहरी सर्वर पर संग्रहीत नहीं किया जाता।'
          }
        },
        {
          id: 'clear-data-how',
          question: {
            en: 'How can I completely delete my data?',
            hi: 'मैं अपना डेटा पूरी तरह कैसे मिटा सकता हूँ?'
          },
          answer: {
            en: 'Click on your profile avatar dropdown in the sidebar or top header and choose "Clear My Data". Confirming this action resets all profile records, custom remedies, and stored preferences immediately.',
            hi: 'साइडबार या हेडर में अपने प्रोफ़ाइल नाम पर क्लिक करें और "डेटा हटाएं" (Clear My Data) चुनें। पुष्टि करने पर सभी सहेजे गए विवरण तुरंत रीसेट हो जाएंगे।'
          }
        }
      ]
    },
    {
      id: 'tips',
      title: { en: 'Prediction Tips', hi: 'परामर्श व फलादेश सूत्र' },
      icon: <Lightbulb className="w-4 h-4 text-[var(--gold)]" />,
      items: [
        {
          id: 'consulting-tips',
          question: {
            en: 'Key tips for accurate predictive consultation:',
            hi: 'सटीक भविष्यफल हेतु मुख्य परामर्श सूत्र:'
          },
          answer: {
            en: 'Always analyze the Personal Year cycle alongside current Mahadasha periods. Never evaluate a person by their Driver number in isolation; verify if their Name vibration aligns with their Life Path.',
            hi: 'वर्तमान महादशा के साथ पर्सनल ईयर चक्र का सदैव मिलान करें। केवल मूलांक के आधार पर निर्णय न लें; नामांक और भाग्यांक की परस्पर मित्रता की पुष्टि अवश्य करें।'
          }
        }
      ]
    }
  ], [locale, numberGroups]);

  // Handle URL Hash deep linking (#basics, #grid, #app, #remedies, #privacy, #tips)
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash) {
      const hash = window.location.hash.replace('#', '');
      const matchedSection = sections.find((s) => s.id === hash);
      if (matchedSection) {
        // Open all items in that section
        const updates: Record<string, boolean> = {};
        matchedSection.items.forEach((item) => {
          updates[item.id] = true;
        });
        setOpenItems((prev) => ({ ...prev, ...updates }));

        const el = document.getElementById(hash);
        if (el) {
          setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 200);
        }
      } else {
        // Match specific item id
        const el = document.getElementById(hash);
        if (el) {
          setOpenItems((prev) => ({ ...prev, [hash]: true }));
          setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'center' }), 200);
        }
      }
    }
  }, [sections]);

  const toggleItem = (itemId: string) => {
    setOpenItems((prev) => ({ ...prev, [itemId]: !prev[itemId] }));
  };

  // Filter sections by search query
  const filteredSections = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return sections;

    return sections
      .map((sec) => {
        const matchingItems = sec.items.filter((item) => {
          return (
            item.question.en.toLowerCase().includes(q) ||
            item.question.hi.toLowerCase().includes(q) ||
            item.answer.en.toLowerCase().includes(q) ||
            item.answer.hi.toLowerCase().includes(q)
          );
        });
        return {
          ...sec,
          items: matchingItems
        };
      })
      .filter((sec) => sec.items.length > 0);
  }, [sections, search]);

  return (
    <div className="space-y-6 sm:space-y-7">
      <SectionHeader
        title={locale === 'hi' ? 'सहायता और' : 'Help &'}
        goldTitle={locale === 'hi' ? 'गाइड' : 'Guide'}
        subtitle={
          locale === 'hi'
            ? 'वैदिक अंकशास्त्र के गूढ़ सिद्धांतों, गणना विधियों एवं अनुप्रयोग की संपूर्ण मार्गदर्शिका।'
            : 'Comprehensive Vedic numerology reference, calculation methods, and user guide.'
        }
        icon={<HelpCircle className="w-5 h-5 stroke-[1.5]" />}
      />

      {/* Search Input Box */}
      <div className="vedic-card p-4 sm:p-5">
        <Input
          placeholder={locale === 'hi' ? 'मार्गदर्शिका में खोजें (उदा. मूलांक, ग्रिड, नामांक)...' : 'Search guide & FAQ (e.g. Driver, Grid, Destiny, Report)...'}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          icon={<Search className="w-4 h-4 text-[var(--text-muted)]" />}
        />
      </div>

      {/* Grouped Accordions */}
      <div className="space-y-6">
        {filteredSections.map((sec) => (
          <div key={sec.id} id={sec.id} className="space-y-3 scroll-mt-24">
            {/* Section Header */}
            <div className="flex items-center gap-2 pb-1 border-b border-[var(--border)]">
              {sec.icon}
              <h3 className="font-serif font-bold text-base sm:text-lg text-[var(--heading)]">
                {locale === 'hi' ? sec.title.hi : sec.title.en}
              </h3>
            </div>

            {/* Accordion Items in ONE Card */}
            <div className="vedic-card p-0 overflow-hidden divide-y divide-[var(--border)] shadow-xs">
              {sec.items.map((item) => {
                const isOpen = !!openItems[item.id] || Boolean(search.trim());
                return (
                  <div key={item.id} id={item.id} className="transition-colors scroll-mt-28">
                    <button
                      type="button"
                      onClick={() => toggleItem(item.id)}
                      className="w-full p-4 flex items-center justify-between text-left gap-3 cursor-pointer select-none hover:bg-[var(--surface-muted)]/30 transition-colors"
                    >
                      <span className="font-serif font-bold text-xs sm:text-sm text-[var(--heading)] flex items-center gap-2">
                        <Sparkles className="w-3.5 h-3.5 text-[var(--gold)] shrink-0" />
                        <span>{locale === 'hi' ? item.question.hi : item.question.en}</span>
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 text-[var(--text-muted)] shrink-0 transition-transform duration-200 ${
                          isOpen ? 'rotate-180 text-[var(--gold)]' : ''
                        }`}
                      />
                    </button>

                    {isOpen && (
                      <div className="px-4 sm:px-6 pb-4 pt-1 text-xs sm:text-[13px] text-[var(--text)] leading-relaxed border-t border-[var(--border)]/60 bg-[var(--surface-muted)]/20">
                        <p className="pt-1">{locale === 'hi' ? item.answer.hi : item.answer.en}</p>
                        {item.extraContent}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Disclaimer */}
      <div className="pt-4 border-t border-[var(--border)] text-center text-xs text-[var(--text-muted)]">
        <p className="italic">
          {locale === 'hi'
            ? 'केवल मार्गदर्शन एवं सामान्य जानकारी हेतु।'
            : 'For guidance and entertainment only.'}
        </p>
      </div>
    </div>
  );
}
