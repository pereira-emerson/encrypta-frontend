<template>
  <q-table
    :rows="customers"
    :columns="columns"
    row-key="id"
    :rows-per-page-options="[10, 20]"
    @row-click="onRowClick"
  >
    <template #body-cell-delete="props">
      <q-td :props="props">
        <q-btn
          icon="delete"
          dense
          flat
          @click.stop="deleteCustomer(props)"
        />
      </q-td>
    </template>
  </q-table>
</template>

<script>
// const status={
//   FILLED:'Preenchido',
//   REQUEST:'Request',
//   PENDING:'Pendente',
// };
const columns = [
  {
    name: 'name',
    required: true,
    label: 'Customer',
    field: 'name',
    align: 'left',
    sortable: true,
  },
  {
    name: 'nif',
    required: true,
    label: 'NIF',
    field: 'nif',
    align: 'left',
    sortable: true,
  },
  {
    name: 'email',
    align: 'center',
    label: 'Email',
    field: 'email',
    sortable: true,
  },
  {
    name: 'code',
    required: true,
    label: 'Código',
    field: 'code',
    align: 'center',
    sortable: true,
  },
  {
    name: 'certificate_code',
    align: 'center',
    label: 'Código da certidão permanente',
    field: 'certificate_code',
    sortable: true,
  },
  {
    name: 'certificate_validity',
    align: 'center',
    label: 'Validade Certidão',
    field: 'certificate_validity',
    sortable: true,
  },
  // {
  //   name: 'status',
  //   label: 'Status',
  //   align: 'center',
  //   field: (row) => row.status ? status[row.status]:'',
  //   sortable: true,
  // },
  {
    name: 'delete',
    label: '',
    align: 'center',
    field: 'id',
    sortable: false,
  },
];

export default {
  props: {
    customers: {
      type: Array,
      required: true,
    },
    deleteCostumer:{
      type: Function,
      required:true,
    },
  },
  data() {
    return {
      allCustomers: [1, 2],
      columns,
    };
  },
  methods: {
    onRowClick(row, data) {
      this.$router.push(`/customer/${data.id}`);
    },
    deleteCustomer({ row }){
      this.deleteCostumer(row);
    },
  },
};
</script>

<style>
thead tr:first-child th {
  font-weight: 700;
}
</style>
