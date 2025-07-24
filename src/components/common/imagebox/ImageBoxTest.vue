<script setup>
import { ref } from 'vue'
import ImageBox from '@/components/common/imagebox/ImageBox.vue'

// ✅ 색상 다른 PNG 이미지 3개 import
import img1 from '@/assets/images/profile/test1.png'
import img2 from '@/assets/images/profile/test2.png'
import img3 from '@/assets/images/profile/test3.png'

const images = [img1, img2, img3]

// 프로필 이미지 선택 상태
const selectedIndex = ref(null)
const handleSelect = index => {
  selectedIndex.value = index
}
</script>

<template>
  <div style="padding: 60px; display: flex; flex-direction: column; gap: 40px">
    <section>
      <h2 style="font-size: large; text-align: center">프로필 이미지 테스트</h2>
      <div style="display: flex; gap: 30px">
        <ImageBox
          v-for="(img, idx) in images"
          :key="'profile-' + idx"
          :image="img"
          type="profile"
          :selected="selectedIndex === idx"
          @select="() => handleSelect(idx)"
        />
      </div>
    </section>
  </div>
</template>

<style scoped></style>
