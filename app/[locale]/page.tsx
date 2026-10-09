'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  User,
  Calendar,
  Phone,
  Camera,
  Trash2,
  Sparkles,
  ArrowRight,
  Sun,
  CheckCircle2,
  AlertTriangle,
  Palette,
  Check
} from 'lucide-react';
import { Link } from '@/i18n/routing';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { PredictionCard } from '@/components/ui/PredictionCard';
import { NumberBadge } from '@/components/ui/NumberBadge';
import { VedicGrid } from '@/components/VedicGrid';
import { useNumerologyStore } from '@/lib/store/useNumerologyStore';
import {
  calculateMulank,
  calculateBhagyank,
  calculateDestinyNumber,
  transliterateDevanagari,
  numerologyService
} from '@/lib';
import { NumberReading } from '@/types';
import { cn } from '@/lib/utils';

export default function UserDetailPage() {
  const t = useTranslations('profile');
  const tc = useTranslations('common');
  const locale = (useLocale() || 'en') as 'en' | 'hi';

  const { profile, setProfile } = useNumerologyStore();

  const [reading, setReading] = useState<NumberReading | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(profile.image || '');

  const profileSchema = z.object({
    name: z.string().min(2, { message: locale === 'hi' ? 'नाम कम से कम 2 अक्षरों का होना चाहिए' : 'Name must be at least 2 characters' }),
    mobile: z.string().regex(/^\d{10}$/, { message: locale === 'hi' ? '10 अंकों का वैध मोबाइल नंबर दर्ज करें' : 'Enter a valid 10-digit mobile number' }),
    dob: z.string().min(1, { message: locale === 'hi' ? 'जन्म तिथि आवश्यक है' : 'Date of Birth is required' }),
    birthTime: z.string().optional(),
    consent: z.boolean().refine(val => val === true, { message: tc('consentRequired') }),
    destinySystem: z.enum(['chaldean', 'pythagorean'])
  });

  type FormValues = z.infer<typeof profileSchema>;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm<FormValues>({
    resolver: zodResolver(profileSchema) as any,
    defaultValues: {
      name: profile.name || 'Rahul Sharma',
      mobile: profile.mobile || '9876543210',
      dob: profile.dob || '1995-10-23',
      birthTime: profile.birthTime || '10:30',
      consent: profile.consent ?? true,
      destinySystem: profile.destinySystem || 'chaldean'
    }
  });

  const watchedName = watch('name');
  const watchedDob = watch('dob');
  const watchedSystem = watch('destinySystem');
  const watchedConsent = watch('consent');

  // Live transliteration — only rerun when name changes
  const translitInfo = useMemo(
    () => transliterateDevanagari(watchedName || ''),
    [watchedName]
  );

  // Core numbers — each memoized to its own dependency
  const mulankData = useMemo(
    () => watchedDob ? calculateMulank(watchedDob) : { mulank: 5, compoundStr: '23/5', dayNumber: 23 },
    [watchedDob]
  );
  const bhagyankData = useMemo(
    () => watchedDob ? calculateBhagyank(watchedDob) : { bhagyank: 3, compoundStr: '30/3', rawSum: 30 },
    [watchedDob]
  );
  const destinyData = useMemo(
    () => calculateDestinyNumber(watchedName || 'Rahul Sharma', watchedSystem || 'chaldean'),
    [watchedName, watchedSystem]
  );

  useEffect(() => {
    numerologyService.getNumberReading(mulankData.mulank, locale).then(setReading);
  }, [mulankData.mulank, locale]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setImagePreview(base64);
        setProfile({ image: base64 });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview('');
    setProfile({ image: '' });
  };

  const onSubmit = (data: FormValues) => {
    setProfile({
      name: data.name,
      mobile: data.mobile,
      dob: data.dob,
      birthTime: data.birthTime,
      consent: data.consent,
      destinySystem: data.destinySystem,
      image: imagePreview
    });
  };

  return (
    <div className="space-y-6 sm:space-y-7 max-w-[1200px]">
      {/* 5. MAIN CONTENT HEADER */}
      <SectionHeader
        title={locale === 'hi' ? 'उपयोगकर्ता विवरण एवं ' : 'User Detail & '}
        goldTitle={locale === 'hi' ? 'ग्रिड विश्लेषण' : 'Grid Analysis'}
        subtitle={
          locale === 'hi'
            ? 'अपनी जन्म तिथि और नाम दर्ज करके व्यक्तिगत वैदिक एवं लो शू ऊर्जा मानचित्र तैयार करें।'
            : 'Enter your birth details and name to generate your personalized Vedic & Lo Shu energy map.'
        }
        badge={locale === 'hi' ? 'वैदिक अंकशास्त्र · मॉड्यूल 01' : 'VEDIC ALMANAC · MODULE 01'}
        showOrbit={true}
      />

      {/* 7. FORM CARD (24px radius with semantic tokens) */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-[var(--surface)] rounded-[24px] border border-[var(--border)] shadow-xs p-5 sm:p-6 lg:p-7 transition-shadow"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-8 items-center">
          
          {/* LEFT: Profile photo section */}
          <div className="lg:col-span-4 flex flex-col items-center text-center space-y-2">
            <div className="relative group">
              <div className="w-22 h-22 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-dashed border-[#F59E0B] bg-[#FFFBF6] flex items-center justify-center shadow-xs">
                {imagePreview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={imagePreview}
                    alt="User Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-9 h-9 text-[#94A3B8] stroke-[1.5]" />
                )}
              </div>

              {/* Small gold camera button */}
              <label
                className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-[#D97706] hover:bg-[#B45309] text-white flex items-center justify-center cursor-pointer shadow-xs transition-all hover:scale-105 border-2 border-white"
                title="Upload Photo"
              >
                <Camera className="w-3.5 h-3.5 stroke-[2]" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>

            <div className="text-center space-y-0.5">
              <span className="font-semibold text-[#0F172A] text-xs block">
                {locale === 'hi' ? 'प्रोफ़ाइल फोटो' : 'Profile Photo'}
              </span>
              <p className="text-[11px] text-[#64748B]">
                {locale === 'hi' ? 'फोटो अपलोड करें (वैकल्पिक)' : 'Upload photo (optional)'}
              </p>
              {imagePreview && (
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="text-[#EF4444] hover:underline inline-flex items-center gap-1 text-[10.5px] pt-0.5 cursor-pointer"
                >
                  <Trash2 className="w-2.5 h-2.5 stroke-[1.5]" />
                  <span>{locale === 'hi' ? 'हटाएं' : 'Remove'}</span>
                </button>
              )}
            </div>
          </div>

          {/* RIGHT: Form fields (Clean 2-Column Grid) */}
          <div className="lg:col-span-8 space-y-3.5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">
              
              {/* 1. Full Name * */}
              <div>
                <label className="block text-[11.5px] font-medium text-[#475569] mb-1">
                  {locale === 'hi' ? 'पूरा नाम *' : 'Full Name *'}
                </label>
                <div className="h-[38px] rounded-lg bg-white border border-[#E5E7EB] flex items-center px-3 focus-within:border-[#D97706] focus-within:ring-2 focus-within:ring-[#FDE68A] transition-all">
                  <User className="w-3.5 h-3.5 text-[#D97706] stroke-[2] shrink-0" />
                  <input
                    type="text"
                    {...register('name')}
                    placeholder={locale === 'hi' ? 'जैसे: राहुल शर्मा' : 'e.g. Rahul Sharma'}
                    className="w-full pl-2 pr-1 text-[12.5px] text-[#0F172A] placeholder:text-[#94A3B8] bg-transparent outline-none"
                  />
                </div>
                {errors.name && (
                  <p className="text-[#EF4444] text-[11px] mt-0.5">{errors.name.message}</p>
                )}
                {translitInfo.isDevanagari && (
                  <p className="text-[11px] text-[#D97706] mt-1 flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5 stroke-[1.5] shrink-0" />
                    <span>{locale === 'hi' ? 'रोमनीकृत नाम:' : 'Transliteration:'}</span>
                    <strong className="underline decoration-[#D97706] font-medium">{translitInfo.transliterated}</strong>
                  </p>
                )}
              </div>

              {/* 2. Mobile Number * */}
              <div>
                <label className="block text-[11.5px] font-medium text-[#475569] mb-1">
                  {locale === 'hi' ? 'मोबाइल नंबर *' : 'Mobile Number *'}
                </label>
                <div className="h-[38px] rounded-lg bg-white border border-[#E5E7EB] flex items-center px-3 focus-within:border-[#D97706] focus-within:ring-2 focus-within:ring-[#FDE68A] transition-all">
                  <Phone className="w-3.5 h-3.5 text-[#D97706] stroke-[2] shrink-0" />
                  <input
                    type="text"
                    maxLength={10}
                    {...register('mobile')}
                    placeholder="9876543210"
                    className="w-full pl-2 pr-1 text-[12.5px] text-[#0F172A] placeholder:text-[#94A3B8] bg-transparent outline-none font-mono"
                  />
                </div>
                {errors.mobile && (
                  <p className="text-[#EF4444] text-[11px] mt-0.5">{errors.mobile.message}</p>
                )}
              </div>

              {/* 3. Date of Birth * */}
              <div>
                <label className="block text-[11.5px] font-medium text-[var(--text)] mb-1">
                  {locale === 'hi' ? 'जन्म तिथि *' : 'Date of Birth *'}
                </label>
                <div className="h-[38px] rounded-lg bg-[var(--surface)] border border-[var(--border)] flex items-center px-3 focus-within:border-[var(--gold)] focus-within:ring-2 focus-within:ring-[var(--chip-bg)] transition-all">
                  <Calendar className="w-3.5 h-3.5 text-[var(--gold)] stroke-[2] shrink-0" />
                  <input
                    type="date"
                    {...register('dob')}
                    className="w-full pl-2 pr-1 text-[12.5px] text-[var(--heading)] bg-transparent outline-none cursor-pointer"
                  />
                </div>
                {errors.dob && (
                  <p className="text-rose-600 text-[11px] mt-0.5">{errors.dob.message}</p>
                )}
              </div>

              {/* 4. Birth Time (Optional) */}
              <div>
                <label className="block text-[11.5px] font-medium text-[var(--text)] mb-1">
                  {locale === 'hi' ? 'जन्म समय (वैकल्पिक)' : 'Birth Time (Optional)'}
                </label>
                <div className="h-[38px] rounded-lg bg-[var(--surface)] border border-[var(--border)] flex items-center px-3 focus-within:border-[var(--gold)] focus-within:ring-2 focus-within:ring-[var(--chip-bg)] transition-all">
                  <input
                    type="time"
                    {...register('birthTime')}
                    className="w-full pl-1 pr-1 text-[12.5px] text-[var(--heading)] bg-transparent outline-none cursor-pointer"
                  />
                </div>
              </div>

              {/* 5. Destiny System (Compact Segmented Control) */}
              <div className="sm:col-span-2">
                <label className="block text-[11.5px] font-medium text-[var(--text)] mb-1">
                  {locale === 'hi' ? 'नामांक पद्धति (सिस्टम)' : 'Destiny Calculation System'}
                </label>
                <div className="h-[38px] p-0.5 rounded-lg bg-[var(--seg-inactive)] border border-[var(--border)] flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setValue('destinySystem', 'chaldean')}
                    className={cn(
                      'h-full flex-1 rounded-md text-[11px] font-semibold transition-all flex items-center justify-center cursor-pointer',
                      watchedSystem === 'chaldean'
                        ? 'bg-[var(--seg-active)] text-[var(--heading)] shadow-xs'
                        : 'text-[var(--text-muted)] hover:text-[var(--heading)]'
                    )}
                  >
                    Chaldean (Vedic Sacred)
                  </button>
                  <button
                    type="button"
                    onClick={() => setValue('destinySystem', 'pythagorean')}
                    className={cn(
                      'h-full flex-1 rounded-md text-[11px] font-semibold transition-all flex items-center justify-center cursor-pointer',
                      watchedSystem === 'pythagorean'
                        ? 'bg-[var(--seg-active)] text-[var(--heading)] shadow-xs'
                        : 'text-[var(--text-muted)] hover:text-[var(--heading)]'
                    )}
                  >
                    Pythagorean
                  </button>
                </div>
              </div>
            </div>

            {/* 10. CONSENT: Small professional checkbox */}
            <div>
              <label className="flex items-start gap-2 cursor-pointer select-none">
                <div
                  onClick={() => setValue('consent', !watchedConsent, { shouldValidate: true })}
                  className={cn(
                    'w-3.5 h-3.5 rounded mt-0.5 flex items-center justify-center transition-colors shrink-0 border cursor-pointer',
                    watchedConsent
                      ? 'bg-[#D97706] border-[#D97706] text-white'
                      : 'border-[#CBD5E1] bg-white'
                  )}
                >
                  {watchedConsent && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                </div>
                <input
                  type="checkbox"
                  {...register('consent')}
                  className="hidden"
                />
                <span className="text-[11px] text-[#64748B] leading-normal">
                  {locale === 'hi'
                    ? 'मैं DPDP दिशानिर्देशों के अनुसार अपना अंकशास्त्रीय जन्म विवरण सुरक्षित रूप से स्थानीय रूप से संग्रहीत करने की सहमति देता/देती हूँ।'
                    : 'I consent to store my numerological birth details locally on this device in accordance with DPDP privacy guidelines.'}
                </span>
              </label>
              {errors.consent && (
                <p className="text-[#EF4444] text-[10.5px] mt-0.5">{errors.consent.message}</p>
              )}
            </div>

            {/* 11. CALCULATE BUTTON (Compact Primary CTA) */}
            <div className="flex items-center justify-end pt-0.5">
              <button
                type="submit"
                className="btn-gold-gradient h-[38px] px-5 rounded-lg text-xs font-semibold text-white flex items-center gap-1.5 shadow-2xs cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 stroke-[2]" />
                <span>{locale === 'hi' ? 'गणना करें' : 'Calculate Dashboard'}</span>
                <ArrowRight className="w-3.5 h-3.5 stroke-[2]" />
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* CORE NUMBERS DISPLAY ROW (Mulank, Bhagyank, Destiny, Compound) */}
      <div className="space-y-3 pt-1">
        <h2 className="font-serif text-base sm:text-lg font-semibold text-[var(--heading)] flex items-center gap-1.5">
          <Sun className="w-4 h-4 text-[var(--gold)] stroke-[2]" />
          <span>{locale === 'hi' ? 'प्रमुख वैदिक अंक तालिका' : 'Core Planetary Numbers'}</span>
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {/* Mulank Card */}
          <div className="vedic-card p-4 text-center flex flex-col items-center justify-between rounded-[24px]">
            <span className="text-[10.5px] font-bold text-[var(--gold)] uppercase tracking-wider">
              {locale === 'hi' ? 'मूलांक (ड्राइवर)' : 'Mulank (Driver)'}
            </span>
            <div className="my-1.5">
              <NumberBadge number={mulankData.mulank} size="md" />
            </div>
            <div className="text-[11px] text-[var(--text-muted)] font-mono">
              <span>Day: {mulankData.dayNumber}</span>
              <span className="mx-1">•</span>
              <span className="text-[var(--gold)] font-bold">{mulankData.compoundStr}</span>
            </div>
          </div>

          {/* Bhagyank Card */}
          <div className="vedic-card p-4 text-center flex flex-col items-center justify-between rounded-[24px]">
            <span className="text-[10.5px] font-bold text-[var(--gold)] uppercase tracking-wider">
              {locale === 'hi' ? 'भाग्यांक (कंडक्टर)' : 'Bhagyank (Conductor)'}
            </span>
            <div className="my-1.5">
              <NumberBadge number={bhagyankData.bhagyank} size="md" />
            </div>
            <div className="text-[11px] text-[var(--text-muted)] font-mono">
              <span>Sum: {bhagyankData.rawSum}</span>
              <span className="mx-1">•</span>
              <span className="text-[var(--gold)] font-bold">{bhagyankData.compoundStr}</span>
            </div>
          </div>

          {/* Destiny Card */}
          <div className="vedic-card p-4 text-center flex flex-col items-center justify-between rounded-[24px]">
            <span className="text-[10.5px] font-bold text-[var(--gold)] uppercase tracking-wider">
              {locale === 'hi' ? 'नामांक (डेस्टिनी)' : 'Destiny (Namank)'}
            </span>
            <div className="my-1.5">
              <NumberBadge number={destinyData.destinyNumber} size="md" />
            </div>
            <div className="text-[11px] text-[var(--text-muted)] font-mono">
              <span className="capitalize">{watchedSystem}</span>
              <span className="mx-1">•</span>
              <span className="text-[var(--gold)] font-bold">{destinyData.compoundStr}</span>
            </div>
          </div>

          {/* Compound Card */}
          <div className="vedic-card p-4 text-center flex flex-col items-center justify-between rounded-[24px]">
            <span className="text-[10.5px] font-bold text-[var(--gold)] uppercase tracking-wider">
              {locale === 'hi' ? 'संयुक्त ऊर्जा' : 'Compound Vibration'}
            </span>
            <div className="my-1.5 flex items-center justify-center">
              <span className="font-serif text-2xl font-bold text-[var(--gold)]">
                {mulankData.compoundStr}
              </span>
            </div>
            <div className="text-[11px] text-[var(--text-muted)]">
              <span>{locale === 'hi' ? 'दैनिक व भाग्यांक तरंग' : 'Day & Life Path'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3x3 VEDIC GRID + SYNTHESIS & ATTRIBUTES */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
        {/* Vedic Grid Component */}
        <VedicGrid dob={watchedDob} locale={locale} />

        {/* Synthesis & Attributes Card */}
        <div className="space-y-4">
          {reading && (
            <PredictionCard
              title={`${reading.number} — ${locale === 'hi' ? reading.title.hi : reading.title.en}`}
              badge={locale === 'hi' ? reading.planet.hi : reading.planet.en}
              badgeVariant="gold"
              sectionKey="module1_mulank"
              reportSectionKey="module1_mulank"
              icon={<Sun className="w-4 h-4 text-[var(--gold)] stroke-[1.75]" />}
              footer={
                <div className="w-full flex items-center justify-between">
                  <span>
                    {locale === 'hi' ? 'शासक तत्व:' : 'Cosmic Element:'}{' '}
                    <strong className="text-[var(--heading)]">{locale === 'hi' ? reading.element.hi : reading.element.en}</strong>
                  </span>
                  <Link
                    href="/destiny"
                    className="text-[var(--gold)] hover:underline font-semibold flex items-center gap-1"
                  >
                    <span>{locale === 'hi' ? 'नामांक विश्लेषण देखें' : 'View Destiny'}</span>
                    <ArrowRight className="w-3 h-3 stroke-[2]" />
                  </Link>
                </div>
              }
            >
              <p className="text-[var(--text)] leading-relaxed text-[12.5px]">
                {locale === 'hi' ? reading.description.hi : reading.description.en}
              </p>

              {/* Positive Attributes */}
              <div className="pt-1">
                <span className="text-[10.5px] font-semibold text-emerald-700 uppercase tracking-wider block mb-1.5">
                  {locale === 'hi' ? 'सकारात्मक गुण' : 'Positive Attributes'}
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11.5px]">
                  {reading.positiveAttributes.map((attr, i) => (
                    <div
                      key={i}
                      className="p-1.5 rounded-md bg-emerald-50 border border-emerald-200 flex items-center gap-1.5 text-emerald-800"
                    >
                      <CheckCircle2 className="w-3 h-3 text-emerald-600 stroke-[2] shrink-0" />
                      <span>{locale === 'hi' ? attr.hi : attr.en}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Negative / Shadow Attributes */}
              <div className="pt-1">
                <span className="text-[10.5px] font-semibold text-amber-700 uppercase tracking-wider block mb-1.5">
                  {locale === 'hi' ? 'सावधानियां / छाया' : 'Shadow Traits & Cautions'}
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11.5px]">
                  {reading.negativeAttributes.map((attr, i) => (
                    <div
                      key={i}
                      className="p-1.5 rounded-md bg-amber-50 border border-amber-200 flex items-center gap-1.5 text-amber-800"
                    >
                      <AlertTriangle className="w-3 h-3 text-amber-600 stroke-[2] shrink-0" />
                      <span>{locale === 'hi' ? attr.hi : attr.en}</span>
                    </div>
                  ))}
                </div>
              </div>
            </PredictionCard>
          )}

          {/* Lucky Alignment Guide */}
          {reading && (
            <div className="vedic-card p-4 sm:p-5 space-y-3">
              <h4 className="font-serif text-[15px] font-semibold text-[var(--heading)] flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-[var(--gold)] stroke-[1.75]" />
                <span>{locale === 'hi' ? 'शुभ संरेखण मार्गदर्शिका' : 'Lucky Alignment Guide'}</span>
              </h4>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                <div className="p-2 rounded-xl bg-[var(--surface)] border border-[var(--border)]">
                  <span className="text-[10px] text-[var(--text-muted)] block mb-0.5">
                    {locale === 'hi' ? 'शुभ रंग' : 'Lucky Colors'}
                  </span>
                  <span className="font-medium text-[var(--heading)] text-[11.5px]">
                    {reading.luckyColors.map(c => locale === 'hi' ? c.hi : c.en).join(', ')}
                  </span>
                </div>

                <div className="p-2 rounded-xl bg-[var(--surface)] border border-[var(--border)]">
                  <span className="text-[10px] text-[var(--text-muted)] block mb-0.5">
                    {locale === 'hi' ? 'शुभ वार' : 'Lucky Days'}
                  </span>
                  <span className="font-semibold text-[var(--heading)] text-[11.5px]">
                    {reading.luckyDays.map(d => locale === 'hi' ? d.hi : d.en).join(', ')}
                  </span>
                </div>

                <div className="p-2 rounded-xl bg-[var(--surface)] border border-[var(--border)]">
                  <span className="text-[10px] text-[var(--text-muted)] block mb-0.5">
                    {locale === 'hi' ? 'शुभ अंक' : 'Lucky Numbers'}
                  </span>
                  <span className="font-semibold text-emerald-700 text-xs">
                    {reading.luckyNumbers.join(', ')}
                  </span>
                </div>

                <div className="p-2 rounded-xl bg-[var(--surface)] border border-[var(--border)]">
                  <span className="text-[10px] text-[var(--text-muted)] block mb-0.5">
                    {locale === 'hi' ? 'प्रतिकूल अंक' : 'Enemy Numbers'}
                  </span>
                  <span className="font-semibold text-amber-700 text-xs">
                    {reading.unfavorableNumbers.length > 0 ? reading.unfavorableNumbers.join(', ') : 'None'}
                  </span>
                </div>

                <div className="p-2 rounded-xl bg-[var(--surface)] border border-[var(--border)]">
                  <span className="text-[10px] text-[var(--text-muted)] block mb-0.5">
                    {locale === 'hi' ? 'इष्ट देव' : 'Ruling Deity'}
                  </span>
                  <span className="font-medium text-[var(--heading)] text-[11.5px]">
                    {locale === 'hi' ? reading.deity.hi : reading.deity.en}
                  </span>
                </div>

                <div className="p-2 rounded-xl bg-[var(--surface)] border border-[var(--border)]">
                  <span className="text-[10px] text-[var(--text-muted)] block mb-0.5">
                    {locale === 'hi' ? 'शुभ रत्न' : 'Lucky Gemstone'}
                  </span>
                  <span className="font-semibold text-[var(--gold)] text-[11.5px]">
                    {locale === 'hi' ? reading.gemstone.hi : reading.gemstone.en}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
