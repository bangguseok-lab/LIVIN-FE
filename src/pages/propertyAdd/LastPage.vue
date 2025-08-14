<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router';
import Buttons from '@/components/common/buttons/Buttons.vue';
import { usePropertyStore } from '@/stores/property';

const router = useRouter()
const propertyStore = usePropertyStore()

// 로컬 상태
const text = ref('')

// 재진입 시 스토어 → 화면 복원
onMounted(() => {
  text.value = propertyStore.getNewProperty?.description ?? ''
})

// 글자수 계산
const maxLen = 200
const count = computed(() => text.value.length)

const handlePrevClick = () => {
  router.push({ name: "moveDatePage" })
}

const handleNextClick = () => {
  propertyStore.updateNewProperty('description', text.value.trimStart()) // 앞 공백 방지 원하면 제거
  router.push({ name: "donePage" })
}
</script>

<template>
  <div class="LastPage">
    <div class="last-container">
      <div class="desc-field">
        <div class="counter">
          <strong>{{ count }}</strong><span class="total">/{{ maxLen }}</span>
        </div>

        <textarea v-model="text" :maxlength="maxLen" placeholder="설명을 입력하세요" rows="8" class="desc-textarea" />
      </div>
    </div>
    <div class="button-wrapper">
      <Buttons type="default" label="이전" @click="handlePrevClick" class="prevBtn" />
      <Buttons type="default" label="다음" @click="handleNextClick" class="nextBtn" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.LastPage {
  position: relative;
  width: 100%;
  height: 90%;
}

.last-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 70%;
}

.desc-field {
  position: relative;
  margin: 1rem 0;
}

/* 카운터 */
.counter {
  position: absolute;
  top: -10px;
  right: 10px;
  background: var(--white);
  padding: 0 rem(6px);
  font-size: rem(14px);
  line-height: 1;
}

.counter strong {
  color: #111;
  font-weight: var(--font-weight-bold);
}

.counter .total {
  color: #c0c4cc;
  margin-left: rem(2px);
}

/* 텍스트 영역 */
.desc-textarea {
  width: 100%;
  min-height: rem(260px);
  padding: .8rem 1rem;
  border-radius: 1rem;
  outline: none;
  font-size: 1rem;
  color: var(--title-text);
  resize: none;
  box-sizing: border-box;
  caret-color: var(--primary-color);
}

/* placeholder 색상 */
.desc-textarea::placeholder {
  color: var(--sub-title-text);
}

/* 텍스트 입력 부분을 클릭했을 때, 주위 그림자 표시 */
.desc-textarea:focus {
  box-shadow: 0 0 0 3px rgba(29, 120, 255, 0.15);
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
</style>
