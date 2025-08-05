<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import Navbar from '@/components/layouts/Navbar.vue'
import Buttons from '@/components/common/buttons/Buttons.vue'
import ProfileImageModal from '@/components/modals/ProfileImageModal.vue'

// SVG 이미지 불러오기
import defaultProfileImage from '@/assets/images/profile/test-img.svg'

const router = useRouter()

const user = ref({
  name: '전영태',
  nickname: '영태는 핑크가 제일 좋아',
  birth: '2000.04.08',
  phone: '010-1234-5678',
  type: '임대인',
})

const editingField = ref(null)
const tempValue = ref('')

const nicknameRef = ref(null)
const phoneRef = ref(null)

const showProfileModal = ref(false)
const profileImage = ref(defaultProfileImage) // 기본 프로필 이미지를 SVG로

function startEdit(field) {
  editingField.value = field
  tempValue.value = user.value[field]
}

function saveEdit(field) {
  if (field === 'nickname' && nicknameRef.value) {
    tempValue.value = nicknameRef.value.innerText
  } else if (field === 'phone' && phoneRef.value) {
    tempValue.value = phoneRef.value.innerText
  }

  if (tempValue.value.trim() !== '') {
    user.value[field] = tempValue.value
  }
  editingField.value = null
}

function setUserType(type) {
  user.value.type = type
}

const manageButton = computed(() => {
  return user.value.type === '임대인'
    ? {
      title: '내 매물 관리하기',
      desc: '내가 올린 매물을 확인하고 관리해요',
    }
    : {
      title: '나만의 체크리스트 관리하기',
      desc: '내가 찾는 집을 위한',
    }
})

function handleManageClick() {
  if (user.value.type === '임차인') {
    router.push('/checklist')
  } else {
    if (manageButton.value.title === '내 매물 관리하기') {
      router.push('/propertyManage')
    }
    router.push('/add/property')
  }
}

function openProfileModal() {
  showProfileModal.value = true
}

function onProfileImageChange(newImage) {
  profileImage.value = newImage
  showProfileModal.value = false
  // 여기서 API 호출해서 DB 저장 처리 가능
}
</script>

<template>
  <div class="MyPage">
    <section class="greeting-section">
      <div class="greeting-inner">
        <div class="profile-img" @click="openProfileModal">
          <img :src="profileImage" alt="프로필 이미지" />
        </div>
        <div class="text-block">
          <p class="hello">안녕하세요,</p>
          <p class="nickname">
            {{ user.nickname }}<span class="nim">님!</span>
          </p>
        </div>
      </div>
    </section>

    <section class="info-section">
      <div class="info-header">
        <h2>회원 정보</h2>
        <div class="user-type-toggle">
          <button :class="{ active: user.type === '임대인' }" @click="setUserType('임대인')">
            임대인
          </button>
          <button :class="{ active: user.type === '임차인' }" @click="setUserType('임차인')">
            임차인
          </button>
        </div>
      </div>

      <ul class="info-list">
        <li>
          <span class="label">이름</span>
          <span class="value">{{ user.name }}</span>
          <button class="edit-btn invisible">수정</button>
        </li>

        <li>
          <span class="label">닉네임</span>
          <span class="value">
            <span v-if="editingField === 'nickname'" contenteditable="true" class="editable-text" ref="nicknameRef"
              :style="{ color: 'var(--primary-color)' }">{{ tempValue }}</span>
            <span v-else>{{ user.nickname }}</span>
          </span>
          <button class="edit-btn" @click="
            editingField === 'nickname'
              ? saveEdit('nickname')
              : startEdit('nickname')
            ">
            {{ editingField === 'nickname' ? '수정완료' : '수정하기' }}
          </button>
        </li>

        <li>
          <span class="label">생년월일</span>
          <span class="value">{{ user.birth }}</span>
          <button class="edit-btn invisible">수정</button>
        </li>

        <li>
          <span class="label">연락처</span>
          <span class="value">
            <span v-if="editingField === 'phone'" contenteditable="true" class="editable-text" ref="phoneRef"
              :style="{ color: 'var(--primary-color)' }">{{ tempValue }}</span>
            <span v-else>{{ user.phone }}</span>
          </span>
          <button class="edit-btn" @click="
            editingField === 'phone' ? saveEdit('phone') : startEdit('phone')
            ">
            {{ editingField === 'phone' ? '수정완료' : '수정하기' }}
          </button>
        </li>
      </ul>
    </section>

    <div class="divider"></div>

    <section class="manage-section">
      <h2 class="manage-title">
        {{ user.type === '임대인' ? '나의 매물 관리' : '나의 체크리스트 관리' }}
      </h2>
      <Buttons v-if="user.type === '임대인'" type="xl" @click="handleManageClick" class="create-property-btn">
        <div class="top-text">나의 매물을 등록하고 싶어요</div>
        <div class="bottom-text">내 매물 등록하기</div>
      </Buttons>
      <Buttons type="xl" @click="handleManageClick" class="manage-btn">
        <div class="top-text">{{ manageButton.desc }}</div>
        <div class="bottom-text">{{ manageButton.title }}</div>
      </Buttons>

    </section>

    <section class="account-section">
      <button class="account-btn logout">로그아웃</button>
      <div class="vertical-divider"></div>
      <button class="account-btn leave">회원탈퇴</button>
    </section>

    <!-- 프로필 이미지 변경 모달 -->
    <ProfileImageModal v-model="showProfileModal" @change="onProfileImageChange" />
  </div>

  <Navbar />
