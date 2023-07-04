<script setup>
import HelloWorld from "./components/HelloWorld.vue";

const extId = "lcicffoankopigbgnballbdhgifjpnaf";

const checkExtension = (id, src, callback) => {
  let e = new Image();
  e.src = "chrome-extension://" + id + "/" + src;
  (e.onload = () => callback(1)), (e.onerror = () => callback(0));
};

// "src" must be included to "web_accessible_resources" in manifest.json
// checkExtension(extId, "img.png", (installed) => {
//   console.log({ installed });

//   // if (!installed) {
//   //   alert("Not installed :(");
//   // }
// });

function sendOpenNew() {
  chrome.runtime.sendMessage(extId, { action: "openNew" });
}
</script>

<template>
  <!-- <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="/vite.svg" class="logo" alt="Vite logo" />
    </a>
    <a href="https://vuejs.org/" target="_blank">
      <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
    </a>
    <button
      @click="
        () => {
          sendOpenNew();
        }
      "
    >
      Click me
    </button>
  </div> -->
  <div>
    <router-view></router-view>
  </div>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
