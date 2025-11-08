require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const TSV_PATH = path.join(__dirname, 'brand_ratings_data.tsv');

async function main() {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
    console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_KEY in environment');
    process.exit(1);
  }

  if (!fs.existsSync(TSV_PATH)) {
    console.error('TSV file not found at', TSV_PATH);
    process.exit(1);
  }

  const fileContent = fs.readFileSync(TSV_PATH, 'utf-8');
  const lines = fileContent.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);

  if (lines.length === 0) {
    console.error('TSV file is empty');
    process.exit(1);
  }

  const rows = lines.map((line, index) => {
    const parts = line.split('\t');
    if (parts.length < 10) {
      throw new Error(`Invalid TSV row at line ${index + 1}: expected 10 columns, got ${parts.length}`);
    }

    const [
      id,
      brandId,
      userIp,
      potency,
      flavor,
      effects,
      value,
      overall,
      comment,
      createdAt
    ] = parts;

    const cleanValue = (value) => {
      if (value === '\\N' || value === undefined) return null;
      return value;
    };

    const toNumber = (value) => {
      const num = Number(value);
      if (!Number.isFinite(num)) return null;
      return num;
    };

    return {
      id,
      brand_id: brandId,
      user_ip: cleanValue(userIp),
      potency_rating: toNumber(potency),
      flavor_rating: toNumber(flavor),
      effects_rating: toNumber(effects),
      value_rating: toNumber(value),
      overall_rating: toNumber(overall),
      comment: cleanValue(comment) ?? '',
      created_at: cleanValue(createdAt)
    };
  });

  console.log(`Preparing to insert ${rows.length} rating rows...`);

  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });

  const chunkSize = 100;
  for (let i = 0; i < rows.length; i += chunkSize) {
    const chunk = rows.slice(i, i + chunkSize);
    console.log(`Inserting rows ${i + 1}-${i + chunk.length}...`);
    const { error } = await supabase.from('brand_ratings').upsert(chunk, { onConflict: 'id' });
    if (error) {
      console.error('Error inserting chunk:', error);
      process.exit(1);
    }
  }

  console.log('✅ Import complete!');
}

main().catch((err) => {
  console.error('Unexpected error:', err);
  process.exit(1);
});
