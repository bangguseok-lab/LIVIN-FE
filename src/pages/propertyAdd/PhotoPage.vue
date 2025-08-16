<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import Buttons from '@/components/common/buttons/Buttons.vue';
import ImageBox from '@/components/common/imagebox/ImageBox.vue'

import img1 from '@/assets/images/profile/test-1.svg'
import img2 from '@/assets/images/profile/test-2.svg'
import img3 from '@/assets/images/profile/test-3.svg'
import img4 from '@/assets/images/profile/test-2.svg'
import img5 from '@/assets/images/profile/test-3.svg'
import img6 from '@/assets/images/profile/test-1.svg'

const images = [img1, img2, img3, img4, img5, img6]

const selectedIndex = ref(null)
const handleSelect = index => {
  selectedIndex.value = index
}

const router = useRouter()

const photoBtn = ref(true)

const handlePrevClick = () => {
  router.push({ name: "riskAnalysisDone" })
}

const handleNextClick = () => {
  router.push({ name: "roomDirectionPage" })
}
</script>

<template>
  <div class="PhotoPage">
    <div class="photo-container">
      <div class="photo-wrapper">
        <p class="title">매물 사진</p>
        <p class="sub-title">최대 6장까지 보여줄 수 있어요</p>
        <Buttons class="addPhotoBtn" v-model:is-active="photoBtn" type="photo" label="+ 사진 추가하기" />
        <div class="img-wrapper">
          <ImageBox v-for="(img, idx) in images" :key="'profile-' + idx" :image="img" type="profile"
            :selected="selectedIndex === idx" @select="() => handleSelect(idx)" />
        </div>
      </div>
    </div>
    <div class="button-wrapper">
      <Buttons type="default" label="이전" @click="handlePrevClick" class="prevBtn" />
      <Buttons type="default" label="다음" @click="handleNextClick" class="nextBtn" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.PhotoPage {
  position: relative;
  width: 100%;
  height: 90%;
}

.photo-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 70%;
}

.photo-wrapper {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.title {
  font-size: 1.1rem;
  font-weight: var(--font-weight-semibold);
  color: var(--title-text);
}

.sub-title {
  position: relative;
  top: -1rem;
  font-size: 0.8rem;
  font-weight: var(--font-weight-regular);
  color: var(--sub-title-text);
  margin-bottom: 0;
}

.addPhotoBtn:deep(.button) {
  width: 100%;
  height: 2.5rem;
  font-size: .8rem;
  padding: .5rem 0;
  margin-bottom: 2rem;
  border: .1rem solid var(--grey);
  color: var(--grey);
}

.addPhotoBtn:deep(.button):hover {
  border: .1rem solid var(--primary-color);
  color: var(--primary-color);
}

.img-wrapper {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  row-gap: .2rem;
}

.img-wrapper:deep(.imagebox-profile) {
  width: 100%;
}

.button-wrapper {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  column-gap: 2rem;
  padding-top: 4rem;
}

.prevBtn,
.nextBtn {
  width: 100%;
  height: rem(50px);
  margin-bottom: 5rem;
}

@media (max-width: 375px) {

  .img-wrapper {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    row-gap: 1rem;
    column-gap: 1.4rem;
  }

}
</style>
