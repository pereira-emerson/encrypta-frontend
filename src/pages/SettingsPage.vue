<template>
  <PageContainer>
    <q-page class="q-pa-md">
      <div class="row items-start justify-between">
        <div class="text-h5 text-weight-bold q-mb-lg">Settings</div>
      </div>
      <q-card>
        <q-card-section>
          <p class="text-h5 q-mt-sm q-mb-xs">Dados Pessoais</p>            
          <q-separator/>
          <div class="row q-mt-md" style="gap: 2rem 0">
            <div class="col-3">
              <div class="text-bold">Nome</div>
              <div>José Manuel Alves</div>
            </div>
            <div class="col-3">
              <div class="text-bold">Email</div>
              <div>josemalves@mail.com</div>
            </div>
          </div>
        </q-card-section>
        <q-card-section>
          <p class="text-h5 q-mt-sm q-mb-xs">Extensão Chrome</p>            
          <q-separator/>
          <q-btn
            v-close-popup
            label="Download"
            color="primary q-mt-md"
            no-caps
            class="text-weight-bold"
            style="border-radius: 12px;"
          />
        </q-card-section>
      </q-card>
    </q-page>
  </PageContainer>
</template>

<script>
import { defineComponent } from 'vue';
import PageContainer from 'src/components/PageContainer.vue';
export default defineComponent({
  name: 'SettingsPage',
  components: { PageContainer },
});
</script>
