<template>
  <q-layout>
    <Suspense>
      <q-page-container class="bg-secondary">
        <q-header elevated class="bg-primary">
          <PageContainer>
            <q-toolbar class="q-py-md">
              <div class="row full-width items-center justify-between">
                <div class="row items-center q-gutter-lg">
                  <img height="40" src="../assets/encrypta-symbol.svg" />
                </div>
              </div>
            </q-toolbar>
          </PageContainer>
        </q-header>
        <PageContainer>
          <q-page class="q-pa-md">
            <div
              v-if="loading"
              style="display: flex;flex-direction: column; justify-content: center; align-items: center; position: absolute;top:0;bottom:0;left:0;right:0;"
            >
              <div class="lds-ellipsis">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
              </div>
            </div>
            <div v-else>
              <div v-if="!tokenValid">
                <h6>This page is no longer valid!</h6>
              </div>
              <div v-else>
                <q-form v-if="!request" autocomplete="off" @submit="onSubmit">
                  <q-card>
                    <q-card-section>
                      <div class="text-h4 q-mt-sm q-mb-xs text-weight-bold">Request Platforms</div>
                      <q-separator />
                    </q-card-section>
                    <q-card-section>
                      <q-card v-for="platform in platforms" :key="platform.id" class="q-mb-md">
                        <q-card-section>
                          <img
                            :src="platform.picture"
                            :alt="platform.name"
                            :title="platform.name"
                            style="max-height: 50px;"
                          />
                          <q-separator />
                          <p class="text-body1 q-mt-md">Por favor, preencha as suas credenciais</p>
                          <div class="text-bold text-left">Username</div>
                          <q-input
                            v-model="platform.username"
                            type="text"
                            outlined
                            class="q-mb-md"
                            :autocomplete="`new-username_${requestToken}`"
                            lazy-rules
                            label="Username *"
                            :rules="[val => val && val.length > 0 || 'Preencha o username']"
                          />

                          <div class="text-bold text-left">Password</div>
                          <q-input
                            v-model="platform.password"
                            class="form-input"
                            :type="platform.fieldType"
                            outlined
                            :autocomplete="`new-password_${requestToken}`"
                            lazy-rules
                            label="Password *"
                            :rules="[val => val && val.length > 0 || 'Preencha a password']"
                            @focus="e => handleType(e, platform)"
                            @blur="e => handleType(e, platform)"
                          />
                        </q-card-section>
                      </q-card>
                    </q-card-section>
                    <q-card-actions align="right">
                      <q-btn
                        type="submit"
                        color="primary"
                        style="border-radius: 12px;"
                        no-caps
                        class="text-weight-bold"
                      >Submeter</q-btn>
                    </q-card-actions>
                  </q-card>
                </q-form>
                <q-card v-else>
                  <q-card-section>
                    <div style="padding: 100px 50px;display: flex;flex-direction: column;align-items: center;" >
                      <q-icon
                        v-if="success"
                        name="check_circle_outline"
                        size="100px"
                        color="accent"
                      />
                      <q-icon
                        v-if="!success"
                        name="error_outline"
                        size="100px"
                        color="red"
                      />
                      <p class="text-h5 text-center">
                        <span v-if="success">Credenciais registadas com sucesso.<br/>Esta página pode ser fechada.<br/>Obrigado.</span>
                        <span v-else>As crendencias não foram registadas.<br/> Por favor tente mais tarde.</span>
                      </p>
                    </div>
                  </q-card-section>
                </q-card>
              </div>
            </div>
          </q-page>

        </PageContainer>

      </q-page-container>
    </Suspense>
  </q-layout>
</template>

<script>
import { defineComponent } from 'vue';
import { createClient } from '@supabase/supabase-js';
import {
  importRsaKey,
  encryptMessage,
  arrayBufferToString,
} from '@/utils/crypto';
import PageContainer from 'src/components/PageContainer.vue';

