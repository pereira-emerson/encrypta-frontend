import { ref } from 'vue';
import { supabase } from '@/lib/supabase';

const userKeyPair = ref(null);

async function handleKeyPairFetch() {
  try {
    const user = await supabase.auth.getUser();
    const { data: key_pairs, error } = await supabase
      .from('key_pairs')
      .select('id, public_key, encrypted_private_key')
      .eq('user_id', user.data.user?.id);

    if (error) {
      console.error('There was an error getting customers:', error);
      return null;
    }

    userKeyPair.value = key_pairs[0];

    return key_pairs;
  } catch (error) {
    console.error('Error thrown:', error);
  }
}

async function handleKeyPairInsert(keyPair) {
  try {
    const user = await supabase.auth.getUser();

    const { error } = await supabase
      .from('key_pairs')
      .insert({
        user_id: user.data.user?.id,
        public_key: keyPair.public,
        encrypted_private_key: keyPair.private,
      });

    if (error) {
      console.error('There was an error inserting keypair:', error);
      return { success: false };
    }

    return { success: true };
  } catch (error) {
    console.error('Error thrown:', error);
    return { success: false };
  }
}

export {
  userKeyPair,
  handleKeyPairFetch,
  handleKeyPairInsert,
};
