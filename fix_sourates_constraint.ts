
import pg from 'pg';
const { Client } = pg;

const connectionString = 'postgresql://postgres:Lavoixdesaintcoran@db.kxzolskpgvbrosaibmqr.supabase.co:5432/postgres';

async function main() {
  const client = new Client({ connectionString });
  try {
    await client.connect();
    const sql = `
      ALTER TABLE public.sourates ADD CONSTRAINT sourates_number_unique UNIQUE (number);
    `;
    await client.query(sql);
    console.log('Unique constraint added to sourates.number');
  } catch (err) { console.error(err); } finally { await client.end(); }
}
main();
