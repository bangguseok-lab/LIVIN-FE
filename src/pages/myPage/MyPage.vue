<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/stores/user' // Store 경로를 맞춰주세요.

import Navbar from '@/components/layouts/Navbar.vue'
import Buttons from '@/components/common/buttons/Buttons.vue'
import ProfileImageModal from '@/components/modals/ProfileImageModal.vue'

import defaultProfileImage from '@/assets/images/profile/test-img.svg'

const router = useRouter()
const userStore = useUserStore()

// Store의 상태를 직접 참조 (반응성을 유지하기 위해 storeToRefs 사용)
const { userInfo } = storeToRefs(userStore)
const nickname = computed(() => userInfo.value?.data?.nickname || '닉네임')
const name = computed(() => userInfo.value?.data?.name || '이름')
const birth = computed(() => userInfo.value?.data?.birth || '생년월일')
const phoneNumber = computed(() => userInfo.value?.data?.phone || '전화번호')
const role = computed(() => userInfo.value?.data?.role || 'TENANT')
const profileImage = computed(() => {
  const imageNumber = userInfo.value?.data?.profileImage ?? 1
  return new URL(`../../assets/images/profile/test-${imageNumber}.svg`, import.meta.url).href
})

// const { profileImageUrl } = storeToRefs(userStore)


const editingField = ref(null)
const tempValue = ref('')

const nicknameRef = ref(null)
const phoneRef = ref(null)

const showProfileModal = ref(false)

// ✅ 닉네임/연락처 수정 저장
async function saveEdit(field) {
  if (field === 'nickname' && nicknameRef.value) {
    tempValue.value = nicknameRef.value.innerText
  } else if (field === 'phone' && phoneRef.value) {
    tempValue.value = phoneRef.value.innerText
  }

  const newValue = tempValue.value.trim()
  if (newValue !== '') {
    try {
      const payload = {
        nickname: field === 'nickname' ? newValue : userInfo.value.nickname,
        phoneNumber: field === 'phone' ? newValue : userInfo.value.phoneNumber,
      }
      await userStore.updateUserInfo(payload)
      console.log(`${field} 수정 성공`)
    } catch (err) {
      console.error(`${field} 수정 실패`, err)
      alert('수정 중 오류가 발생했어요.')
    }
  }

  editingField.value = null
}

// ✅ 역할 토글 변경 처리 (임대인 / 임차인 클릭 시)
async function setUserType(type) {
  const newRole = type === '임대인' ? 'LANDLORD' : 'TENANT'
  if (role.value === newRole) return

  try {
    await userStore.changeRole(newRole)
    // console.log('역할 변경 성공')
  } catch (err) {
    console.error('역할 변경 실패', err)
    alert('유형 변경 중 오류가 발생했어요.')
  }
}

async function handleLogout() {
  try {
    await userStore.logout()
    alert('로그아웃 되었습니다.')
    router.push('/auth/login') // 로그인 페이지로 이동
  } catch (err) {
    console.error('로그아웃 실패', err)
    alert('로그아웃 중 오류가 발생했습니다.')
  }
}

// 회원탈퇴 처리
async function handleWithdraw() {
  if (!confirm('정말 회원 탈퇴하시겠습니까?')) return

  try {
    await userStore.withdraw()
    alert('회원 탈퇴가 완료되었습니다.')
    router.push('/auth/login') // 회원가입 페이지 등으로 이동
  } catch (err) {
    console.error('회원 탈퇴 실패', err)
    alert('회원 탈퇴 중 오류가 발생했습니다.')
  }
}

// 버튼 내용 다르게 보여주기
const manageButton = computed(() => {
  if (!userInfo.value) return { title: '', desc: '' }

  return userInfo.value.role === 'LANDLORD'
    ? {
      title: '내 매물 관리하기',
      desc: '내가 올린 매물을 확인하고 관리해요',
    }
    : {
      title: '나만의 체크리스트 관리하기',
      desc: '내가 찾는 집을 위한',
    }
})

