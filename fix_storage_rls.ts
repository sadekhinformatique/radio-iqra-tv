import pg from 'pg';
const { Client } = pg;

const connectionString = 'postgresql://postgres:Lavoixdesaintcoran@db.kxzolskpgvbrosaibmqr.supabase.co:5432/postgres';

async function main() {
  const client = new Client({ connectionString });
  try {
    await client.connect();
    
    const sql = `
      -- 1. Ensure the bucket exists
      INSERT INTO storage.buckets (id, name, public)
      VALUES ('site-assets', 'site-assets', true)
      ON CONFLICT (id) DO UPDATE SET public = true;

      -- 2. Delete existing policies for this bucket to avoid conflicts
      DELETE FROM pg_policy WHERE polname IN ('Public Access', 'Authenticated users can upload', 'Authenticated users can update', 'Authenticated users can delete') AND polrelid = 'storage.objects'::regclass;

      -- 3. Create policies for 'site-assets' bucket
      
      -- Allow anyone to read files
      CREATE POLICY "Public Access"
      ON storage.objects FOR SELECT
      USING ( bucket_id = 'site-assets' );

      -- Allow authenticated users to upload files
      CREATE POLICY "Authenticated users can upload"
      ON storage.objects FOR INSERT
      TO authenticated
      WITH CHECK ( bucket_id = 'site-assets' );

      -- Allow authenticated users to update their files
      CREATE POLICY "Authenticated users can update"
      ON storage.objects FOR UPDATE
      TO authenticated
      USING ( bucket_id = 'site-assets' );

      -- Allow authenticated users to delete files
      CREATE POLICY "Authenticated users can delete"
      ON storage.objects FOR DELETE
      TO authenticated
      USING ( bucket_id = 'site-assets' );
    `;
    
    await client.query(sql);
    console.log('Storage policies for "site-assets" have been successfully applied.');
  } catch (err) { 
    console.error('Error applying storage policies:', err); 
  } finally { 
    await client.end(); 
  }
}
main();
