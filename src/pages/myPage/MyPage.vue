<script setup>
import { ref, computed } from 'vue'

// 사용자 데이터
const user = ref({
  name: '전영태',
  nickname: '영태는 핑크가 제일 좋아',
  birth: '2000.04.08',
  phone: '010-1234-5678',
  type: '임대인',
})

// 수정 상태
const editingField = ref(null)
const tempValue = ref('')

// contenteditable 요소 ref
const nicknameRef = ref(null)
const phoneRef = ref(null)

// 수정 시작
function startEdit(field) {
  editingField.value = field
  tempValue.value = user.value[field]
}

// 수정 저장
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

// 사용자 타입 토글
function setUserType(type) {
  user.value.type = type
}

// 버튼 텍스트
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
</script>

<template>
  <div class="MyPage">
    <header class="header">
      <button class="back">←</button>
    </header>

    <section class="greeting-section">
      <div class="greeting-inner">
        <div class="profile-img">프로필 이미지</div>
        <div class="text-block">
          <p class="hello">안녕하세요,</p>
          <p class="nickname">{{ user.nickname }}님!</p>
        </div>
      </div>
    </section>

    <section class="info-section">
      <div class="info-header">
        <h2>회원 정보</h2>
        <div class="user-type-toggle">
          <button
            :class="{ active: user.type === '임대인' }"
            @click="setUserType('임대인')"
          >
            임대인
          </button>
          <button
            :class="{ active: user.type === '임차인' }"
            @click="setUserType('임차인')"
          >
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
            <span
              v-if="editingField === 'nickname'"
              contenteditable="true"
              class="editable-text"
              ref="nicknameRef"
              :style="{ color: 'var(--primary-color)' }"
              >{{ tempValue }}</span
            >
            <span v-else>{{ user.nickname }}</span>
          </span>
          <button
            class="edit-btn"
            @click="
              editingField === 'nickname'
                ? saveEdit('nickname')
                : startEdit('nickname')
            "
          >
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
            <span
              v-if="editingField === 'phone'"
              contenteditable="true"
              class="editable-text"
              ref="phoneRef"
              :style="{ color: 'var(--primary-color)' }"
              >{{ tempValue }}</span
            >
            <span v-else>{{ user.phone }}</span>
          </span>
          <button
            class="edit-btn"
            @click="
              editingField === 'phone' ? saveEdit('phone') : startEdit('phone')
            "
          >
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
      <button class="manage-button">
        <p class="desc" v-html="manageButton.desc.replace(/\n/g, '<br>')"></p>
        <p class="title">{{ manageButton.title }}</p>
      </button>
    </section>

    <nav class="bottom-nav">
      <button><span>🏠</span><br />홈</button>
      <button><span>🔍</span><br />매물 찾기</button>
      <button><span>✅</span><br />체크리스트</button>
      <button><span>❤️</span><br />찜</button>
      <button><span>👤</span><br />마이페이지</button>
    </nav>
  </div>
</template>

<style scoped lang="scss">
.MyPage {
  width: 393px;
  min-height: 100vh;
  background-color: var(--white);
  margin: 0 auto;
  font-family: 'Noto Sans KR', sans-serif;
  color: #333;
  padding-bottom: 63px;
}

/* 헤더 */
.header {
  height: 35px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 12px;
  font-weight: 700;
  font-size: 12px;
  position: relative;
  background: var(--primary-color);
  color: var(--white);
}
.header .back {
  position: absolute;
  left: 12px;
  background: none;
  border: none;
  font-size: 10px;
  color: var(--white);
  cursor: pointer;
}

/* 인삿말 */
.greeting-section {
  background: var(--primary-color);
  color: var(--white);
  padding: 90px 20px 40px;
  position: relative;
  z-index: 1;
}
.greeting-inner {
  display: flex;
  align-items: center;
  gap: 12px;
}
.profile-img {
  background: #aac7ff;
  color: var(--white);
  border-radius: 50%;
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 700;
}
.text-block .hello {
  font-size: 13px;
  margin-bottom: 2px;
}
.text-block .nickname {
  font-size: 16px;
  font-weight: 800;
}

/* 회원 정보 */
.info-section {
  background: var(--white);
  border-radius: 28px 28px 0 0;
  margin: -24px 0 0 0;
  padding: 30px;
  width: 100%;
  box-shadow: 0 2px 6px rgb(0 0 0 / 0.05);
  font-size: 13px;
  position: relative;
  z-index: 2;
}
.info-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}
.info-header h2 {
  font-size: 16px;
  font-weight: 800;
}
.user-type-toggle {
  background: var(--grey);
  border-radius: 24px;
  display: flex;
  padding: 0px;
  width: 100px;
  font-weight: 700;
  font-size: 10px;
  overflow: hidden;
}
.user-type-toggle button {
  flex: 1;
  background: transparent;
  border: none;
  border-radius: 16px;
  padding: 6px 0;
  color: var(--white);
  cursor: pointer;
  transition: background-color 0.3s ease;
}
.user-type-toggle button.active {
  background: var(--primary-color);
  color: var(--white);
  box-shadow: 0 3px 6px rgb(23 125 250 / 0.4);
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
  grid-template-columns: 1fr 2fr 40px;
  align-items: center;
  border-bottom: 1px solid #eee;
  padding: 12px 0;
}
.label {
  flex: 1;
  color: #777;
  font-weight: 500;
  font-size: 13px;
}
.value {
  flex: 2;
  color: #222;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 6px;
  word-break: break-word;
  font-size: 13px;
}
.editable-text {
  outline: none;
  min-width: 50px;
  display: inline-block;
  cursor: text;
}
.edit-btn {
  width: 40px;
  background: none;
  border: none;
  font-size: 10px;
  color: var(--grey);
  cursor: pointer;
}
.invisible {
  visibility: hidden;
}

/* 회색 구분선 */
.divider {
  height: 12px;
  background: #f1f3f5;
  margin: 0px 0 16px;
}

/* 관리 버튼 섹션 */
.manage-section {
  padding: 0 16px;
  margin-bottom: 20px;
}
.manage-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 12px;
  padding-top: 16px;
}
.manage-button {
  background: var(--primary-color);
  color: var(--white);
  border-radius: 16px;
  padding: 20px 16px;
  width: 100%;
  text-align: left;
  border: none;
  font-weight: 700;
  box-shadow: 0 4px 8px rgb(23 125 250 / 0.3);
  line-height: 1.1;
}
.manage-button .desc {
  font-size: 10px;
  margin-bottom: 8px;
  opacity: 0.9;
  font-weight: 500;
}
.manage-button .title {
  font-size: 18px;
  font-weight: 800;
}

/* 바텀 네비게이션 */
.bottom-nav {
  position: fixed;
  bottom: 0;
  width: 393px;
  height: 63px;
  background: var(--white);
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 0;
  border-top: 1px solid #eee;
  font-size: 10px;
  color: #888;
  font-weight: 600;
  user-select: none;
}
.bottom-nav button {
  background: none;
  border: none;
  color: #888;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  cursor: pointer;
  font-size: 11px;
  line-height: 1.2;
}
.bottom-nav button:hover,
.bottom-nav button:focus {
  color: var(--primary-color);
}
</style>
