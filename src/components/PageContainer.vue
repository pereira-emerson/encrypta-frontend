<template>
  <div class="page-container">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'PageContainer',
};
</script>

<style scoped>
.page-container {
  max-width: 1280px;
  margin: 0 auto;
}
</style>
