import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SURHS_JSON_PATH = path.join(__dirname, '..', 'public', 'quran', 'surahs.json');
const TIMESTAMPS_DIR = path.join(__dirname, '..', 'public', 'quran', 'timestamps');
const API_BASE = 'https://api.alquran.cloud/v1';
const BITRATE = 128000; // 128kbps (API provides 128kbps audio)

// Ensure output directory exists
if (!fs.existsSync(TIMESTAMPS_DIR)) {
  fs.mkdirSync(TIMESTAMPS_DIR, { recursive: true });
}

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    const lib = url.startsWith('https') ? https : http;
    lib.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetchJson(res.headers.location).then(resolve, reject);
      }
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(new Error(`Failed to parse JSON from ${url}: ${e.message}`));
        }
      });
    }).on('error', reject);
  });
}

function fetchBuffer(url) {
  return new Promise((resolve, reject) => {
    const lib = url.startsWith('https') ? https : http;
    lib.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetchBuffer(res.headers.location).then(resolve, reject);
      }
      const chunks = [];
      res.on('data', chunk => chunks.push(chunk));
      res.on('end', () => resolve(Buffer.concat(chunks)));
    }).on('error', reject);
  });
}

function calculateMp3Duration(buffer) {
  // Skip ID3v2 tag if present
  let offset = 0;
  if (buffer[0] === 0x49 && buffer[1] === 0x44 && buffer[2] === 0x33) { // "ID3"
    const size = (buffer[6] << 21) | (buffer[7] << 14) | (buffer[8] << 7) | buffer[9];
    offset = size + 10;
  }

  let totalSamples = 0;
  let sampleRate = 44100;

  // Parse MP3 frames
  while (offset < buffer.length - 4) {
    // Find sync word (0xFF 0xFB or 0xFF 0xF3 or 0xFF 0xF2)
    if (buffer[offset] === 0xFF && (buffer[offset + 1] & 0xE0) === 0xE0) {
      const versionBits = (buffer[offset + 1] >> 3) & 0x03;
      const layerBits = (buffer[offset + 1] >> 1) & 0x03;
      const bitrateIndex = (buffer[offset + 2] >> 4) & 0x0F;
      const sampleRateIndex = (buffer[offset + 2] >> 2) & 0x03;
      const paddingBit = (buffer[offset + 2] >> 1) & 0x01;

      const version = versionBits === 3 ? 1 : versionBits === 2 ? 2 : versionBits === 0 ? 2.5 : -1;
      const layer = layerBits === 3 ? 1 : layerBits === 2 ? 2 : layerBits === 1 ? 3 : -1;

      if (version === -1 || layer === -1 || bitrateIndex === 0 || sampleRateIndex === 3) {
        offset++;
        continue;
      }

      const bitrateTables = {
        1: { 1: [0,32,64,96,128,160,192,224,256,288,320,352,384,416,448], 2: [0,32,48,56,64,80,96,112,128,160,192,224,256,320,384], 3: [0,32,40,48,56,64,80,96,112,128,160,192,224,256,320] },
        2: { 1: [0,32,48,56,64,80,96,112,128,144,160,176,192,224,256], 2: [0,8,16,24,32,40,48,56,64,80,96,112,128,144,160], 3: [0,8,16,24,32,40,48,56,64,80,96,112,128,144,160] },
        2.5: { 1: [0,32,48,56,64,80,96,112,128,144,160,176,192,224,256], 2: [0,8,16,24,32,40,48,56,64,80,96,112,128,144,160], 3: [0,8,16,24,32,40,48,56,64,80,96,112,128,144,160] }
      };

      const sampleRateTable = { 1: [44100,48000,32000], 2: [22050,24000,16000], 2.5: [11025,12000,8000] };

      const bitrate = bitrateTables[version]?.[layer]?.[bitrateIndex] || 128;
      sampleRate = sampleRateTable[version]?.[sampleRateIndex] || 44100;
      const samplesPerFrame = layer === 3 ? (version === 1 ? 1152 : 576) : layer === 2 ? 1152 : 384;
      const frameSize = Math.floor(((samplesPerFrame / 8) * (bitrate * 1000)) / sampleRate) + (paddingBit ? 1 : 0);

      totalSamples += samplesPerFrame;
      offset += frameSize;
    } else {
      offset++;
    }
  }

  return totalSamples / sampleRate;
}

