<script setup>
import { ref } from 'vue'
import ImageBox from '@/components/common/imagebox/ImageBox.vue'

import img1 from '@/assets/images/profile/test-1.svg'
import img2 from '@/assets/images/profile/test-2.svg'
import img3 from '@/assets/images/profile/test-3.svg'

const images = [img1, img2, img3]

const selectedIndex = ref(null)
const handleSelect = index => {
  selectedIndex.value = index
}
</script>

<template>
  <div style="padding: 70px; display: flex; flex-direction: column; gap: 40px">
    <section>
      <h2 style="font-size: large; text-align: center">
        프로필 이미지 테스트 (type="profile") 선택하면 파란 테두리
      </h2>
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

    <section>
      <h2 style="font-size: large; text-align: center">
        등록용 이미지 테스트 (type="register")
      </h2>
      <div style="display: flex; justify-content: center; gap: 30px">
        <ImageBox :image="img1" type="register" alt="등록 이미지" />
      </div>
    </section>

    <section>
      <h2 style="font-size: large; text-align: center">
        매물 이미지 테스트 (type="listing")
      </h2>
      <div style="display: flex; justify-content: center">
        <ImageBox :image="img1" type="listing" alt="매물 이미지" />
      </div>
    </section>

    <section>
      <h2 style="font-size: large; text-align: center">
        안심매물 이미지 테스트 (type="listing-safe") - 왼쪽 상단 뱃지 표시
      </h2>
      <div style="display: flex; justify-content: center">
        <ImageBox :image="img2" type="listing-safe" alt="안심매물 이미지" />
      </div>
    </section>
  </div>
</template>

<style scoped></style>
