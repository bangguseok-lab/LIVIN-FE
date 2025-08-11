<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import { computed, defineProps, defineEmits } from 'vue';
import { useRouter } from 'vue-router'

// 아이콘
import IconBlue from '@/assets/togo-btn-blue.svg';
import IconWhite from '@/assets/togo-btn-white.svg';
import CloseIcon from '@/assets/close-btn.svg';

// API
// import { deleteMyChecklistItem } from '@/api/checklist';

const router = useRouter()


// Props 정의
const props = defineProps({
  label: {
    type: String,
    default: 'OK',
  },
  isActive: {
    type: Boolean,
    default: false,
  },
  type: {
    type: String,
    default: 'default',
    validator: (val) => [
      'default', 'xl', 'md', 'sm', 'xs', 'ok', 'go', 'property', 'role', 'option', 'direction', 'date', 'photo', 'floor', 'my-option'
    ].includes(val),
  },
  togo: {
    type: [String, Object], // ex: '/home' or { name: 'HomePage' }
    default: null,
  },
  iconType: {
    type: String,
    default: 'blue',
  },
  showIcon: {
    type: Boolean,
    default: false,
  }
})

// Emit 정의 (버튼 토글 상태를 외부로 보냄)
const emit = defineEmits(['update:isActive'])

// Click 시 상태 반전
const handleClick = () => {
  // togo 값이 props에서 전달되었을 때만 페이지 이동
  if (props.togo) {
    router.push(props.togo) // props에서 전달해준 페이지로 이동
  } else {
    emit('update:isActive', !props.isActive)  // 토글 처리가 필요하면, 토글 처리
  }
}

// Click 시 항목 삭제 API 호출 ==================================================> API 개발 후 수정 필요
const handelClose = async () => {
  // const confirmed = confirm('삭제하시겠습니까?');
  // if (!confirmed) return;

  // try {
  //   await deleteMyChecklistItem(id, item_id);   // id: checklist id, item_id: my-checklist-id
  //   alert('삭제되었습니다.');

  //   // 삭제 후 나만의 항목 다시 조회
  // } catch (error) {
  //   console.error('삭제 실패:', error);
  //   alert('삭제 중 오류가 발생했습니다.');
  // }
  alert('삭제하시겠습니까?')
}

// class 계산
const typeClass = computed(() => `btn-${props.type}`)
const activeClass = computed(() => {
  const activeTypes = ['default', 'md', 'sm', 'ok', 'go', 'go-lg', 'my-option']  // props.type이 이 중에 있으면, 버튼 전체를 채우는 fill-active 스타일이 적용
  return props.isActive ? (activeTypes.includes(props.type) ? 'fill-active' : 'border-active') : '';
})

// iconType 에 따른 아이콘별 주소 지정

const iconComponent = computed(() => {
  switch (props.iconType) {
    case 'white':
      return IconWhite
    default:
      return IconBlue
  }
})
</script>

<template>
  <div class="Buttons">
    <button class="button" :class="[typeClass, activeClass]" @click="handleClick">
      <!-- 슬롯이 있으면 슬롯 내용을, 없으면 label을 보여줌 -->
      <slot>{{ label }}</slot>

      <!-- label이 지정한 값일 때만 아이콘 표시 -->
      <img v-if="label === '적용된 매물 보러가기' || label === '체크리스트 확인하기'" :src="iconComponent" alt="icon" />
    </button>
    <!-- 버튼이 my-option 타입일 때만 close icon 보여줌 -->
    <img v-if="type === 'my-option'" :src=CloseIcon alt="항목 삭제하기" class="close-icon" @click="handelClose">
  </div>
</template>

<style scoped lang="scss">
.Buttons {
  display: flex;
  justify-content: center;
  align-items: center;
}

.button {
  background-color: white;
  color: var(--grey);
  font-weight: 600;
  cursor: pointer;
  border: none;
  width: 100%;
  height: 100%;
}

// btn-default, 제일 기본 버튼
.btn-default {
  background-color: var(--grey);
  color: var(--white);
  border-radius: rem(10px);
}

.btn-default:hover {
  background-color: var(--primary-color);
  color: white;
}

// btn-xl, 메인페이지에 사용되는 큰 버튼
.btn-xl {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  background-color: var(--primary-color);
  padding: rem(8px) rem(30px);
  border-radius: rem(10px);
  color: white;
}

// 슬롯 내부 텍스트 스타일 적용을 위해서 :deep CSS 선택자 사용
.btn-xl :deep(.top-text) {
  font-size: rem(10px);
  margin-bottom: rem(2px);
}

.btn-xl :deep(.bottom-text) {
  font-size: rem(16px);
  font-weight: var(--font-weight-lg);
}


// btn-md, 완료, 초기화, 확인에 많이 사용되는 버튼
.btn-md {
  background-color: var(--grey);
  color: white;
  border-radius: rem(8px);
}


