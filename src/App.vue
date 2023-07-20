<template>
  <router-view />
</template>

<script>
import { defineComponent } from 'vue';
import { useRouter } from 'vue-router';
import { supabase } from '@/lib/supabase';
import { userSession } from '@/vuetils/useAuth';

export default defineComponent({
  name: 'App',

  setup() {
    const router = useRouter();

    supabase.auth.onAuthStateChange((event, session) => {
      // Update user session
      userSession.value = session;

      // Redirect to login page at sign out
      if (event === 'SIGNED_OUT') {
        router.push({ path: '/login' });
      }
    });
  },
});
</script>
