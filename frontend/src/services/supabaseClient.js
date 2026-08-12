import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://fcyvfhzrnpgwgdurpzjz.supabase.co';
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_gF0ZZyB38oQf2wReYAcXbg_bJTYrBEn';

export const supabase = createClient(supabaseUrl, supabasePublishableKey);

/**
 * Stores/upserts the created user ID and user profile data into Supabase `users` table
 * @param {Object} userData 
 */
export const syncUserToSupabase = async (userData) => {
  if (!userData || !userData.id) return;

  try {
    const { data, error } = await supabase
      .from('users')
      .upsert(
        {
          id: userData.id,
          email: userData.email,
          first_name: userData.firstName,
          last_name: userData.lastName,
          headline: userData.headline || '',
          location: userData.location || '',
          role: userData.role || 'ROLE_USER',
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'id' }
      );

    if (error) {
      console.warn('Supabase table sync notice:', error.message);
    } else {
      console.log('User synced to Supabase users table successfully:', userData.id);
    }
  } catch (err) {
    console.error('Failed to sync user to Supabase:', err);
  }
};
