import pg from 'pg';
const { Client } = pg;

const connectionString = 'postgresql://postgres:Lavoixdesaintcoran@db.kxzolskpgvbrosaibmqr.supabase.co:5432/postgres';

async function main() {
  const client = new Client({ connectionString });
  try {
    await client.connect();
    
    const sql = `
      ALTER TABLE public.site_config ADD COLUMN IF NOT EXISTS use_modern_ui BOOLEAN DEFAULT false;
    `;
    
    await client.query(sql);
    console.log('Colonne use_modern_ui ajoutée avec succès.');
  } catch (err) { 
    console.error(err); 
  } finally { 
    await client.end(); 
  }
}
main();
