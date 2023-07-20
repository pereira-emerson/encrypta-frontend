<template>
  <q-header elevated class="bg-primary">
    <PageContainer>
      <q-toolbar class="q-py-md">
        <div class="row full-width items-center justify-between">
          <div class="row items-center q-gutter-lg">
            <q-btn
              to="/"
              padding="0"
              flat
              unelevated
            >

              <img height="40" src="../assets/encrypta-symbol.svg" />
            </q-btn>
          
            <q-input
              standout="bg-teal text-white"
              label="Search"
              color="white"
              dark
            />
          </div>
          <div class="row text-right items-center q-gutter-xl">
            <q-btn
              flat
              no-caps
              label="Customer management"
              to="/"
              :class="{ active: ($route.name === 'index' || $route.name==='customer')  }"
              class="text-weight-bold"
              style="padding: 0"
            />
            <q-btn
              no-caps
              flat
              label="Settings"
              to="/settings"
              :class="{ active: $route.name === 'settings' }"
              class="text-weight-bold"
              style="padding: 0"
            />
            <q-btn-dropdown padding="0" round>
              <template #label>
                <img src="../assets/avatar/avatar1.png" style="height: 40px; width: 40px; border-radius: 12px;">
              </template>
              <q-list>
                <q-item v-close-popup clickable @click="handleLogout">
                  <q-item-section>
                    <q-item-label>Log Out</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-btn-dropdown>
          </div>
        </div>
      </q-toolbar>
    </PageContainer>
  </q-header>
</template>

<script>
import { userSession, handleLogout } from '../vuetils/useAuth';
import PageContainer from './PageContainer.vue';

export default {
  components:{
    PageContainer,
  },
  setup() {
    return {
      userSession,
      handleLogout,
    };
  },
};
</script>
<style lang="sass">
.q-btn.active
  border-bottom:2px solid #fff
  border-radius:0
</style>

