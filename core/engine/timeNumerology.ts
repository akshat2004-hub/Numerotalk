import { reduceToSingleDigit } from './numerology';

export interface TimePredictionResult {
  hours: number;
  minutes: number;
  timeString: string;
  hourReduced: number;
  minuteReduced: number;
  totalReduced: number;
  planetaryHourEn: string;
  planetaryHourHi: string;
  omenQuality: 'Auspicious / Shubh' | 'Moderate / Madhyam' | 'Challenging / Varjya';
  omenQualityHi: 'अमृत / शुभ' | 'मध्यम / सामान्य' | 'सावधानी / वर्ज्य';
  guidanceEn: string;
  guidanceHi: string;
  bestSuitedForEn: string[];
  bestSuitedForHi: string[];
}

const PLANETARY_HOURS: Record<number, { en: string; hi: string }> = {
  1: { en: 'Surya Hora (Sun) - Authority & Government work', hi: 'सूर्य होरा - राजकाज, उच्चाधिकारी से भेंट व मान-सम्मान' },
  2: { en: 'Chandra Hora (Moon) - Creativity, Travel & Public relations', hi: 'चन्द्र होरा - यात्रा, कला, जनसंपर्क व जल संबंधी कार्य' },
  3: { en: 'Guru Hora (Jupiter) - Learning, Finance, Deals & Auspicious starts', hi: 'गुरु होरा - नवीन कार्य प्रारंभ, अध्ययन, निवेश व धार्मिक अनुष्ठान' },
  4: { en: 'Rahu Kaal Sub-vibration - Deep research & Tech strategy', hi: 'राहु प्रभाव - शोध, गुप्त योजना व तकनीकी कार्य' },
  5: { en: 'Budh Hora (Mercury) - Business, Trading, Accounting & Contracts', hi: 'बुध होरा - व्यापार, बहीखाता, संचार व अनुबंध हस्ताक्षर' },
  6: { en: 'Shukra Hora (Venus) - Relationships, Luxury, Purchase & Art', hi: 'शुक्र होरा - प्रेम संबंध, वाहन/आभूषण क्रय व मनोरंजन' },
  7: { en: 'Ketu Vibration - Meditation, Healing & Solitude', hi: 'केतु प्रभाव - योग, ध्यान, चिकित्सा व आत्म-मंथन' },
  8: { en: 'Shani Hora (Saturn) - Machinery, Real estate, Labor & Contracts', hi: 'शनि होरा - भूमि, भवन, मशीनरी व दीर्घकालिक समझौते' },
  9: { en: 'Mangal Hora (Mars) - Sports, Action, Disputes & Bold moves', hi: 'मंगल होरा - साहस, खेलकूद, पुलिस/सेना व त्वरित निर्णय' },
};

export function calculateTimeNumerology(hours: number, minutes: number): TimePredictionResult {
  const h = Math.min(23, Math.max(0, hours));
  const m = Math.min(59, Math.max(0, minutes));

  const hourReduced = reduceToSingleDigit(h === 0 ? 9 : h);
  const minuteReduced = reduceToSingleDigit(m === 0 ? 9 : m);
  const totalReduced = reduceToSingleDigit(h + m);

  const hora = PLANETARY_HOURS[totalReduced] || PLANETARY_HOURS[1];

  let omenQuality: TimePredictionResult['omenQuality'] = 'Moderate / Madhyam';
  let omenQualityHi: TimePredictionResult['omenQualityHi'] = 'मध्यम / सामान्य';

  if ([1, 3, 5, 6].includes(totalReduced)) {
    omenQuality = 'Auspicious / Shubh';
    omenQualityHi = 'अमृत / शुभ';
  } else if ([4, 8].includes(totalReduced)) {
    omenQuality = 'Challenging / Varjya';
    omenQualityHi = 'सावधानी / वर्ज्य';
  }

  const timeString = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;

  const guidanceEn = `The cosmic frequency at ${timeString} vibrates at root number ${totalReduced} (${hora.en}). This moment is ${omenQuality.toLowerCase()} for decision making.`;
  const guidanceHi = `समय ${timeString} पर ब्रह्मांडीय ऊर्जा अंक ${totalReduced} (${hora.hi}) से संचालित है। यह समय निर्णय और संकल्प हेतु ${omenQualityHi} है।`;

  const bestSuitedForEn = [
    `Ruling vibration: ${totalReduced}`,
    `Energy: ${hora.en}`,
    omenQuality === 'Auspicious / Shubh' ? 'Ideal for signing contracts & discussions' : 'Avoid impulsive risks; practice calm patience'
  ];

  const bestSuitedForHi = [
    `प्रमुख अंक ऊर्जा: ${totalReduced}`,
    `होरा प्रभाव: ${hora.hi}`,
    omenQuality === 'Auspicious / Shubh' ? 'नवीन कार्य, वार्ता व हस्ताक्षर हेतु श्रेष्ठ' : 'जल्दबाजी से बचें और सोच-समझकर कदम उठाएं'
  ];

  return {
    hours: h,
    minutes: m,
    timeString,
    hourReduced,
    minuteReduced,
    totalReduced,
    planetaryHourEn: hora.en,
    planetaryHourHi: hora.hi,
    omenQuality,
    omenQualityHi,
    guidanceEn,
    guidanceHi,
    bestSuitedForEn,
    bestSuitedForHi
  };
}
