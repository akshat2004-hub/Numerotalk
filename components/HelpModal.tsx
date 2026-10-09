'use client';

import React, { useState } from 'react';
import { HelpCircle, X, ChevronDown, Sparkles, BookOpen, Lightbulb, Compass } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLocale } from 'next-intl';

export interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  contextModule?: string;
}

export function HelpModal({ isOpen, onClose, contextModule }: HelpModalProps) {
  const locale = (useLocale() || 'en') as 'en' | 'hi';
  const [openAccordion, setOpenAccordion] = useState<number | null>(0);

  if (!isOpen) return null;

  const faqs = [
    {
      title: {
        en: 'What is the difference between Mulank (Driver) and Bhagyank (Conductor)?',
        hi: 'मूलांक और भाग्यांक में क्या अंतर है?'
      },
      content: {
        en: 'Mulank (Driver) is derived from the day of your birth (e.g. 23rd -> 2+3 = 5). It represents your personality, core instincts, and outward disposition. Bhagyank (Conductor) is the sum of the full date of birth (Day + Month + Year). It reveals your ultimate life destiny, karmic path, and career trajectory.',
        hi: 'मूलांक आपके जन्म दिवस का एकल अंक है (जैसे 23 तारीख -> 2+3 = 5)। यह आपके स्वभाव, आंतरिक सोच और प्राथमिक व्यवहार को दर्शाता है। भाग्यांक आपकी पूरी जन्म तिथि (दिन + माह + वर्ष) का योग है, जो आपके जीवन के अंतिम लक्ष्य, कर्म और भाग्य मार्ग को स्पष्ट करता है।'
      }
    },
    {
      title: {
        en: 'How is the Indian Vedic Grid arranged (3 1 9 / 6 7 5 / 2 8 4)?',
        hi: 'भारतीय वैदिक ग्रिड (3 1 9 / 6 7 5 / 2 8 4) की संरचना कैसे समझें?'
      },
      content: {
        en: 'The Indian Vedic Numerology Grid maps your DOB digits plus Mulank and Bhagyank into 9 directional planes: Top row (3, 1, 9) represents knowledge, spirit, and reputation; Middle row (6, 7, 5) represents luxury, family, and communication; Bottom row (2, 8, 4) represents relationship stability, patience, and wealth foundation.',
        hi: 'भारतीय वैदिक ग्रिड में जन्म तिथि, मूलांक व भाग्यांक के अंकों को 9 ऊर्जा तलों में सजाया जाता है: प्रथम पंक्ति (3, 1, 9) ज्ञान, सूर्य-तेज व पराक्रम; मध्य पंक्ति (6, 7, 5) विलासिता, अंतर्ज्ञान व बुध-व्यापार; अंतिम पंक्ति (2, 8, 4) दांपत्य सुख, न्याय व भूमि-धन आधार का प्रतिनिधित्व करती है।'
      }
    },
    {
      title: {
        en: 'How to harmonize Missing Numbers in your chart?',
        hi: 'चार्ट में अनुपस्थित (मिसिंग) अंकों का संतुलन कैसे बनाएं?'
      },
      content: {
        en: 'Missing numbers are simply latent frequencies. You can activate them through personalized lifestyle habits, auspicious colors, yantras, sacred mantras, and conscious elemental directions without fear.',
        hi: 'मिसिंग नंबर केवल सुप्त ऊर्जाएं हैं। अनुकूल रंगों के प्रयोग, विशिष्ट मंत्रों के जप, रुद्राक्ष, दान-पुण्य और संबंधित दिशा के वास्तु सुधार से इन्हें सहज ही संतुलित किया जा सकता है।'
      }
    },
    {
      title: {
        en: 'Chaldean vs Pythagorean Name Numerology: Which to follow?',
        hi: 'कीरो (Chaldean) बनाम पाइथागोरियन पद्धति: किसे चुनें?'
      },
      content: {
        en: 'Chaldean system is ancient and roots in sacred sound vibrations (values 1 to 8, with 9 reserved for the divine). It is deeply aligned with Vedic phonetics. Pythagorean system uses sequential 1-9 values. Both are supported on this platform so you can cross-compare.',
        hi: 'कीरो (Chaldean) पद्धति प्राचीन ध्वनि-तरंगों पर आधारित है और 1 से 8 तक के मान देती है (9 को पवित्र माना गया है)। वैदिक गणना में यह अत्यंत सटीक मानी जाती है। पाइथागोरियन में 1 से 9 तक मान होते हैं। इस प्लेटफॉर्म पर दोनों प्रणालियां उपलब्ध हैं।'
      }
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-[var(--surface)] border border-[var(--border)] rounded-[24px] shadow-2xl p-5 sm:p-6 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-[var(--border)]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[var(--chip-bg)] border border-[var(--border)] flex items-center justify-center text-[var(--gold)]">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif text-base sm:text-lg font-bold text-[var(--heading)]">
                {locale === 'hi' ? 'वैदिक मार्गदर्शन एवं सूत्र' : 'Vedic Almanac Guide & FAQ'}
              </h3>
              <p className="text-[11px] text-[var(--text-muted)]">
                {locale === 'hi' ? 'अंकशास्त्र के गूढ़ सिद्धांतों की सरल व्याख्या' : 'Essential guidelines for accurate numerological reading'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--heading)] hover:bg-[var(--bg)] transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Accordion List */}
        <div className="py-4 space-y-2.5 max-h-[60vh] overflow-y-auto pr-1">
          {faqs.map((faq, idx) => {
            const isOpen = openAccordion === idx;
            return (
              <div
                key={idx}
                className="border border-[var(--border)] rounded-xl overflow-hidden bg-[var(--bg)] transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenAccordion(isOpen ? null : idx)}
                  className="w-full p-3.5 flex items-center justify-between text-left gap-3 cursor-pointer select-none"
                >
                  <span className="font-serif font-bold text-xs sm:text-sm text-[var(--heading)] flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-[var(--gold)] shrink-0" />
                    <span>{locale === 'hi' ? faq.title.hi : faq.title.en}</span>
                  </span>
                  <ChevronDown
                    className={cn(
                      'w-3.5 h-3.5 text-[var(--text-muted)] shrink-0 transition-transform duration-200',
                      isOpen && 'rotate-180 text-[var(--gold)]'
                    )}
                  />
                </button>

                {isOpen && (
                  <div className="px-3.5 pb-3.5 pt-0 text-xs text-[var(--text)] leading-relaxed border-t border-[var(--border)] bg-[var(--surface)]">
                    <p className="pt-2">{locale === 'hi' ? faq.content.hi : faq.content.en}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-[var(--border)] flex items-center justify-between text-xs text-[var(--text-muted)]">
          <span>For guidance and personal growth</span>
          <button
            type="button"
            onClick={onClose}
            className="btn-gold-gradient px-4 py-1.5 rounded-xl text-white text-xs font-semibold"
          >
            {locale === 'hi' ? 'समझ आ गया' : 'Got it'}
          </button>
        </div>
      </div>
    </div>
  );
}
