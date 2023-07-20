<template>
  <PageContainer>
    <q-page class="q-pa-md">
      <q-btn
        class="text-weight-bold text-h5 q-mb-lg"
        color="transparent"
        no-caps
        text-color="primary"
        flat
        to="/"
        padding="none"
      >
        <q-icon name="chevron_left" size="md" padding="none" />
        Customer management
      </q-btn>
      <q-card v-if="activeCustomer">
        <q-card-section>
          <div class="row">
            <div class="col">
              <div class="text-h5 q-mb-xs">{{ activeCustomer.name }}</div>
            </div>
            <div class="col text-right">
              <q-btn
                color="primary"
                label="Edit customer"
                no-caps
                class="text-weight-bold"
                @click="editDialogOpen = true"
              />
            </div>
          </div>
          <q-card-section>
            <q-tabs
              v-model="tab"
              no-caps
              class="text-primary"
              align="left"
            >
              <q-tab name="info" label="Customer information" />
              <q-tab name="credentials" label="Credentials" />
            </q-tabs>

            <q-separator />

            <q-tab-panels v-model="tab" animated>
              <q-tab-panel name="info">
                <div class="row">
                  <div class="col-8">
                    <div class="row" style="gap: 2rem 0">
                      <div class="col-3">
                        <div class="text-bold">Nome</div>
                        <div>{{ activeCustomer.name }}</div>
                      </div>
                      <div class="col-3">
                        <div class="text-bold">Email</div>
                        <div>{{ activeCustomer.email }}</div>
                      </div>
                      <div class="col-3">
                        <div class="text-bold">NIF</div>
                        <div>{{ activeCustomer.nif }}</div>
                      </div>
                      <div class="col-3">
                        <div class="text-bold">Código</div>
                        <div>{{ activeCustomer.code }}</div>
                      </div>
                      <div class="col-3">
                        <div class="text-bold">Código de certificado</div>
                        <div>{{ activeCustomer.certificate_code }}</div>
                      </div>
                      <div class="col-3">
                        <div class="text-bold">Código de validade</div>
                        <div>{{ activeCustomer.certificate_validity }}</div>
                      </div>
                      <div class="col-3">
                        <div class="text-bold">Status</div>
                        <div>{{ activeCustomer.status }}</div>
                      </div>
                    </div>
                  </div>
                  <div class="col-3">
                    <div class="text-subtitle1 q-mb-md text-weight-bold">Platforms shortcut</div>
                    <div class="row q-gutter-md">
                      <q-card
                        v-for="cred in activeCredentials"
                        :key="cred.id"
                        class="col"
                        style="height:100px;display: flex;flex-direction: column;justify-content: center;cursor: pointer;"
                        @click="(e) => {
                          e.preventDefault();
                          platformClickHandler({ credential: cred })
                        }"
                      >
                        <q-card-section class="flex justify-center">
                          <img
                            :src="cred.platform.picture"
                            style="max-width:100%;max-height: 50px;object-fit: contain;"
                          />
                        </q-card-section>
                      </q-card>
                      <p v-if="activeCredentials.length <= 0">Não existem plataformas ativas</p>
                    </div>
                  </div>
                </div>
              </q-tab-panel>

              <q-tab-panel name="credentials">
                <div class="row" style="gap: 20px">
                  <q-card v-for="cred in allCredentials" :key="cred.id" class="col-2">
                    <q-card-section class="flex justify-center" style="height: 100px;">
                      <div>
                        <img :src="cred.platform.picture" style="max-width:100%;max-height: 50px;object-fit: contain;" />
                        <p v-if="cred.status !== 'FILLED'" style="text-align: center;">{{ cred.status === 'PENDING' ?
                          "Pedido pendente" : cred.status }}</p>
                      </div>
                    </q-card-section>
                  </q-card>
                  <q-card v-if="inactiveCredentials.length>0" class="col-2" style="border:1px dashed">
                    <q-card-section style="display: flex; justify-content: center;">
                      <q-btn
                        flat
                        rounded
                        no-caps
                        @click="addPlatformModal = true"
                      >
                        <div>
                          <q-icon name="add" color="primary" />
                          <p>Add platform</p>
                        </div>
                      </q-btn>
                    </q-card-section>
                  </q-card>
                </div>
              </q-tab-panel>
            </q-tab-panels>
          </q-card-section>
        </q-card-section>
      </q-card>

      <q-dialog v-if="activeCustomer" v-model="editDialogOpen">
        <EditCustomerModal :customer="activeCustomer" @submit="handleSaveCustomerClick" />
      </q-dialog>
      <CustomerAddPlatformModal
        v-if="activeCustomer && activeCustomer.id"
        v-model="addPlatformModal"
        :handle-create-request="addPlatformRequest"
        :platforms="inactiveCredentials"
        :customer-id="activeCustomer.id"
        :result="result"
      />
    </q-page>
  </PageContainer>
