
import pg from 'pg';
const { Client } = pg;

const connectionString = 'postgresql://postgres:Lavoixdesaintcoran@db.kxzolskpgvbrosaibmqr.supabase.co:5432/postgres';

async function main() {
  const client = new Client({ connectionString });
  try {
    await client.connect();
    const sql = `
      ALTER TABLE public.sourates ADD COLUMN IF NOT EXISTS translation_fr TEXT;
      ALTER TABLE public.sourates ADD COLUMN IF NOT EXISTS audio_url TEXT;
      ALTER TABLE public.sourates ADD COLUMN IF NOT EXISTS number INTEGER;
      ALTER TABLE public.sourates ADD COLUMN IF NOT EXISTS name_ar TEXT;
      ALTER TABLE public.sourates ADD COLUMN IF NOT EXISTS name_fr TEXT;
      ALTER TABLE public.sourates ADD COLUMN IF NOT EXISTS text_ar TEXT;
    `;
    await client.query(sql);
    console.log('Columns added to sourates table');
  } catch (err) { console.error(err); } finally { await client.end(); }
}
main();