function handleManageClick(buttonTitle) {
  if (userInfo.value?.role === 'TENANT') {
    router.push('/checklist')
  } else {
    if (buttonTitle === '내 매물 관리하기') {
      router.push('/propertyManage')
    } else if (buttonTitle === '내 매물 등록하기') {
      router.push({ name: 'propertyAdd' })
    }
  }
}

function startEdit(field) {
  editingField.value = field
  tempValue.value = userInfo.value[field === 'phone' ? 'phoneNumber' : field]
}

function openProfileModal() {
  showProfileModal.value = true
}

async function onProfileImageChange(imgNumber) {
  try {
    await userStore.uploadProfileImage(imgNumber)
    // console.log('프로필 이미지 수정 성공')
    // Store에서 이미지 URL을 업데이트하므로, 여기서는 모달만 닫음
    showProfileModal.value = false
  } catch (err) {
    console.error('프로필 이미지 수정 실패', err)
    alert('프로필 이미지 수정 중 오류가 발생했습니다.')
  }
}

// ✅ 마운트 시 사용자 정보 및 프로필 이미지 불러오기
onMounted(async () => {
  await userStore.fetchUserInfo()
})
</script>

<template>
  <div class="MyPage">
    <section class="greeting-section">
      <div class="greeting-inner">
        <div class="profile-img" @click="openProfileModal">
          <img :src="profileImage || defaultProfileImage" alt="프로필 이미지" />
          <!-- <img :src="profileImageUrl" alt="프로필 이미지" /> -->
        </div>
        <div class="text-block">
          <p class="hello">안녕하세요,</p>
          <p class="nickname">{{ nickname }}<span class="nim">님!</span></p>
        </div>
      </div>
    </section>

    <section class="info-section">
      <div class="info-header">
        <h2>회원 정보</h2>
        <div class="user-type-toggle">
          <button :class="{ active: role === 'LANDLORD' }" @click="setUserType('임대인')">
            임대인
          </button>
          <button :class="{ active: role === 'TENANT' }" @click="setUserType('임차인')">
            임차인
          </button>
        </div>
      </div>

      <ul class="info-list">
        <li>
          <span class="label">이름</span>
          <span class="value">{{ name }}</span>
          <button class="edit-btn invisible">수정</button>
        </li>

        <li>
          <span class="label">닉네임</span>
          <span class="value">
            <span v-if="editingField === 'nickname'" contenteditable="true" class="editable-text" ref="nicknameRef"
              :style="{ color: 'var(--primary-color)' }">{{ tempValue }}</span>
            <span v-else>{{ nickname }}</span>
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
          <span class="value">{{ birth }}</span>
          <button class="edit-btn invisible">수정</button>
        </li>

        <li>
          <span class="label">연락처</span>
          <span class="value">
            <span v-if="editingField === 'phone'" contenteditable="true" class="editable-text" ref="phoneRef"
              :style="{ color: 'var(--primary-color)' }">{{ tempValue }}</span>
            <span v-else>{{ phoneNumber }}</span>
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
        {{
          role === 'LANDLORD' ? '나의 매물 관리' : '나의 체크리스트 관리'
        }}
      </h2>
      <Buttons v-if="role === 'LANDLORD'" type="xl" @click="handleManageClick('내 매물 등록하기')" class="create-property-btn">
        <div class="top-text">나의 매물을 등록하고 싶어요</div>
        <div class="bottom-text">내 매물 등록하기</div>
      </Buttons>
      <Buttons type="xl" @click="handleManageClick(manageButton.title)" class="manage-btn">
        <div class="top-text">{{ manageButton.desc }}</div>
        <div class="bottom-text">{{ manageButton.title }}</div>
      </Buttons>

    </section>

    <section class="account-section">
      <button class="account-btn logout" @click="handleLogout">로그아웃</button>
      <div class="vertical-divider"></div>
      <button class="account-btn leave" @click="handleWithdraw">
        회원탈퇴
      </button>
    </section>

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
  grid-template-columns: 1.2fr 3fr 7.5rem;
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
  justify-content: flex-start;
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
