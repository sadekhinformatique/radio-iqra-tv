import { useState } from 'react';
import { Quote, RefreshCw } from 'lucide-react';

const QUOTES = [
  { text: 'Certes, avec la difficulté vient la facilité.', reference: 'Sourate Ash-Sharh, 94:5' },
  { text: 'Le meilleur d\'entre vous est celui qui apprend le Coran et l\'enseigne.', reference: 'Sahih al-Bukhari' },
  { text: 'La connaissance est une lumière qu\'Allah place dans le cœur de qui Il veut.', reference: 'Sagesse islamique' },
  { text: 'Un croyant est le miroir de son frère croyant.', reference: 'Hadith' },
  { text: 'Celui qui guide vers un bien est comme celui qui l\'accomplit.', reference: 'Sahih Muslim' },
  { text: 'La piété ne consiste pas à tourner vos visages vers l\'Orient ou l\'Occident. Mais la piété est celle de celui qui croit en Allah.', reference: 'Sourate Al-Baqara, 2:177' },
  { text: 'Cherchez le savoir du berceau jusqu\'à la tombe.', reference: 'Sagesse islamique' },
  { text: 'Dis : « Mes prières, mes actes de dévotion, ma vie et ma mort appartiennent à Allah, Seigneur de l\'Univers. »', reference: 'Sourate Al-An\'am, 6:162' },
];

export default function IslamicQuote() {
  const [quote] = useState(() => QUOTES[Math.floor(Math.random() * QUOTES.length)]);

  return (
    <section className="px-4 lg:px-8 max-w-4xl mx-auto mb-16">
      <div className="relative rounded-2xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-premium opacity-60" />
        <div className="absolute inset-0 islamic-pattern opacity-10" />
        <div className="relative p-8 lg:p-12 text-center">
          <Quote size={32} className="mx-auto mb-6 text-gold-500/40" />
          <p className="text-xl lg:text-2xl font-cairo font-medium text-white leading-relaxed mb-4">
            &ldquo;{quote.text}&rdquo;
          </p>
          <p className="text-sm text-gold-400/80 font-medium">
            — {quote.reference}
          </p>
        </div>
      </div>
    </section>
  );
}
