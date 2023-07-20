<template>
  <q-layout view="lHh Lpr lFf">
    <TopNav />
    <Suspense>
      <q-page-container class="bg-secondary">
        <router-view />
      </q-page-container>
    </Suspense>
  </q-layout>
</template>

<script>
import TopNav from 'src/components/TopNav.vue';
import { defineComponent } from 'vue';
import { userSession, handleLogout } from '../vuetils/useAuth';

export default defineComponent({
  name: 'MainLayout',
  components: { TopNav },

  setup() {
    return { userSession, handleLogout };
  },
});
</script>
