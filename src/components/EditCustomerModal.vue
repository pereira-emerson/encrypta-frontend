<template>
  <q-card>
    <q-form @submit="onSubmit">
      <q-card-section>
        <div class="text-h6 text-weight-bold q-mb-md">
          Customer Details</div>
        <div>
          <div class="row q-gutter-md">
            <div class="col">
              <q-input
                v-model="name"
                outlined
                label="Name *"
                lazy-rules
                :rules="[
                  (val) => (val && val.length > 0) || 'Please type name',
                ]"
              />
            </div>
            <div class="col">
              <q-input
                v-model="email"
                outlined
                label="Email *"
                lazy-rules
                :rules="[
                  (val) => (val && val.length > 0) || 'Please type email',
                ]"
              />
            </div>
          </div>

          <div class="row q-gutter-md">
            <div class="col">
              <q-input
                v-model="nif"
                outlined
                label="NIF *"
                lazy-rules
                :rules="[
                  (val) => (val && val.length > 0) || 'Please type name',
                ]"
              />
            </div>
            <div class="col">
              <q-input
                v-model="code"
                outlined
                label="Código *"
                lazy-rules
                :rules="[
                  (val) => (val && val.length > 0) || 'Please type name',
                ]"
              />
            </div>
          </div>

          <div class="row q-gutter-md">
            <div class="col">
              <q-input
                v-model="certificateCode"
                outlined
                label="Código certificado"
                lazy-rules
                :rules="[
                  (val) => (val && val.length > 0) || 'Please type name',
                ]"
              />
            </div>
            <div class="col">
              <q-input
                v-model="certificateValidity"
                outlined
                label="Validade certificado *"
                lazy-rules
                :rules="[
                  (val) => (val && val.length > 0) || 'Please type name',
                ]"
              />
            </div>
          </div>
        </div>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn
          v-close-popup
          flat
          label="Cancel"
          color="primary"
        />
        <q-btn label="Save" color="primary" type="submit" />
      </q-card-actions>
    </q-form>
  </q-card>
</template>

<script>
import { defineComponent, ref } from 'vue';

export default defineComponent({
  props: {
    customer: {
      type: Object,
      required: true,
    },
  },
  emits: ['submit'],
  setup(props, ctx) {
    const name = ref(props.customer.name);
    const email = ref(props.customer.email);
    const nif = ref(props.customer.nif);
    const code = ref(props.customer.code);
    const certificateCode = ref(props.customer.certificate_code);
    const certificateValidity = ref(props.customer.certificate_validity);

    function onSubmit() {
      ctx.emit('submit', props.customer.id, {
        name: name.value,
        email: email.value,
        nif: nif.value,
        code: code.value,
        certificate_code: certificateCode.value,
        certificate_validity: certificateValidity.value,
      });
    }

    return {
      name,
      email,
      nif,
      code,
      certificateCode,
      certificateValidity,

      onSubmit,
    };
  },
});
</script>
