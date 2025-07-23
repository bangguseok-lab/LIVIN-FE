<script setup>
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import Buttons from '@/components/common/buttons/Buttons.vue';

const route = useRoute()

defineProps({
  title: String,
  subTitle: String,
  placeholder: String,
  page: Number
})

const showInput = computed(() => {
  return route.path.endsWith('/name') || route.path.endsWith('/nickname') || route.path.endsWith('/phone-number') || route.path.endsWith('/birth')
})


const showBtn = computed(() => {
  return route.path.endsWith('/role')
})

const tanantBtn = ref(false)
const landlordBtn = ref(false)

const onTanantClick = () => {
  tanantBtn.value = true
  landlordBtn.value = false
}

const onLandlordClick = () => {
  tanantBtn.value = false
  landlordBtn.value = true
}
</script>

<template>
  <div class="SignupLayout">
    <div class="signup-page-number">{{ page }}<span class="total-page"> / 6</span></div>
    <div class="signup-title-wrapper">
      <p class="signup-title-text">{{ title }}</p>
      <p class="signup-sub-title-text">{{ subTitle }}</p>
      <input v-if="showInput" type="text" :placeholder="placeholder" name="input">
      <div v-if="showBtn" class="btn-role-box">
        <Buttons v-model:is-active="tanantBtn" type="role" class="tanantBtn" @click="onTanantClick">
          <div class="role-text">임차인</div>
          <div class="role-description-text">집을 구해요</div>
        </Buttons>
        <Buttons v-model:is-active="landlordBtn" type="role" @click="onLandlordClick">
          <div class="role-text">임대인</div>
          <div class="role-description-text">집을 빌려줘요</div>
        </Buttons>

      </div>

    </div>
  </div>
</template>

<style scoped lang="scss">
.SignupLayout {
  width: 100%;
  height: 80%;
}

.signup-page-number {
  font-size: rem(13px);
  font-weight: var(--font-weight-semibold);
  color: var(--title-text);
}

.total-page {
  font-weight: var(--font-weight-semibold);
  color: var(--sub-title-text);
}

.signup-title-wrapper {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-top: rem(21px);
}

.signup-title-text {
  font-size: var(--title-size);
  font-weight: var(--font-weight-semibold);
  color: var(--title-text);
  margin-bottom: 0;
}

.signup-sub-title-text {
  font-size: var(--sub-title-size);
  font-weight: var(--font-weight-regular);
  color: var(--sub-title-text);
  margin-bottom: rem(34px);
}

.btn-role-box {
  display: flex;
  width: 100%;
}

.tanantBtn {
  margin-right: rem(42px);
}
</style>