</template>

<style scoped lang="scss">
@import '@/assets/styles/utils/_pxToRem.scss';

.MyPage {
  width: 100%;
  margin: 0 auto;
  padding-bottom: rem(70px);
  background-color: var(--white);
}

.greeting-section {
  background: var(--primary-color);
  color: var(--white);
  padding: rem(150px) rem(30px) rem(46px);
  position: relative;
  z-index: 1;
}

.greeting-inner {
  display: flex;
  align-items: center;
  gap: rem(12px);
}

.profile-img {
  width: rem(72px);
  height: rem(72px);
  border-radius: 50%;
  overflow: hidden;
  cursor: pointer;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
}

.text-block .hello {
  font-size: rem(14px);
  margin: 0;
  opacity: 0.6;
}

.nickname {
  font-size: rem(18px);
  font-weight: 800;
  margin: 0;
}

.nim {
  font-weight: 400;
  opacity: 0.6;
}

.info-section {
  background: var(--white);
  border-radius: rem(28px) rem(28px) 0 0;
  margin: rem(-20px) 0 0 0;
  padding: rem(30px) rem(50px);
  width: 100%;
  box-shadow: 0 rem(2px) rem(6px) rgb(0 0 0 / 0.05);
  font-size: rem(13px);
  position: relative;
  z-index: 2;
}

.info-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: rem(16px);
}

.info-header h2 {
  font-size: rem(16px);
  font-weight: 800;
}

.user-type-toggle {
  background: var(--grey);
  border-radius: rem(24px);
  display: flex;
  padding: 0;
  width: rem(100px);
  font-weight: 700;
  font-size: rem(10px);
  overflow: hidden;
}

.user-type-toggle button {
  flex: 1;
  background: transparent;
  border: none;
  border-radius: rem(16px);
  padding: rem(6px) 0;
  color: var(--white);
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.user-type-toggle button.active {
  background: var(--primary-color);
  color: var(--white);
  box-shadow: 0 rem(3px) rem(6px) rgb(23 125 250 / 0.4);
  font-weight: 500;
}

.info-list {
  display: flex;
  flex-direction: column;
  list-style: none;
  padding: 0;
  margin: 0;
  width: 100%;
}

.info-list li {
  display: grid;
  grid-template-columns: 1.2fr 2fr rem(40px);
  align-items: center;
  border-bottom: rem(1px) solid #eee;
  padding: rem(12px) 0;
}

.label {
  flex: 1;
  color: #777;
  font-weight: 500;
  font-size: rem(13px);
}

.value {
  flex: 2;
  color: var(--black);
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: rem(6px);
  word-break: break-word;
  font-size: rem(13px);
}

.editable-text {
  outline: none;
  min-width: rem(50px);
  display: inline-block;
  cursor: text;
}

.edit-btn {
  width: rem(40px);
  background: none;
  border: none;
  font-size: rem(10px);
  color: var(--grey);
  cursor: pointer;
}

.invisible {
  visibility: hidden;
}

.divider {
  height: rem(12px);
  background: #f1f3f5;
  margin: 0 0 rem(8px);
}

.manage-section {
  padding: 0 rem(50px);
  margin-bottom: rem(20px);
}

.manage-title {
  font-size: rem(16px);
  font-weight: 600;
  margin-bottom: rem(24px);
  padding-top: rem(16px);
}

.manage-btn {
  height: rem(100px);
}

.create-property-btn {
  height: rem(100px);
  margin-bottom: 1rem;
}

.account-section {
  display: flex;
  justify-content: space-around;
  margin-top: rem(24px);
  padding: 0 rem(50px);
}

.account-btn {
  font-size: rem(10px);
  color: var(--grey);
  background: none;
  border: none;
  cursor: pointer;
  padding: rem(8px);
}

.account-btn.logout:hover,
.account-btn.leave:hover {
  color: var(--black);
}

.vertical-divider {
  width: rem(1px);
  height: rem(12px);
  background-color: #ddd;
  margin-top: rem(8px);
}
</style>
