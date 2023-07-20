<template>
  <div class="fullscreen bg-accent text-white text-center row">
    <div class="full-height col-6">
      <div class="column items-center full-height float-right justify-center">
        <div class="row">
          <!-- <img src="../assets/logo-name.svg" /> -->
          <div class="text-h4 q-mb-md">Encrypta</div>
        </div>

        <div class="row">
          <q-card class="text-black q-px-xl q-py-lg">
            <q-card-section>
              <div class="text-h4 q-mb-md">
                Welcome to&nbsp;<span class="text-weight-bold">encrypta!</span>
              </div>

              <div class="text-bold text-left">Password</div>
              <q-input
                v-model="password"
                type="password"
                outlined
                class="q-mb-md"
              />

              <q-btn
                class="q-my-md full-width"
                color="primary"
                unelevated
                label="Reset password"
                no-caps
                style="border-radius: 12px"
                @click="handleUpdateUser({ email, password })"
              />
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>

    <!-- <div class="col"></div> -->
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue';
import { handleUpdateUser } from '../vuetils/useAuth';

export default defineComponent({
  name: 'ResetPassword',

  setup() {
    const password = ref('');

    return {
      password,
      handleUpdateUser,
    };
  },
});
</script>
