<template>
  <div>
    <q-dialog v-model="openModal">
      <q-card  v-if="!result.request">
        <q-card-section>
          <div class="text-h5 q-mb-md text-weight-bold">Apagar</div>
          <div class="text-body2">Deseja apagar cliente '{{customer.name}}'?</div>
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
            label="Confirmar"
            color="primary"
            type="submit"
            class="text-weight-bold"
            no-caps
            style="border-radius: 12px;"
            @click="confirmDelete(customer)"
          />
        </q-card-actions>
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
    result:{ type:Object, default:null },
    confirmDelete:{ type:Function, required:true },
    customer:{ type:Object, required:true },
  },
  emits: ['update:modelValue'],
  data() {
    return {
      openModal: this.modelValue,
    };
  },
  watch: {
    modelValue(val) {
      this.openModal = val;
    },
    openModal(val) {
      this.$emit('update:modelValue', val);
    },
  },
};
</script>
