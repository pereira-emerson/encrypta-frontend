import { supabase } from '../lib/supabase';
import { ref } from 'vue';
import { insertCredentials } from './useCredentials';

const allCustomers = ref([]);
const activeCustomer = ref(null);

async function handleCustomerFetch({ customerId }) {
  try {
    const { data: credentials, error } = await supabase
      .from('customers')
      .select()
      .eq('id', customerId);

    if (error) {
      console.error('There was an error getting customer:', error);
      return null;
    }

    activeCustomer.value = credentials[0];
  } catch (error) {
    console.error('Error thrown:', error);
  }
}

async function handleCustomersFetch() {
  try {
    const { data: customers, error } = await supabase
      .from('customers')
      .select()
      .order('id', { ascending: false });

    if (error) {
      console.error('There was an error getting customers:', error);
      return null;
    }

    // Updates customers list
    allCustomers.value = customers;
  } catch (error) {
    console.error('Error thrown:', error);
  }
}

async function handleCustomersUpdate(
  customerId,
  newCustomer,
) {
  try {
    const { error } = await supabase
      .from('customers')
      .update(newCustomer)
      .eq('id', customerId);

    if (error) {
      console.error('There was an error updating customers:', error);
      return { success: false };
    }

    // Sucessful
    return { success: true };
  } catch (error) {
    console.error('Error thrown:', error);
    return { success: false };
  }
}

async function handleCustomerInsert(params) {
  const user = await supabase.auth.getUser();
  const { data: customers, error } = await supabase
    .from('customers')
    .insert([
      {
        user_id: user.data.user?.id,
        name: params.name,
        email: params.email,
        nif: params.nif,
        certificate_code: params.certificate_code,
        certificate_validity:params.certificate_validity,
        code: params.code,
        request:true,
      },
    ])
    .select();

  if (error) {
    console.error('There was an error getting customers:', error);
    return { status: 'nok', error: 'Não é possivel criar cliente' };
  }

  if (customers && params) {
    console.log('data', customers[0].id);
    const res = await insertCredentials(customers[0].id, params.integrations);
    if (res && res.error) {
      return {
        status: 'nok',
        error: 'Cliente criado. Não foi possivel associar plataforma e request',
      };
    }
  }

  return { status: 'ok', error: null };
}

async function handleCustomerPlatformInsert(customerId, integrations) {
  const { data: customers, error } = await supabase
    .from('customers')
    .update([
      {
        request:true,
      },
    ]).eq('id', customerId).select();
  
  if (error) {
    console.error('There was an error getting customers:', error);
    return { status: 'nok', error: 'Não foi possivel associar plataforma.' };
  }

  if (customers && integrations) {
    const res = await insertCredentials(customerId, integrations);
    if (res && res.error) {
      console.error(res.error);
      return {
        status: 'nok',
        error: 'Não foi possivel associar plataforma.',
      };
    }
  }

  return { status: 'ok', error: null };
}

async function handleCustomerDelete(
  customerId,
) {
  try {
    const { error } = await supabase
      .from('customers')
      .delete()
      .eq('id', customerId);

    if (error) {
      console.error('There was an error deleting customers:', error);
      return { success: false };
    }

    // Sucessful
    return { success: true };
  } catch (error) {
    console.error('Error thrown:', error);
    return { success: false };
  }
}

export {
  allCustomers,
  activeCustomer,
  handleCustomerFetch,
  handleCustomersFetch,
  handleCustomersUpdate,
  handleCustomerInsert,
  handleCustomerPlatformInsert,
  handleCustomerDelete,
};
