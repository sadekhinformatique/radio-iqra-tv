
import pg from 'pg';
const { Client } = pg;

const connectionString = 'postgresql://postgres:Lavoixdesaintcoran@db.kxzolskpgvbrosaibmqr.supabase.co:5432/postgres';

async function main() {
  const client = new Client({ connectionString });
  try {
    await client.connect();
    const sql = `
      ALTER TABLE public.sourates ENABLE ROW LEVEL SECURITY;
      DROP POLICY IF EXISTS "Public can view sourates" ON public.sourates;
      CREATE POLICY "Public can view sourates" ON public.sourates FOR SELECT USING (true);
      DROP POLICY IF EXISTS "Auth manage sourates" ON public.sourates;
      CREATE POLICY "Auth manage sourates" ON public.sourates FOR ALL USING (auth.role() = 'authenticated');

      DROP POLICY IF EXISTS "Public storage sourates" ON storage.objects;
      CREATE POLICY "Public storage sourates" ON storage.objects FOR SELECT USING (bucket_id = 'sourates-audio');
      DROP POLICY IF EXISTS "Auth storage sourates" ON storage.objects;
      CREATE POLICY "Auth storage sourates" ON storage.objects FOR ALL USING (bucket_id = 'sourates-audio' AND auth.role() = 'authenticated');
    `;
    await client.query(sql);
    console.log('Sourates RLS applied');
  } catch (err) { console.error(err); } finally { await client.end(); }
}
main();