async function getVerseDuration(verseNumber) {
  const audioUrl = `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${verseNumber}.mp3`;
  try {
    const buffer = await fetchBuffer(audioUrl);
    const duration = calculateMp3Duration(buffer);
    return duration > 0 ? duration : null;
  } catch (error) {
    console.error(`    Error fetching verse ${verseNumber}:`, error.message);
    return null;
  }
}

async function generateTimestampsForSurah(surahNumber, numberOfAyahs) {
  console.log(`\nProcessing Surah ${surahNumber} (${numberOfAyahs} verses)...`);
  
  // Get the ayah data from the API
  const surahData = await fetchJson(`${API_BASE}/surah/${surahNumber}/ar.alafasy`);
  if (surahData.code !== 200) {
    throw new Error(`API error for surah ${surahNumber}`);
  }

  const verses = [];
  let cumulativeTime = 0;

  for (let i = 0; i < surahData.data.ayahs.length; i++) {
    const ayah = surahData.data.ayahs[i];
    const verseNum = ayah.numberInSurah;
    
    // Get duration of this individual verse
    const duration = await getVerseDuration(ayah.number);
    
    if (duration !== null && duration > 0) {
      verses.push({
        numberInSurah: verseNum,
        startTime: parseFloat(cumulativeTime.toFixed(3)),
        endTime: parseFloat((cumulativeTime + duration).toFixed(3)),
        duration: parseFloat(duration.toFixed(3))
      });
      cumulativeTime += duration;
    }

    // Progress indicator
    if ((i + 1) % 10 === 0 || i === surahData.data.ayahs.length - 1) {
      console.log(`  Progress: ${i + 1}/${surahData.data.ayahs.length} verses (${cumulativeTime.toFixed(1)}s total so far)`);
    }

    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  const result = {
    surahNumber,
    reciter: 'Alafasy',
    audioUrl: `https://sadekhinformatique.site/coran-audio/Coran-Arabe-Sourate-${String(surahNumber).padStart(3, '0')}.mp3`,
    totalDuration: parseFloat(cumulativeTime.toFixed(3)),
    verses
  };

  // Save to file
  const outputPath = path.join(TIMESTAMPS_DIR, `surah_${surahNumber}_timestamps.json`);
  fs.writeFileSync(outputPath, JSON.stringify(result, null, 2));
  console.log(`  Saved: ${outputPath}`);
  console.log(`  Total duration: ${cumulativeTime.toFixed(2)}s (${(cumulativeTime / 60).toFixed(2)} min)`);

  return result;
}

async function main() {
  console.log('=== Quran Verse Timestamp Generator ===');
  console.log('This script generates verse-level timestamps for full surah audio files.');
  console.log('It uses the Islamic Network API (Alafasy reciter) to measure each verse duration.\n');

  // Load surah metadata
  const surahs = JSON.parse(fs.readFileSync(SURHS_JSON_PATH, 'utf8'));
  console.log(`Loaded ${surahs.length} surahs from surahs.json\n`);

  // Check if we should process all surahs or just specific ones
  const args = process.argv.slice(2);
  let surahsToProcess;

  if (args.length > 0) {
    surahsToProcess = args.map(n => parseInt(n)).filter(n => !isNaN(n));
  } else {
    surahsToProcess = surahs.map(s => s.number);
  }

  console.log(`Will process ${surahsToProcess.length} surahs: ${surahsToProcess.join(', ')}`);

  const results = [];
  for (const surahNum of surahsToProcess) {
    const surahMeta = surahs.find(s => s.number === surahNum);
    if (!surahMeta) {
      console.error(`Surah ${surahNum} not found in metadata`);
      continue;
    }

    try {
      const result = await generateTimestampsForSurah(surahNum, surahMeta.numberOfAyahs);
      results.push(result);
    } catch (error) {
      console.error(`Failed to process surah ${surahNum}:`, error.message);
    }
  }

  console.log(`\n=== Done! Generated timestamps for ${results.length}/${surahsToProcess.length} surahs ===`);
  console.log(`Files saved to: ${TIMESTAMPS_DIR}`);
}

main().catch(console.error);
