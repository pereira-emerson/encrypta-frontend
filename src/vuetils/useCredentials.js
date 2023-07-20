import { supabase } from '../lib/supabase';
import { ref } from 'vue';
import { handleKeyPairFetch } from './useKeyPair';

const allCredentials = ref([]);

async function handleCredentialsFetch({ customerId }) {
  try {
    const { data: credentials, error } = await supabase
      .from('credentials')
      .select('*, platform:integrations ( id, name, picture, url )')
      .eq('customer_id', customerId);
      
    if (error) {
      console.error('There was an error getting credentials:', error);
      return null;
    }

    allCredentials.value = credentials;
  } catch (error) {
    console.error('Error thrown:', error);
  }
}

async function insertCredentials(
  customer_id,
  integrations,
) {
  const keyPairID = await handleKeyPairFetch();

  if (keyPairID) {
    const credentialsArray = integrations.map((integration) => ({
      key_pair_id: keyPairID[0].id,
      customer_id,
      integration_id: integration,
      username: '',
      password: '',
      status:'PENDING',
    }));

    const { error } = await supabase
      .from('credentials')
      .insert(credentialsArray)
      .select();

    if (error) {
      return { status: 'nok', error };
    }
    return { status: 'ok' };
  }
}
export { allCredentials, handleCredentialsFetch, insertCredentials };
