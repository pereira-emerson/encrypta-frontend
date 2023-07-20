<template>
  <PageContainer>
    <q-page class="q-pa-md">
      <div class="row items-start justify-between">
        <div class="text-h5 text-weight-bold q-mb-lg">Customer management</div>
        <q-btn-dropdown
          style="border-radius: 12px"
          color="primary"
          label="Add new customer"
          no-caps
          unelevated
        >
          <q-list>
            <q-item v-close-popup clickable>
              <q-item-section>
                <q-item-label>Import customer</q-item-label>
              </q-item-section>
            </q-item>
            <q-item v-close-popup clickable @click="alert = true">
              <q-item-section>
                <q-item-label>Request customer</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </div>
      <CustomersTable :customers="allCustomers" :delete-costumer="setDeleteCustomer"/>
      <CustomerRequestModal
        v-model="alert"
        :handle-create-request="createCustomerRequest"
        :platforms="allPlatforms"
        :result="result"
      />
      <CustomerDeleteModal
        v-model="deleteModal"
        :result="resultDelete"
        :confirm-delete="deleteCustomer"
        :customer="deleteCustomerObj"
      ></CustomerDeleteModal>
    </q-page>
  </PageContainer>
</template>

<script>
import CustomersTable from '@/components/CustomersTable.vue';
import CustomerDeleteModal from '@/components/CustomerDeleteModal.vue';
import CustomerRequestModal from '@/components/CustomerRequestModal.vue';
import {
  handleCustomersFetch, handleCustomerInsert, allCustomers, handleCustomerDelete,
} from '@/vuetils/useCustomers';
import { handlePlatformsFetch, allPlatforms } from '@/vuetils/usePlatforms';
import { handleKeyPairFetch } from '@/vuetils/useKeyPair';
import PageContainer from 'src/components/PageContainer.vue';

export default {
  name: 'IndexPage',
  components: {
    CustomersTable, CustomerRequestModal, PageContainer, CustomerDeleteModal,
  },
  data() {
    return {
      alert: false,
      deleteModal:false,
      allCustomers,
      allPlatforms,
      result: { request: false, success: false, title: '', message: '' },
      resultDelete: { request: false, success: false, title: '', message: '' },
      deleteCustomerObj:{},
    };
  },
  watch:{
    alert(){
      this.result= { request: false, success: false, title: '', message: '' };
    },
    deleteModal(){
      this.resultDelete= { request: false, success: false, title: '', message: '' };
    },
  },
  async created() {
    handleCustomersFetch();
    handlePlatformsFetch();
    handleKeyPairFetch();
  },
  methods: {
    async createCustomerRequest(data) {
      const res = await handleCustomerInsert(data);
      if (res && res.status === 'ok') {
        this.result = { request: true, success: true, title: 'Request submited!', message: 'Your request has been submited successfully!\nThe customer data will be displayed on Customer management.' };
      } else if (res && res.error) {
        this.result = { request: true, success: false, title: 'Request not submited!', message: res.error };
      }
      else {
        this.result = { request: true, success: false, title: 'Request not submited!', message: 'Não conseguiu efetuar request. Tente mais tarde' };
      }
      handleCustomersFetch();
    },
    setDeleteCustomer(customer){
      this.deleteModal=true;
      this.deleteCustomerObj=customer;  
    },
    async deleteCustomer(customer){
      const res = await handleCustomerDelete(customer.id);
      if(!res.success){
        this.resultDelete = { request: true, success: false, title: 'Request not submited!', message: 'Não conseguiu efetuar request. Tente mais tarde' };
        return;
      }
      this.resultDelete = { request: true, success: true, title: 'Cliente apagado!', message: 'O cliente foi apagado com sucesso.' };
      handleCustomersFetch();
    },
  },
};
</script>
