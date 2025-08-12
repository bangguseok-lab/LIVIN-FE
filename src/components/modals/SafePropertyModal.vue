<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  propertyInfo: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['update:modelValue'])

const closeModal = () => {
  emit('update:modelValue', false)
}
</script>

<template>
  <div v-if="props.modelValue" class="SafePropertyModal">
    <div class="modal-overlay" @click="closeModal"></div>
    <div class="modal-content">
      <h2>안심 매물 정보</h2>
      <ul class="info-list">
        <li>근저당권: {{ propertyInfo.mortgage ? '있음' : '없음' }}</li>
        <li>임대인 = 소유자 일치: {{ propertyInfo.ownerMatch ? 'O' : 'X' }}</li>
        <li>불법건축물 여부: {{ propertyInfo.illegalBuilding ? 'O' : 'X' }}</li>
        <li>전세가율: {{ propertyInfo.jeonseRate }}%</li>
      </ul>
      <div class="modal-actions">
        <button @click="closeModal">확인</button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.SafePropertyModal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.modal-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
}

.modal-content {
  position: relative;
  background: #fff;
  border-radius: 20px;
  padding: 24px;
  width: 400px;
  z-index: 1000;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25);
}

h2 {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 16px;
}

.info-list {
  list-style: none;
  padding: 0;
  margin-bottom: 24px;

  li {
    font-size: 14px;
    padding: 8px 0;
    border-bottom: 1px solid #eee;
  }
}

.modal-actions {
  text-align: center;

  button {
    padding: 10px 40px;
    background-color: var(--primary-color, #007bff);
    color: white;
    border: none;
    border-radius: 12px;
    cursor: pointer;
  }
}
</style>
