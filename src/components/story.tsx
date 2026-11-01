"use client";

import { useState } from "react";

const english = [
  "Shree Mohan Sweets and Namkeen was established on 1st June 1979 by Shree Kambleshbhai Tulsiram Nagar. With a vision to preserve quality, trust, and traditional taste, he started this business and worked tirelessly to build a strong reputation within the community. Through dedication, hard work, and commitment to customer satisfaction, he successfully expanded the business and established a trusted name in the region.",
  "Since 2001, his son, Shree Vijaybhai Kambleshbhai Nagar, has been successfully managing and growing the business. For more than 25 years, he has continued the legacy and values established by his father. Today, Shree Mohan Sweets and Namkeen has earned the trust of over 10,000 satisfied customers and is recognized as one of the most popular and reliable sweet and namkeen shops in the area.",
  "Our customers especially enjoy our freshly prepared Fafda-Jalebi, Khaman, Kachori, Samosa, a wide variety of farsan, sweets, namkeen, and snacks. Every product is prepared using traditional recipes, natural flavors, premium-quality ingredients, and pure desi ghee, ensuring that the authentic taste cherished for generations reaches our customers.",
  "For the past 47 years, we have remained committed to delivering the highest standards of quality, trust, and taste. Our mission continues to be providing authentic flavors, exceptional quality, and memorable experiences to every customer.",
];

const gujarati = [
  "શ્રી મોહન સ્વીટ્સ એન્ડ નમકીનની સ્થાપના 1 જૂન, 1979ના રોજ શ્રી કમલેશભાઈ તુલસીરામ નાગર દ્વારા કરવામાં આવી હતી. ગુણવત્તા, વિશ્વાસ અને પરંપરાગત સ્વાદને જાળવી રાખવાના સંકલ્પ સાથે તેમણે આ વ્યવસાયની શરૂઆત કરી હતી. વર્ષ 1979થી તેમણે અખૂટ મહેનત, સમર્પણ અને ગ્રાહકો પ્રત્યેની નિષ્ઠા દ્વારા દુકાનને એક મજબૂત ઓળખ અપાવી અને વ્યવસાયને સતત આગળ વધાર્યો.",
  "વર્ષ 2001થી તેમના પુત્ર શ્રી વિજયભાઈ કમલેશભાઈ નાગર આ વ્યવસાયનું સફળતાપૂર્વક સંચાલન કરી રહ્યા છે. છેલ્લા 25 વર્ષથી વધુ સમયથી તેઓ તેમના પિતાના મૂલ્યો અને પરંપરાને આગળ વધારી રહ્યા છે. આજે શ્રી મોહન સ્વીટ્સ એન્ડ નમકીન 10,000થી વધુ સંતોષી ગ્રાહકોનો વિશ્વાસ જીત્યું છે અને અમારા વિસ્તારની સૌથી લોકપ્રિય તથા વિશ્વસનીય દુકાનોમાંની એક તરીકે ઓળખાય છે.",
  "અમારા ગ્રાહકો ખાસ કરીને તાજા ફાફડા-જલેબી, ખમણ, કચોરી, સમોસા, વિવિધ પ્રકારના ફરસાણ, મીઠાઈઓ, નમકીન અને નાસ્તાને ખૂબ પસંદ કરે છે. દરેક પ્રોડક્ટ પરંપરાગત વાનગીઓ, કુદરતી સ્વાદ, ઉચ્ચ ગુણવત્તાવાળી સામગ્રી અને શુદ્ધ દેશી ઘીનો ઉપયોગ કરીને તૈયાર કરવામાં આવે છે, જેથી વર્ષોથી જળવાયેલો અસલી સ્વાદ અમારા ગ્રાહકો સુધી પહોંચે.",
  "છેલ્લા 47 વર્ષથી અમે અમારા ગ્રાહકોને શ્રેષ્ઠ ગુણવત્તા, વિશ્વાસ અને સ્વાદ આપવાનો સતત પ્રયત્ન કરી રહ્યા છીએ. અમારી પ્રતિબદ્ધતા આજે પણ એ જ છે, પરંપરાગત સ્વાદ, ઉત્તમ ગુણવત્તા અને યાદગાર અનુભવ દરેક ગ્રાહક સુધી પહોંચાડવાનો.",
];

const closing = {
  en: "From our hearts to your family, we bring the authentic taste of tradition.",
  gu: "અમારા દિલથી તમારા પરિવાર સુધી, પરંપરાના અસલી સ્વાદની મીઠી ભેટ.",
};

export function Story() {
  const [language, setLanguage] = useState<"en" | "gu">("en");
  const paragraphs = language === "en" ? english : gujarati;
  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <h2 className="heading text-4xl">{language === "en" ? "Our story" : "અમારી વાર્તા"}</h2>
        <button
          type="button"
          onClick={() => setLanguage(language === "en" ? "gu" : "en")}
          lang={language === "en" ? "gu" : "en"}
          className="rounded-lg border border-line px-3 py-1.5 font-semibold hover:border-rani"
        >
          {language === "en" ? "ગુજરાતી" : "English"}
        </button>
      </div>
      <div lang={language} className="mt-5 grid max-w-[65ch] gap-4 text-lg leading-relaxed">
        {paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
        <p className="font-display text-2xl font-bold text-rani">{closing[language]}</p>
      </div>
    </div>
  );
}
