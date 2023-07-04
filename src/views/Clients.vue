<script setup>
const extId = "lcicffoankopigbgnballbdhgifjpnaf";

function sendOpenNew() {
  console.log(chrome);
  chrome.runtime.sendMessage(extId, { action: "openNew" });
}
</script>

<template>
  <h1>Clients</h1>

  <div class="card">
    <p>clients here</p>
  </div>

  <div>
    <button
      @click="
        () => {
          sendOpenNew();
        }
      "
    >
      Login in as client
    </button>
  </div>
</template>

<style scoped></style>
