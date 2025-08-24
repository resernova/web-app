import { createClient } from '@supabase/supabase-js';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

// Ensure types directory exists
const typesDir = join(process.cwd(), 'src/types');
if (!existsSync(typesDir)) {
  mkdirSync(typesDir, { recursive: true });
}

// Generate types using Supabase JS client
async function generateTypes() {
  console.log('Generating database types...');
  
  const supabase = createClient(supabaseUrl as string, supabaseKey as string);
  
  try {
    const { data, error } = await supabase.rpc('get_types', {
      schema_name: 'public',
    });
    
    if (error) {
      throw error;
    }
    
    if (!data) {
      throw new Error('No types returned from database');
    }
    
    const typeContent = `// This file is auto-generated. Do not edit manually.
// To regenerate, run: npm run generate-types

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

${data}
`;
    
    writeFileSync(join(typesDir, 'database.types.ts'), typeContent);
    console.log('Successfully generated database types');
  } catch (error) {
    console.error('Error generating types:', error);
    process.exit(1);
  }
}

generateTypes();