</template>

<script>
import {
  activeCustomer,
  handleCustomerFetch,
  handleCustomersUpdate,
  handleCustomerPlatformInsert,
} from '@/vuetils/useCustomers';
import {
  allCredentials,
  handleCredentialsFetch,
} from '@/vuetils/useCredentials';
import { handlePlatformsFetch, allPlatforms } from '@/vuetils/usePlatforms';
import {
  userKeyPair,
  handleKeyPairFetch,
} from '@/vuetils/useKeyPair';
import {
  importRsaKey,
  decryptMessage,
  stringToArrayBuffer,
} from '@/utils/crypto';
import EditCustomerModal from '@/components/EditCustomerModal.vue';
import PageContainer from '@/components/PageContainer.vue';
import CustomerAddPlatformModal from '@/components/CustomerAddPlatformModal.vue';

export default {
  name: 'CustomerPage',
  components: {
    EditCustomerModal,
    PageContainer,
    CustomerAddPlatformModal,
  },
  data() {
    return {
      tab: 'info',
      editDialogOpen: false,
      activeCustomer,
      allCredentials,
      addPlatformModal:false,
      result: { request: false, success: false, title: '', message: '' },
      platforms:[],
      allPlatforms,
    };
  },
  computed: {
    activeCredentials() {
      return this.allCredentials.filter(cred => cred.status === 'FILLED');
    },
    inactiveCredentials(){
      const platformIds= this.allCredentials.map(cred=>cred.platform.id);

      return this.allPlatforms.filter(plat => {
        return !platformIds.includes(plat.id);
      });
    },
  },
  watch:{
    addPlatformModal(){
      this.result= { request: false, success: false, title: '', message: '' };
    },
  },
  mounted() {
    handleCustomerFetch({ customerId: this.$route.params.id });
    handleCredentialsFetch({ customerId: this.$route.params.id });
    handleKeyPairFetch();
    handlePlatformsFetch();
  },
  methods: {
    async handleSaveCustomerClick(customerId, newCustomer) {
      this.editDialogOpen = false;

      const { success } = await handleCustomersUpdate(customerId, newCustomer);

      if (success) {
        handleCustomerFetch({ customerId: this.$route.params.id });
      }
    },
    async getDecryptedMessage({ privateKeyAsRsa, message }) {
      const messageAsArrayBuffer = await stringToArrayBuffer({ string: message });

      const decryptedMessage = await decryptMessage({
        privateKey: privateKeyAsRsa,
        cipherMessage: messageAsArrayBuffer,
      });
      return decryptedMessage;
    },
    async platformClickHandler({ credential }) {
      const privateKeyAsRsa = await importRsaKey({
        pem: userKeyPair.value.encrypted_private_key,
        type: 'private',
      });

      const decryptedUsername = await this.getDecryptedMessage({
        privateKeyAsRsa,
        message: decodeURI(credential.username),
      });
      const decryptedPassword = await this.getDecryptedMessage({
        privateKeyAsRsa,
        message: decodeURI(credential.password),
      });

      chrome.runtime.sendMessage(
        process.env.VITE_CHROME_EXTENSION_ID,
        {
          action: 'openNew',
          url: credential.platform.url,
          username: decryptedUsername,
          password: decryptedPassword,
        },
        function (response) { console.log({ response }); },
      );
    },
    async addPlatformRequest(platformRequest){
      const { integrations } = platformRequest;
      const res = await handleCustomerPlatformInsert(this.activeCustomer.id, integrations);
      console.log('res', res);
      if (res && res.status === 'ok') {
        this.result = { request: true, success: true, title: 'Pedido de palaforma', message: 'O seu pedido foi submetido com sucesso.' };
      } else if (res && res.error) {
        this.result = { request: true, success: false, title: 'Pedido não efetuado!', message: res.error };
      }
      else {
        this.result = { request: true, success: false, title: 'Pedido não efetuado!', message: 'Não conseguiu efetuar pedido. Tente mais tarde' };
      }
      // this.getCustomers();
      handleCustomerFetch({ customerId: this.$route.params.id });
      handleCredentialsFetch({ customerId: this.$route.params.id });
      handlePlatformsFetch();
    },
  },
};
</script>