// btn-sm, 체크리스트 항목에 많이 사용되는 버튼
.btn-sm {
  background-color: var(--grey);
  color: white;
  min-width: rem(85px);
  max-width: rem(150px); // 최대 너비 설정
  width: fit-content;
  min-height: rem(35px);
  padding: rem(4px) rem(10px);
  border-radius: rem(6px);

  white-space: normal; // 텍스트 줄바꿈 허용
  word-wrap: break-word; // 긴 단어도 줄바꿈
  text-align: center; // 텍스트 가운데 정렬
  line-height: 1.4; // 줄 간격

  font-size: rem(12px);
  font-weight: var(--font-weight-lg);
}

.btn-sm :deep(.option-text) {
  font-size: rem(12px);
  font-weight: var(--font-weight-regular);
}


// btn-xs, 관리비에 사용되는 버튼
.btn-xs {
  min-width: rem(60px);
  width: fit-content;
  height: rem(24px);
  padding: rem(2px) rem(4px);
  border: rem(1px) solid var(--grey);
  border-radius: rem(10px);
  color: var(--grey);
  font-size: rem(12px);
}


// btn-ok, 확인 버튼
.btn-ok {
  width: rem(180px);
  height: rem(38px);
  background-color: var(--grey);
  color: white;
  border-radius: rem(14px);
  font-size: rem(15px);
}

// btn-go, ~보러가기 버튼 (페이지 이동 O)
.btn-go {
  width: rem(150px);
  height: rem(36px);
  color: var(--primary-color);
  border: rem(1px) solid var(--primary-color);
  border-radius: rem(12px);
  font-size: rem(12px);
}

.btn-go img {
  margin-left: rem(8px);
}

// btn-property, 매물 관련 필터링 버튼
.btn-property {
  width: rem(160px);
  height: rem(30px);
  border: rem(1px) solid var(--grey);
  border-radius: rem(12px);
  font-size: rem(14px);
}

// btn-role, 임대인, 임차인 역할 관련 버튼
.btn-role {
  display: flex;
  flex-direction: column;
  justify-content: start;
  padding-top: 4rem;

  width: rem(240px);
  height: rem(300px);
  border: rem(1px) solid var(--grey);
  border-radius: rem(13px);
}

.btn-role :deep(.role-text) {
  font-size: rem(18px);
  font-weight: var(--font-weight-bold);
  margin-bottom: rem(4px);
  color: var(--title-text);
}

.btn-role :deep(.role-description-text) {
  font-size: rem(12px);
  font-weight: var(--font-weight-regular);
  color: var(--grey);
}

.btn-role.border-active :deep(.role-description-text) {
  color: var(--primary-color)
}

// btn-go-lg, 등록한 매물 보러가기 버튼
.btn-go-lg {
  width: rem(352px);
  height: rem(54px);
  border-radius: rem(14px);
  background-color: var(--grey);
  color: white;
  font-size: rem(15px);
  font-weight: var(--font-weight-lg);
}


// btn-option, 매물 등록 시 옵션 관련 버튼
.btn-option {
  height: rem(60px);
  border: rem(1px) solid var(--grey);
  border-radius: rem(14px);
  font-size: 1rem;
  font-weight: var(--font-weight-semibold);
}


// btn-date, 즉시 입주 가능해요 버튼
.btn-date {
  width: rem(352px);
  height: rem(52px);
  border: rem(1px) solid var(--grey);
  border-radius: rem(14px);
  font-size: rem(16px);
  font-weight: var(--font-weight-sm);
}

// btn-photo, 매물 등록 사진 추가하기 버튼
.btn-photo {
  width: rem(308px);
  height: rem(38px);
  border: rem(1px) solid var(--grey);
  border-radius: rem(14px);
  font-size: rem(12px);
  font-weight: 600;
}

// btn-direction, 주실 방향 관련 버튼
.btn-direction {
  width: rem(162px);
  height: rem(62px);
  border: rem(1px) solid var(--grey);
  border-radius: rem(14px);
  font-size: rem(20px);
  font-weight: var(--font-weight-lg);
}

// btn-floor, 복층 관련 버튼
.btn-floor {
  width: rem(144px);
  height: rem(38px);
  border: rem(1px) solid var(--grey);
  border-radius: rem(14px);
  font-size: rem(12px);
  font-weight: var(--font-weight-sm);
}


// btn-my-option, 나의 항목 삭제하기 버튼
.btn-my-option {
  background-color: var(--grey);
  color: white;
  min-width: rem(85px);
  max-width: rem(150px); // 최대 너비 설정
  width: fit-content;
  min-height: rem(35px);
  padding: rem(4px) rem(10px);
  border-radius: rem(6px);

  white-space: normal; // 텍스트 줄바꿈 허용
  word-wrap: break-word; // 긴 단어도 줄바꿈
  text-align: center; // 텍스트 가운데 정렬
  line-height: 1.4; // 줄 간격

  font-size: rem(12px);
  font-weight: var(--font-weight-lg);
}

.close-icon {
  position: relative;
  top: rem(-15px);
  right: rem(12px);
}



// 토글 active 상태일 때 디자인들
.fill-active {
  background-color: var(--primary-color);
  color: white;
}

.border-active {
  background-color: white;
  color: var(--primary-color);
  border: rem(1.5px) solid var(--primary-color);
}
</style>
