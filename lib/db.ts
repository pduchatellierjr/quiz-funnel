import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// Helper to insert quiz response
export async function insertQuizResponse(data: {
  email: string;
  name: string;
  weddingDate?: string;
  primaryFear: string;
  planningStage: string;
  stylePreference: number;
  archetype: string;
  recommendedPackage: string;
}) {
  const { data: response, error } = await supabase
    .from('quiz_responses')
    .insert([
      {
        email: data.email,
        name: data.name,
        wedding_date: data.weddingDate || null,
        primary_fear: data.primaryFear,
        planning_stage: data.planningStage,
        style_preference: data.stylePreference,
        archetype: data.archetype,
        recommended_package: data.recommendedPackage,
        completed_at: new Date().toISOString(),
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return response;
}

// Helper to fetch quiz response by ID
export async function getQuizResponse(id: string) {
  const { data, error } = await supabase
    .from('quiz_responses')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}