export default defineComponent({
  name: 'CustomerRequest',
  components: { PageContainer },
  data() {
    return {
      supabaseClientAnon: null,
      requestToken: '',
      platforms: [],
      credentials: null,
      request: false,
      success: false,
      tokenValid: false,
      loading: true,
      publicKey:'',
    };
  },
  async created() {
    if (!this.$route.query.token) {
      this.loading = false;
      return;
    }

    this.tokenValid = true;
    this.requestToken = this.$route.query.token;

    await this.createClient();
    if (this.supabaseClientAnon)
      this.handleCredentialsFetch();
  },
  methods: {
    async createClient() {
      this.supabaseClientAnon = createClient(
        process.env.VITE_SUPABASE_URL,
        process.env.VITE_SUPABASE_KEY,
        {
          auth: {
            persistSession: false,
          },
          global: { headers: { 'request-token': this.requestToken } },
        });
    },
    async handleCredentialsFetch() {

      const { data: credentials } = await this.supabaseClientAnon.from('requested_credentials').select('*');

      if (credentials.length <= 0) {
        this.loading = false;
        this.tokenValid = false;
        return;
      }

      this.credentials = credentials;
      this.publicKey=this.credentials.at(-1).public_key;
      this.platforms = credentials.map((cred) => ({ credential_id: cred.credential_id, id:cred.integration_id, name:cred.integration_name, picture:cred.picture, password: '', email: '', fieldType: 'text' }));
      this.loading = false;
    },
    handleType(event, plat) {
      //avoid chrome anoying autocomplete
      const { srcElement, type } = event;
      const { value } = srcElement;

      if (type === 'blur' && !value) {
        plat.fieldType = 'text';
      } else {
        plat.fieldType = 'password';
      }
    },
    async onSubmit() {

      const publicKeyAsRsa = await importRsaKey({
        pem: this.publicKey,
        type: 'public',
      });

      const promises = [];
      for(const cred of this.credentials){
        const targetPlatform = this.platforms.find((p) => p.credential_id === cred.credential_id);

        const encryptedPasswordAsStringEncoded =await this.getEncryptedMessage(publicKeyAsRsa, targetPlatform.password );
        const encryptedUsernameAsStringEncoded =await this.getEncryptedMessage(publicKeyAsRsa, targetPlatform.username );

        promises.push(
          this.supabaseClientAnon.rpc('update_credential', {
            credential_id: cred.credential_id,
            credential_username: encryptedUsernameAsStringEncoded,
            credential_password: encryptedPasswordAsStringEncoded,
          }),
        );
      }

      Promise.all(promises).then(val => {
        const hasError = val.findIndex(prom => prom.error);

        if (hasError > -1) {
          this.success = false;
          this.request = true;
          console.error(val[hasError]);
          return;
        }

        this.success = true;
        this.request = true;
      }).catch(error => {
        console.error({ error });
      });
    },
    async getEncryptedMessage(publicKeyAsRsa, message) {
      const encryptedMessageAsArrayBuffer = await encryptMessage({
        publicKey: publicKeyAsRsa,
        plainMessage: message,
      });
      const encryptedMessageAsString = arrayBufferToString({
        arrayBuffer: encryptedMessageAsArrayBuffer,
      });

      return encodeURI(encryptedMessageAsString);
    },
  },
});
</script>

<style scoped>
.lds-ellipsis {
  display: inline-block;
  position: relative;
  width: 80px;
  height: 80px;
}

.lds-ellipsis div {
  position: absolute;
  top: 33px;
  width: 13px;
  height: 13px;
  border-radius: 50%;
  background: #023047;
  animation-timing-function: cubic-bezier(0, 1, 1, 0);
}

.lds-ellipsis div:nth-child(1) {
  left: 8px;
  animation: lds-ellipsis1 0.6s infinite;
}

.lds-ellipsis div:nth-child(2) {
  left: 8px;
  animation: lds-ellipsis2 0.6s infinite;
}

.lds-ellipsis div:nth-child(3) {
  left: 32px;
  animation: lds-ellipsis2 0.6s infinite;
}

.lds-ellipsis div:nth-child(4) {
  left: 56px;
  animation: lds-ellipsis3 0.6s infinite;
}

@keyframes lds-ellipsis1 {
  0% {
    transform: scale(0);
  }

  100% {
    transform: scale(1);
  }
}

@keyframes lds-ellipsis3 {
  0% {
    transform: scale(1);
  }

  100% {
    transform: scale(0);
  }
}

@keyframes lds-ellipsis2 {
  0% {
    transform: translate(0, 0);
  }

  100% {
    transform: translate(24px, 0);
  }
}
</style>
