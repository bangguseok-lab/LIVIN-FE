<template>
  <button class="edit-btn" @click="$emit('click')">
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 20H21"
        stroke="#888"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M16.5 3.5C16.8979 3.10217 17.4371 2.87865 18 2.87865C18.5629 2.87865 19.1021 3.10218 19.5 3.5C19.8978 3.89782 20.1213 4.43708 20.1213 5C20.1213 5.56292 19.8978 6.10218 19.5 6.5L9 17L3 18L4 12L14.5 3.5Z"
        stroke="#888"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  </button>
</template>

<script setup>
defineEmits(['click'])
</script>

<style scoped>
.edit-btn {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
}
</style>
