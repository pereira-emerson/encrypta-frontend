<template>
  <div class="row fullscreen bg-accent text-white text-center">
    <div class="col-12 col-md-6 full-height">
      <div
        class="login-container column items-center full-height justify-center"
      >
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

              <!-- Reset password -->
              <div v-if="activeView === 'passwordRecover'">
                <div class="text-bold text-left">Email</div>
                <q-input v-model="email" outlined class="q-mb-md" />

                <q-btn
                  class="q-my-md full-width"
                  color="primary"
                  unelevated
                  label="Send recover email"
                  no-caps
                  style="border-radius: 12px"
                  @click="handlePasswordReset({ email })"
                />

                <a
                  href="#"
                  class="text-bold"
                  style="text-decoration: none"
                  @click="activeView = 'login'"
                >
                  Cancel
                </a>
              </div>

              <!-- Sign up -->
              <div v-if="activeView === 'signUp'">
                <div class="text-bold text-left">Name</div>
                <q-input v-model="name" outlined class="q-mb-md" />

                <div class="text-bold text-left">Email</div>
                <q-input v-model="email" outlined class="q-mb-md" />

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
                  label="Sign up"
                  no-caps
                  style="border-radius: 12px"
                  @click="handleSignupClick()"
                />

                <a
                  href="#"
                  class="text-bold"
                  style="text-decoration: none"
                  @click="activeView = 'login'"
                >
                  Login
                </a>
              </div>

              <!-- Login -->
              <div v-if="activeView === 'login'">
                <div class="text-bold text-left">Email</div>
                <q-input v-model="email" outlined class="q-mb-md" />

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
                  label="Login"
                  no-caps
                  style="border-radius: 12px"
                  @click="handleLoginClick"
                />

                <a
                  href="#"
                  class="text-bold"
                  style="text-decoration: none"
                  @click="activeView = 'signUp'"
                >
                  Sign up
                </a>

                <div class="forgot-password">
                  <a
                    href="#"
                    class="text-bold"
                    style="text-decoration: none"
                    @click="activeView = 'passwordRecover'"
                  >
                    Forgot your password?
                  </a>
                  <div>Don't worry, we're here to help!</div>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>

        <div class="row">
          <div class="q-mt-md text-caption">
            <div>© {{ new Date().getFullYear() }} technologies</div>
            <div>All rights reserved</div>
          </div>
        </div>
      </div>
    </div>

    <div class="col-6 background-illustration"></div>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue';
import {
  userSession,
  handleSignup,
  handleLogin,
  handlePasswordReset,
} from '@/vuetils/useAuth';
import {
  handleKeyPairFetch,
  handleKeyPairInsert,
} from '@/vuetils/useKeyPair';
import { generateKeyPair, exportCryptoKey } from '@/utils/crypto';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'LoginPage',

  setup() {
    const name = ref('');
    const email = ref('');
    const password = ref('');
    const activeView = ref('login');
    const router = useRouter();

    function handleSignupClick() {
      handleSignup(
        {
          email: email.value,
          password: password.value,
        },
        { name: name.value },
      );
    }

    async function handleLoginClick() {
      const { success } = await handleLogin({
        email: email.value,
        password: password.value,
      });

      if (success && userSession?.value) {
        router.push({ path: '/' });
        createUserKeyPair();
      };
    }

    async function createUserKeyPair() {
      const userExistingKeyPairs = await handleKeyPairFetch();
      if (userExistingKeyPairs?.length) {
        return;
      }

      const keyPair = await generateKeyPair();
      const pemPublicKey = await exportCryptoKey({
        key: keyPair.publicKey,
        type: 'public',
      });
      const pemPrivateKey = await exportCryptoKey({
        key: keyPair.privateKey,
        type: 'private',
      });

      const { success: keyPairSuccess } = await handleKeyPairInsert({
        public: pemPublicKey,
        // TODO: Encrypt private key with user password
        private: pemPrivateKey,
      });

      console.log({ keyPairSuccess });
    }

    return {
      name,
      email,
      password,
      activeView,
      handleLoginClick,
      handleSignupClick,
      handlePasswordReset,
    };
  },
});
</script>

<style lang="scss">
@media only screen and (min-width: 1024px) {
  .login-container {
    float: right;
  }
}

.forgot-password {
  margin-top: 6rem;
}

.background-illustration {
  background-image: url('assets/login-illustration.svg');
  background-repeat: no-repeat;
  background-size: cover;
  background-position: 70px 0;
}
</style>
