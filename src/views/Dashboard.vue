<script setup>
import { useUserStore } from "../stores/user";
const store = useUserStore();
</script>

<template>
  <h1>Dashboard</h1>

  <div class="card">
    <p>Welcome {{ store.name }} {{ store.lastName }}.</p>
  </div>
</template>

<style scoped></style>
