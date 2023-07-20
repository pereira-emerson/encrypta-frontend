<template>
  <div>
    <q-dialog v-model="openModal">
      <q-card  v-if="!result.request">
        <q-form ref="anyName" @submit="onSubmit">
          <q-card-section>
            <div class="text-h5 q-mb-md text-weight-bold">Add platform</div>
            <div class="text-body2">Select the platforms that the customer should fill the information.</div>
          </q-card-section>
          <q-card-section>
            <div class="text-h6 text-weight-bold q-mb-md">Available platforms</div>
            <div class="row items-start q-gutter-md">
              <q-btn
                v-for="platform in platforms"
                :key="platform.id"
                no-caps
                outline
                class="text-weight-bolder"
                style="border-radius: 12px;"
                :text-color="selectedPlatforms.findIndex(item => platform.id === item) > -1 ? 'primary' : 'grey'"
                :label="platform.name"
                @click="() => selectPlatform(platform)"
              />
            </div>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn
              v-close-popup
              flat
              label="Cancel"
              color="primary"
              no-caps
              class="text-weight-bold"
              style="border-radius: 12px;"
            />
            <q-btn
              label="Submit Request"
              color="primary"
              type="submit"
              class="text-weight-bold"
              no-caps
              style="border-radius: 12px;"
            />
          </q-card-actions>
        </q-form>
      </q-card>
      <q-card v-else>
        <q-card-section>
          <div style="padding: 100px 50px;display: flex;flex-direction: column;align-items: center;" >
            <q-icon
              v-if="result.success"
              name="check_circle_outline"
              size="100px"
              color="accent"
            />
            <q-icon
              v-if="!result.success"
              name="error_outline"
              size="100px"
              color="red"
            />
            <div class="text-h5 q-mb-md q-mt-md text-weight-bold">{{ result.title }}</div>
            <div class="text-body2 text-center" style="white-space: pre-line">{{ result.message }}
            </div>
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            v-close-popup
            label="Confirm"
            color="primary"
            no-caps
            class="text-weight-bold"
            style="border-radius: 12px;"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
export default {
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
    platforms: { type: Array, required: true },
    handleCreateRequest: { type: Function, required: true },
    requestDone:{ type:Boolean, default:false },
    result:{ type:Object, default:null },
    customerId:{ type:Number, required :true },
  },
  emits: ['update:modelValue'],
  data() {
    return {
      openModal: this.modelValue,
      selectedPlatforms: [],
    };
  },
  watch: {
    modelValue(val) {
      this.openModal = val;
    },
    openModal(val) {
      this.$emit('update:modelValue', val);
      this.resetForm();
    },
  },
  methods: {
    resetForm() {
      this.selectedPlatforms = [];
    },
    onSubmit() {
      if (this.selectedPlatforms.length === 0) {
        this.$q.notify({
          color: 'red-5',
          textColor: 'white',
          icon: 'warning',
          message: 'Selecione pelo menos uma plataforma.',
        });
        return;
      }
      const customerRequest = {
        integrations: this.selectedPlatforms,
      };
      this.handleCreateRequest(customerRequest);
    },
    selectPlatform(platform) {
      const index = this.selectedPlatforms.findIndex(item => platform.id === item);

      if (index === -1) {
        this.selectedPlatforms.push(platform.id);
      } else {
        this.selectedPlatforms.splice(index, 1);
      }
    },
  },
};
</script>
