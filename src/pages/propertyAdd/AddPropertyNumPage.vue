<script setup>
import { onMounted, ref } from 'vue'
import { usePropertyStore } from '@/stores/property'
import Buttons from '@/components/common/buttons/Buttons.vue';
import guessIcon from '@/assets/icons/property/interrogation-icon.svg'
import router from '@/router';

// 부동산 고유번호에 대한 입력값
const propertyNumValue = ref('')
// 매물 등록에 사용될 스토어
const propertyStore = usePropertyStore()


// 부동산 고유번호를 모를 때, 새로운 페이지 열리면서 외부 페이지로 이동
const handleGotoSearch = () => {
  let isOk = confirm('인터넷 등기소 페이지로 이동하시겠습니까?');

  if (isOk) {
    window.open('https://www.iros.go.kr/index.jsp', '_blank');
  }
}

// 다음 페이지로 이동
const handleClick = () => {
  // 부동산 고유번호가 비어있지 않을 때
  if (propertyNumValue.value !== '') {
    // todo: 부동산 고유번호가 유효한 지 검색하고, 스토어에 그 정보를 저장해야 함.
    propertyStore.updateNewProperty('propertyNum', propertyNumValue.value);
    router.push({ name: 'propertyNumberConfirm' })
  } else {
    alert('부동산 고유번호를 입력해주세요')
  }
}

onMounted(() => {
  // 다음 페이지에 갔다가 다시 돌아오는 경우, 입력해뒀던 부동산 고유 번호 보이도록 설정
  propertyNumValue.value = propertyStore.getNewProperty.propertyNum;
})
</script>

<template>
  <div class="AddPropertyNumPage">
    <div class="addPropertyNumber-container">
      <div class="propertyNum-input-wrapper">
        <input type="text" placeholder="부동산 고유번호를 입력해주세요" id="propertyNum-input" v-model="propertyNumValue">
        <button v-if="propertyNumValue" class="clear-btn" @click="propertyNumValue = ''">
          <img src="@/assets/icons/property/clear-icon.svg" class="icon clear" />
        </button>
      </div>
      <div class="guess-box">
        <span class="search-property-number">
          <img :src=guessIcon alt="고유번호 찾기 아이콘" class="icon"><span @click="handleGotoSearch">부동산
            고유번호를
            모르겠어요</span>
        </span>
      </div>
    </div>

    <Buttons type="default" label="다음" @click="handleClick" class="nextBtn" />
  </div>
</template>

<style scoped lang="scss">
.AddPropertyNumPage {
  position: relative;
  width: 100%;
  height: 90%;
}

.addPropertyNumber-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 85%;
}

#propertyNum-input {
  width: 100%;
  padding: .4rem .8rem;
  margin-bottom: .3rem;
  border-radius: rem(10px);
  border: .2rem solid var(--light-grey);
  font-size: 1rem;
  font-weight: var(--font-weight-medium);
  color: var(--title-text);
  outline-color: var(--primary-color);
  caret-color: var(--primary-color);
  background: transparent;
}

.icon {
  width: rem(18px);
  height: rem(18px);
}

.clear-btn {
  position: absolute;
  top: .45rem;
  right: .4rem;
  display: flex;
  align-items: center;
  border: none;
  background: none;
  cursor: pointer;
  padding: rem(4px);
}

.clear {
  opacity: 0.6;
}

.guess-box {
  display: flex;
  justify-content: flex-end;
  width: 100%;
  margin-top: .4rem;
  font-size: .8rem;
  font-weight: var(--font-weight-medium);
  color: var(--sub-title-text);
}

.guess-box>span {
  cursor: pointer;
}

.guess-box>span:hover {
  color: var(--primary-color);
}

.guess-box>img {
  margin-right: .4rem;
  cursor: pointer;
}

.nextBtn {
  width: 100%;
  height: rem(50px);
  margin-bottom: 5rem;
}
</style>
