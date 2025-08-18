<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import Buttons from '@/components/common/buttons/Buttons.vue';
import ImageBox from '@/components/common/imagebox/ImageBox.vue'
import { usePropertyStore } from '@/stores/property';

const router = useRouter()
const photoBtn = ref(true)
const files = ref([]);        // 실제 File 객체
const images = ref([]);       // 미리보기 URL
const selectedIndex = ref(null); // 대표 이미지 인덱스 (예: 하나만 대표라면)

const MAX_IMAGES = 6;
const fileInput = ref(null);
const propertyStore = usePropertyStore();

// 로컬에서 이미지 업로드할 수 있도록 하는 창 열기
const openFileDialog = () => {
  fileInput.value?.click()
}

const rebuildPreviewsFromFiles = (fileList) => {
  // 기존 URL 정리
  images.value.forEach(u => URL.revokeObjectURL(u));
  images.value = [];

  fileList.forEach(f => {
    images.value.push(URL.createObjectURL(f));
  });
}

// 이미지 파일 업로드될 때마다 실행될 함수
const onFilesSelected = (e) => {
  // 더 등록할 수 있는 이미지 파일 수 계산
  const remain = MAX_IMAGES - images.value.length;
  if (remain <= 0) alert('이미지는 최대 6장까지 등록할 수 있습니다.');

  // 선택된 이미지 파일들 중에서 등록할 수 있는 수 만큼만 자름
  const selected = Array.from(e.target.files).slice(0, remain);
  files.value.push(...selected);

  // 미리보기 URL 구성
  rebuildPreviewsFromFiles(files.value);

  // 스토어에 즉시 반영(앞뒤 페이지 이동해도 복원 가능)
  propertyStore.updateNewProperty('imageFiles', files.value);

  // 대표이미지 여부 길이 맞추기 (없으면 false로 채움)
  const base = propertyStore.newProperty.imgRepresentList ?? [];
  const padded = Array.from({ length: files.value.length }, (_, i) => base[i] ?? { represent: false });
  propertyStore.updateNewProperty('imgRepresentList', padded);

  // 같은 파일 다시 선택 가능하게 초기화
  e.target.value = '';
};

// 대표 이미지 선택
const handleSelect = (index) => {
  selectedIndex.value = index;
  const list = files.value.map((_, i) => ({ represent: i === index }));
  propertyStore.updateNewProperty('imgRepresentList', list);
  propertyStore.updateNewProperty('selectedIndex', index);
};

// 이전 버튼 클릭
const handlePrevClick = () => {
  router.push({ name: "riskAnalysisDone" })
}

// 다음 버튼 클릭 (스토어에 저장)
const handleNextClick = () => {
  // 대표이미지 여부 리스트 생성
  const imgRepresentList = files.value.map((_, idx) => ({ represent: idx === selectedIndex.value }));

  propertyStore.updateNewProperty('imageFiles', files.value);          // File[]
  propertyStore.updateNewProperty('imgRepresentList', imgRepresentList); // [{represent:true|false}, ...]

  // 이미지 추가 되었는 지랑 대표 이미지 선택 여부 검사
  if (propertyStore.getNewProperty.imageFiles.length > 0) {
    if (propertyStore.getNewProperty.selectedIndex !== '') {
      router.push({ name: 'roomDirectionPage' });
    } else {
      alert('대표 이미지를 선택해주세요')
    }
  } else {
    alert('이미지를 추가해주세요')
  }
};


onMounted(() => {
  const storedFiles = propertyStore.getNewProperty.imageFiles || [];

  // store에 저장된 이미지가 있다면, (=> 이전 or 다음 버튼으로 페이지를 이동했다가 온 상황)
  if (storedFiles.length) {
    files.value = [...storedFiles];                     // 스토어의 File[] 가져오기
    rebuildPreviewsFromFiles(files.value);              // 화면에서 선택되었던 이미지 보일 수 있도록 미리보기 URL 재생성
  }
  selectedIndex.value = propertyStore.getNewProperty.selectedIndex ?? null;
});

onBeforeUnmount(() => {
  // 이 페이지에서 만든 URL만 정리 (파일은 스토어에 그대로!)
  images.value.forEach(u => URL.revokeObjectURL(u));
});

</script>

<template>
  <div class="PhotoPage">
    <div class="photo-container">
      <div class="photo-wrapper">
        <p class="title">매물 사진</p>
        <p class="sub-title">최대 6장까지 보여줄 수 있어요 ({{ images.length }}/6)</p>
        <p class="choice-title">대표 이미지 한 장을 골라주세요!</p>
        <Buttons class="addPhotoBtn" v-model:is-active="photoBtn" type="photo" label="+ 사진 추가하기"
          @click="openFileDialog" />
        <input ref="fileInput" type="file" accept="image/*" multiple style="display:none" @change="onFilesSelected" />
        <div class="img-wrapper">
          <ImageBox v-for="(img, idx) in images" :key="'local-' + idx" :image="img" type="profile"
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

.choice-title {
  position: relative;
  top: -1rem;
  font-size: 0.8rem;
  font-weight: var(--font-weight-regular);
  margin-bottom: 0;
  color: var(--primary-color)
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
