
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://kxzolskpgvbrosaibmqr.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt4em9sc2twZ3Zicm9zYWlibXFyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NzMxMjEzMiwiZXhwIjoyMDkyODg4MTMyfQ._ELgegEg_kpzKt6t9vmLtRK3bke2bIUf8sK7kCi_HJE';

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function setup() {
  console.log('--- Setting up Sourates Storage ---');
  const bucketName = 'sourates-audio';
  const { data: buckets } = await supabase.storage.listBuckets();
  if (!buckets?.some(b => b.name === bucketName)) {
    await supabase.storage.createBucket(bucketName, { public: true });
    console.log('Bucket created');
  } else {
    console.log('Bucket already exists');
  }

  console.log('--- Seeding Sourates Data ---');
  const sourates = [
    { number: 1, name_ar: "الفاتحة", name_fr: "Al-Fatiha", text_ar: "بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ (1) الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ (2) الرَّحْمَنِ الرَّحِيمِ (3) مَالِكِ يَوْمِ الدِّينِ (4) إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ (5) اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ (6) صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ (7)", translation_fr: "Au nom d'Allah, le Tout Miséricordieux, le Très Miséricordieux. Louange à Allah, Seigneur de l'univers. Le Tout Miséricordieux, le Très Miséricordieux, Maître du Jour de la rétribution. C'est Toi [Seul] que nous adorons, et c'est Toi [Seul] dont nous implorons secours. Guide-nous dans le droit chemin, le chemin de ceux que Tu as comblés de faveurs, non pas de ceux qui ont encouru Ta colère, ni des égarés.", audio_url: "" },
    { number: 112, name_ar: "الإخلاص", name_fr: "Al-Ikhlas", text_ar: "بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ قُلْ هُوَ اللَّهُ أَحَدٌ (1) اللَّهُ الصَّمَدُ (2) لَمْ يَلِدْ وَلَمْ يُولَدْ (3) وَلَمْ يَكُنْ لَهُ كُفُوًا أَحَدٌ (4)", translation_fr: "Au nom d'Allah, le Tout Miséricordieux, le Très Miséricordieux. Dis : « Il est Allah, Unique. Allah, Le Seul à être imploré pour ce que nous désirons. Il n'a jamais engendré, n'a pas été engendré non plus. Et nul n'est égal à Lui. »", audio_url: "" },
    { number: 113, name_ar: "الفلق", name_fr: "Al-Falaq", text_ar: "بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ (1) مِنْ شَرِّ مَا خَلَقَ (2) وَمِنْ شَرِّ غَاسِقٍ إِذَا وَقَبَ (3) مِنْ شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ (4) وَمِنْ شَرِّ حَاسِدٍ إِذَا حَسَدَ (5)", translation_fr: "Au nom d'Allah, le Tout Miséricordieux, le Très Miséricordieux. Dis : « Je cherche protection auprès du Seigneur de l'aube naissante, contre le mal des êtres qu'Il a créés, contre le mal de l'obscurité quand elle s'approfondit, contre le mal de celles qui soufflent sur les nœuds, et contre le mal de l'envieux quand il envie. »", audio_url: "" },
    { number: 114, name_ar: "الناس", name_fr: "An-Nas", text_ar: "بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ قُلْ أَعُوذُ بِرَبِّ النَّاسِ (1) مَلِكِ النَّاسِ (2) إِلَهِ النَّاسِ (3) مِنْ شَرِّ الْوَسْوَاسِ الْخَنَّاسِ (4) الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ (5) مِنَ الْجِنَّةِ وَالنَّاسِ (6)", translation_fr: "Au nom d'Allah, le Tout Miséricordieux, le Très Miséricordieux. Dis : « Je cherche protection auprès du Seigneur des hommes, Le Souverain des hommes, Dieu des hommes, contre le mal du mauvais conseiller, furtif, qui souffle le mal dans les poitrines des hommes, qu'il soit djinn ou être humain. »", audio_url: "" },
    { number: 103, name_ar: "العصر", name_fr: "Al-Asr", text_ar: "بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ وَالْعَصْرِ (1) إِنَّ الْإِنْسَانَ لَفِي خُسْرٍ (2) إِلَّا الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ وَتَوَاصَوْا بِالْحَقِّ وَتَوَاصَوْا بِالصَّبْرِ (3)", translation_fr: "Au nom d'Allah, le Tout Miséricordieux, le Très Miséricordieux. Par le Temps ! L'homme est certes, en perdition, sauf ceux qui croient et accomplissent les bonnes œuvres, s'enjoignent mutuellement la vérité et s'enjoignent mutuellement l'endurance.", audio_url: "" }
  ];

  for (const s of sourates) {
    const { error } = await supabase.from('sourates').upsert(s, { onConflict: 'number' });
    if (error) console.error(`Error inserting sourate ${s.number}:`, error.message);
    else console.log(`Sourate ${s.number} seeded`);
  }
}

setup();
