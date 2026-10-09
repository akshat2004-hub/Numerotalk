import { calculateVedicGrid, VedicGridResult, NUMBER_ATTRIBUTES } from './grid';

export interface VastuDirectionAnalysis {
  directionEn: string;
  directionHi: string;
  number: number;
  element: string;
  roomUsageEn: string;
  roomUsageHi: string;
  status: 'Empowered' | 'Balanced' | 'Deficient / Missing';
  statusHi: 'अति ऊर्जावान' | 'संतुलित' | 'कमजोर / दोषयुक्त';
  remedyEn: string;
  remedyHi: string;
}

export interface VastuNumerologyResult {
  grid: VedicGridResult;
  directions: VastuDirectionAnalysis[];
  elementDominanceEn: string;
  elementDominanceHi: string;
  brahmasthanBalanceEn: string;
  brahmasthanBalanceHi: string;
  summaryEn: string;
  summaryHi: string;
}

export function calculateVastuNumerology(dob: string | Date): VastuNumerologyResult {
  const grid = calculateVedicGrid(dob);
  const { counts } = grid;

  const ROOM_USAGES: Record<number, { en: string; hi: string }> = {
    1: { en: 'North: Main Entrance, Water features, Workstation, Wealth locker', hi: 'उत्तर: मुख्य द्वार, जल स्रोत, अध्ययन कक्ष, धन तिजोरी' },
    2: { en: 'South-West: Master Bedroom, Heavy storage, Stability zone', hi: 'दक्षिण-पश्चिम: मुख्य शयनकक्ष, भारी सामान, स्थिरता क्षेत्र' },
    3: { en: 'East: Living Room, Balcony, Family gathering, Morning sun', hi: 'पूर्व: बैठक कक्ष, बालकनी, पारिवारिक संवाद, सूर्य प्रकाश' },
    4: { en: 'South-East: Kitchen, Electric panels, Inverter, Fire appliances', hi: 'दक्षिण-पूर्व: रसोईघर, बिजली मीटर, हीटर, अग्निकोण' },
    5: { en: 'Center (Brahmasthan): Open courtyard, Light furniture, Free airflow', hi: 'मध्य (ब्रह्मस्थान): खुला आँगन, हल्का स्थान, वायु संचार' },
    6: { en: 'North-West: Guest Room, Finished goods storage, Parking', hi: 'उत्तर-पश्चिम: अतिथि कक्ष, तैयार माल, वाहन पार्किंग' },
    7: { en: 'West: Children study room, Dining area, Sunset view', hi: 'पश्चिम: बच्चों का कक्ष, भोजन कक्ष, पश्चिम मुखी खिड़कियां' },
    8: { en: 'North-East (Ishan): Puja Room, Meditation altar, Underground water tank', hi: 'उत्तर-पूर्व (ईशान): पूजा घर, ध्यान कक्ष, भूमिगत जल' },
    9: { en: 'South: Electrical appliances, Overhead tank, High boundary wall', hi: 'दक्षिण: भारी निर्माण, प्रतिष्ठा क्षेत्र, अग्नि उपकरण' },
  };

  const VASTU_REMEDIES: Record<number, { en: string; hi: string }> = {
    1: { en: 'Place a small indoor water fountain or brass Kuber idol in the North.', hi: 'उत्तर दिशा में छोटा फव्वारा या पीतल की कुबेर प्रतिमा स्थापित करें।' },
    2: { en: 'Place yellow curtains or a pair of brass swans in the South-West.', hi: 'दक्षिण-पश्चिम में पीले पर्दे अथवा पीतल के हंस का जोड़ा रखें।' },
    3: { en: 'Hang a wooden wind chime or keep a healthy green plant in the East.', hi: 'पूर्व दिशा में लकड़ी का विंड चाइम लगाएं या हरा पौधा रखें।' },
    4: { en: 'Keep a green money plant or light a ghee lamp facing South-East.', hi: 'आग्नेय कोण (दक्षिण-पूर्व) में मनी प्लांट रखें या घी का दीपक प्रज्वलित करें।' },
    5: { en: 'Keep the center (Brahmasthan) clutter-free; hang a faceted crystal globe.', hi: 'घर का केंद्र (ब्रह्मस्थान) पूर्णतः स्वच्छ व हल्का रखें।' },
    6: { en: 'Hang a 6-pipe silver or white metallic wind chime in the North-West.', hi: 'वायव्य (उत्तर-पश्चिम) में 6 छड़ों वाला चांदी या सफेद विंड चाइम लगाएं।' },
    7: { en: 'Place a small white quartz crystal cluster in the West zone.', hi: 'पश्चिम दिशा में श्वेत स्फटिक क्लस्टर या चांदी का सिक्का रखें।' },
    8: { en: 'Keep the North-East impeccably clean; place a bowl of Gangajal or crystal.', hi: 'ईशान कोण को सदैव स्वच्छ व हल्का रखें तथा गंगाजल या स्फटिक रखें।' },
    9: { en: 'Display a warm red lamp or picture of rising sun on the South wall.', hi: 'दक्षिण दीवार पर लाल प्रकाश या उगते सूर्य का चित्र लगाएं।' },
  };

  const directions: VastuDirectionAnalysis[] = [];

  for (let n = 1; n <= 9; n++) {
    const c = counts[n] || 0;
    const attr = NUMBER_ATTRIBUTES[n];
    const usage = ROOM_USAGES[n];
    const remedy = VASTU_REMEDIES[n];

    let status: VastuDirectionAnalysis['status'] = 'Deficient / Missing';
    let statusHi: VastuDirectionAnalysis['statusHi'] = 'कमजोर / दोषयुक्त';

    if (c >= 2) {
      status = 'Empowered';
      statusHi = 'अति ऊर्जावान';
    } else if (c === 1) {
      status = 'Balanced';
      statusHi = 'संतुलित';
    }

    directions.push({
      directionEn: `${attr.direction} (${attr.element})`,
      directionHi: `${attr.direction} (${attr.element})`,
      number: n,
      element: attr.element,
      roomUsageEn: usage.en,
      roomUsageHi: usage.hi,
      status,
      statusHi,
      remedyEn: remedy.en,
      remedyHi: remedy.hi
    });
  }

  const hasCenter = (counts[5] || 0) > 0;
  const brahmasthanBalanceEn = hasCenter
    ? 'Center Brahmasthan (Number 5) is present and stable, radiating balance across all 8 zones.'
    : 'Center Brahmasthan (Number 5) is missing in your grid. Ensure the center of your house is open and uncluttered.';
  const brahmasthanBalanceHi = hasCenter
    ? 'ब्रह्मस्थान (अंक 5) ग्रिड में उपस्थित है, जो सभी दिशाओं में सकारात्मक संतुलन बनाए रखता है।'
    : 'ग्रिड में अंक 5 अनुपस्थित है। घर के मध्य भाग को पूर्णतः खाली और स्वच्छ रखें ताकि ऊर्जा का प्रवाह बना रहे।';

  return {
    grid,
    directions,
    elementDominanceEn: `Balanced across Vedic directions. Strengthen missing areas with spatial remedies.`,
    elementDominanceHi: `वैदिक दिशाओं में संतुलित प्रभाव। अनुपस्थित दिशाओं को वास्तु उपायों से सुदृढ़ करें।`,
    brahmasthanBalanceEn,
    brahmasthanBalanceHi,
    summaryEn: `Vastu numerology maps your personal cosmic grid onto living architecture. By harmonizing missing directions, domestic tranquility and financial flow naturally amplify.`,
    summaryHi: `वास्तु अंकज्योतिष आपकी जन्म ऊर्जा को आपके निवास के साथ जोड़ता है। अनुपस्थित दिशाओं के संतुलन से घर में सुख, शांति और समृद्धि की वृद्धि होती है।`
  };
}
