<script setup>
import { useRoute, useRouter } from 'vue-router'
import { computed } from 'vue'
import Buttons from '@/components/common/buttons/Buttons.vue'

const route = useRoute()
const router = useRouter()

const currentPage = computed(() => route.meta.page || '')
const totalPage = computed(() => route.meta.totalPage || '')
const title = computed(() => route.meta.title || '')
const subTitle = computed(() => route.meta.subTitle || '')

const handleClick = () => {
  const path = route.path

  if (path.endsWith('/address')) {
    router.push({ name: 'addressConfirm' })
  }

  if (path.endsWith('/confirm')) {
    router.push({ name: '' })
  }

}

</script>

<template>
  <div class="PropertyAdd">
    <div class="property-add-header">
      <div class="property-add-page-number">
        {{ currentPage }}<span class="total-page"> / {{ totalPage }}</span>
      </div>
      <div class="property-add-title-wrapper">
        <p class="property-add-title-text">{{ title }}</p>
        <p class="property-add-sub-title-text">{{ subTitle }}</p>
      </div>
    </div>
    <!-- 각 단계별 화면 구성 -->
    <router-view />

    <!-- 다음 경로가 있으면 버튼 활성화 -->
    <Buttons type="default" label="다음" @click="handleClick" class="nextBtn" />
  </div>
</template>

<style scoped lang="scss">
.PropertyAdd {
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 6rem 2rem 0;
}

.property-add-page-number {
  font-size: rem(13px);
  font-weight: var(--font-weight-semibold);
  color: var(--title-text);
}

.total-page {
  font-weight: var(--font-weight-semibold);
  color: var(--sub-title-text);
}

.property-add-title-wrapper {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-top: rem(21px);
}

.property-add-title-text {
  font-size: var(--title-size);
  font-weight: var(--font-weight-semibold);
  color: var(--title-text);
  margin-bottom: 0;
}

.property-add-sub-title-text {
  font-size: var(--sub-title-size);
  font-weight: var(--font-weight-regular);
  color: var(--sub-title-text);
  margin-bottom: rem(34px);
}

.nextBtn {
  width: 100%;
  height: rem(70px);
  margin-bottom: 5rem;
}
</style>
