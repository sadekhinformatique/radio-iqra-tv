export interface ArabicLetter {
  id: number;
  char: string;
  name: string;
  transliteration: string;
  audio_url: string;
  description?: string;
}

export const arabicAlphabet: ArabicLetter[] = [
  { id: 1, char: 'أ', name: 'Alif', transliteration: 'a', audio_url: 'https://www.asite.com/audio/alif.mp3' },
  { id: 2, char: 'ب', name: 'Ba', transliteration: 'b', audio_url: 'https://www.asite.com/audio/ba.mp3' },
  { id: 3, char: 'ت', name: 'Ta', transliteration: 't', audio_url: 'https://www.asite.com/audio/ta.mp3' },
  { id: 4, char: 'ث', name: 'Tha', transliteration: 'th', audio_url: 'https://www.asite.com/audio/tha.mp3' },
  { id: 5, char: 'ج', name: 'Jim', transliteration: 'j', audio_url: 'https://www.asite.com/audio/jim.mp3' },
  { id: 6, char: 'ح', name: 'Ha', transliteration: 'h', audio_url: 'https://www.asite.com/audio/ha.mp3' },
  { id: 7, char: 'خ', name: 'Kha', transliteration: 'kh', audio_url: 'https://www.asite.com/audio/kha.mp3' },
  { id: 8, char: 'د', name: 'Dal', transliteration: 'd', audio_url: 'https://www.asite.com/audio/dal.mp3' },
  { id: 9, char: 'ذ', name: 'Dhal', transliteration: 'dh', audio_url: 'https://www.asite.com/audio/dhal.mp3' },
  { id: 10, char: 'ر', name: 'Ra', transliteration: 'r', audio_url: 'https://www.asite.com/audio/ra.mp3' },
  { id: 11, char: 'ز', name: 'Zay', transliteration: 'z', audio_url: 'https://www.asite.com/audio/zay.mp3' },
  { id: 12, char: 'س', name: 'Sin', transliteration: 's', audio_url: 'https://www.asite.com/audio/sin.mp3' },
  { id: 13, char: 'ش', name: 'Shin', transliteration: 'sh', audio_url: 'https://www.asite.com/audio/shin.mp3' },
  { id: 14, char: 'ص', name: 'Sad', transliteration: 's', audio_url: 'https://www.asite.com/audio/sad.mp3' },
  { id: 15, char: 'ض', name: 'Dad', transliteration: 'd', audio_url: 'https://www.asite.com/audio/dad.mp3' },
  { id: 16, char: 'ط', name: 'Ta', transliteration: 't', audio_url: 'https://www.asite.com/audio/ta_heavy.mp3' },
  { id: 17, char: 'ظ', name: 'Za', transliteration: 'z', audio_url: 'https://www.asite.com/audio/za.mp3' },
  { id: 18, char: 'ع', name: 'Ain', transliteration: 'ain', audio_url: 'https://www.asite.com/audio/ain.mp3' },
  { id: 19, char: 'غ', name: 'Ghain', transliteration: 'gh', audio_url: 'https://www.asite.com/audio/ghain.mp3' },
  { id: 20, char: 'ف', name: 'Fa', transliteration: 'f', audio_url: 'https://www.asite.com/audio/fa.mp3' },
  { id: 21, char: 'ق', name: 'Qaf', transliteration: 'q', audio_url: 'https://www.asite.com/audio/qaf.mp3' },
  { id: 22, char: 'ك', name: 'Kaf', transliteration: 'k', audio_url: 'https://www.asite.com/audio/kaf.mp3' },
  { id: 23, char: 'ل', name: 'Lam', transliteration: 'l', audio_url: 'https://www.asite.com/audio/lam.mp3' },
  { id: 24, char: 'م', name: 'Mim', transliteration: 'm', audio_url: 'https://www.asite.com/audio/mim.mp3' },
  { id: 25, char: 'ن', name: 'Nun', transliteration: 'n', audio_url: 'https://www.asite.com/audio/nun.mp3' },
  { id: 26, char: 'هـ', name: 'Ha', transliteration: 'h', audio_url: 'https://www.asite.com/audio/ha_light.mp3' },
  { id: 27, char: 'و', name: 'Waw', transliteration: 'w', audio_url: 'https://www.asite.com/audio/waw.mp3' },
  { id: 28, char: 'ي', name: 'Ya', transliteration: 'y', audio_url: 'https://www.asite.com/audio/ya.mp3' },
];
