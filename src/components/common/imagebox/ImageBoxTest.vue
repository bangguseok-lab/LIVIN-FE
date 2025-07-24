<script setup>
import { ref } from 'vue'
import ImageBox from '@/components/common/imagebox/ImageBox.vue'
import profileSvgUrl from '@/assets/images/profile/test-img.svg?url'

const images = [profileSvgUrl, profileSvgUrl, profileSvgUrl]
const selectedIndex = ref(null)

const handleSelect = index => {
  selectedIndex.value = index
}
</script>

<template>
  <div style="padding: 60px">
    <h2 style="font-size: large">프로필 이미지 테스트</h2>
    <div style="display: flex; gap: 16px">
      <ImageBox
        v-for="(img, idx) in images"
        :key="idx"
        :image="img"
        :type="profile"
        :selected="selectedIndex === idx"
        @select="() => handleSelect(idx)"
      />
    </div>
  </div>
</template>

<style scoped></style>
