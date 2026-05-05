const fs = require('fs');
const path = require('path');
const https = require('https');

const dataPath = path.join(__dirname, '..', 'public', 'tafsir', 'tafsir-data.json');
const outDir = path.join(__dirname, '..', 'public', 'tafsir', 'content');
const tafsirData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

const BATCH_SIZE = 5;
const DELAY_BETWEEN_BATCHES = 800;

function fetchTafsir(slug) {
  return new Promise((resolve) => {
    const url = `https://decouvrir-islam.org/tafsir/${slug}/`;
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    }, res => {
      if (res.statusCode !== 200) {
        resolve({ slug, content: '', error: `HTTP ${res.statusCode}` });
        return;
      }
      let html = '';
      res.on('data', c => html += c);
      res.on('end', () => {
        const articleIdx = html.indexOf('<div class="article-content">');
        if (articleIdx === -1) {
          resolve({ slug, content: '', error: 'no-content' });
          return;
        }
        const relatedIdx = html.indexOf('<section class="', articleIdx + 100);
        const endIdx = relatedIdx !== -1 ? relatedIdx : html.length;
        const content = html.substring(articleIdx, endIdx).trim();
        resolve({ slug, content, error: null });
      });
    }).on('error', err => {
      resolve({ slug, content: '', error: err.message });
    });
  });
}

async function main() {
  console.log(`Fetching ${tafsirData.length} tafsir entries...`);
  let success = 0;
  let fail = 0;

  for (let i = 0; i < tafsirData.length; i += BATCH_SIZE) {
    const batch = tafsirData.slice(i, i + BATCH_SIZE);
    const results = await Promise.all(batch.map(item => fetchTafsir(item.slug)));

    for (const result of results) {
      if (result.error) {
        fail++;
        console.log(`  SKIP: ${result.slug} (${result.error})`);
      } else {
        success++;
        const entry = tafsirData.find(e => e.slug === result.slug);
        const output = {
          id: entry?.id,
          surahNumber: entry?.surahNumber,
          surahName: entry?.surahName,
          surahNameAr: entry?.surahNameAr,
          surahNameFr: entry?.surahNameFr,
          title: entry?.title,
          slug: result.slug,
          verses: entry?.verses,
          date: entry?.date,
          content: result.content
        };
        fs.writeFileSync(
          path.join(outDir, `${result.slug}.json`),
          JSON.stringify(output, null, 2),
          'utf8'
        );
        console.log(`  OK: ${result.slug} (${result.content.length} chars)`);
      }
    }

    if (i + BATCH_SIZE < tafsirData.length) {
      await new Promise(r => setTimeout(r, DELAY_BETWEEN_BATCHES));
    }
    console.log(`Progress: ${Math.min(i + BATCH_SIZE, tafsirData.length)}/${tafsirData.length}`);
  }

  console.log(`\nDone! ${success} success, ${fail} failed`);
}

main().catch(console.error);
