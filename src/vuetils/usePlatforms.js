import { supabase } from '../lib/supabase';
import { ref } from 'vue';

const allPlatforms=ref([]);

async function handlePlatformsFetch() {
  try {
    const { data: platforms, error } = await supabase
      .from('integrations')
      .select();

    if (error) {
      console.error('There was an error getting customers:', error);
      return null;
    }
    allPlatforms.value = platforms;
  } catch (error) {
    console.error('Error thrown:', error);
  }
}

export { allPlatforms, handlePlatformsFetch };
