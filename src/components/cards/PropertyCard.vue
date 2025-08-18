<script setup>
import api from '@/api/property'
import FavoriteButton from '@/components/common/buttons/FavoriteButton.vue'
import badge from '@/assets/images/landing/SecureBadge.png'
import { ref, watch, computed, watchEffect } from 'vue'
import { useRouter } from 'vue-router'
import SafePropertyModal from '@/components/modals/SafePropertyModal.vue'
import { usePropertyStore } from '@/stores/property'

const router = useRouter()
const propertyStore = usePropertyStore()

defineOptions({ name: 'PropertyCard', inheritAttrs: false })

const modalVisible = ref(false)

const props = defineProps({
  propertyId: {
    type: Number,
    required: true, // 이 값이 없으면 라우팅 안됨
  },
  transactionType: String, // 'JEONSE' | 'MONTHLY_RENT'
  price: Number, // 전세 보증금 또는 월세 보증금
  monthlyRent: Number, // 월세 금액
  title: String,
  imageUrls: Array,
  propertyType: String,
  detailAddress: String,
  exclusiveArea: [String, Number],
  supplyArea: [String, Number],
  floor: [String, Number],
  totalFloors: [String, Number],
  direction: String,
  address: String,
  isFavorite: Boolean,
  isSafe: Boolean,
})

// props에서 초기 상태를 가져와 ref로 설정
const localIsFavorite = ref(props.isFavorite)

import sample1 from '../../assets/images/home/sample-img1.png'
const FORCE_SAMPLE = import.meta.env.VITE_FORCE_SAMPLE_IMAGE === 'true'
const IMAGE_BASE = import.meta.env.VITE_IMAGE_BASE_URL || ''

const pickFirstUrl = arr => {
  if (!Array.isArray(arr) || arr.length === 0) return ''
  const first = arr.find(v => typeof v !== 'string' && v?.represent) ?? arr[0]
  return typeof first === 'string'
    ? first
    : first?.imageUrl || first?.url || first?.thumbnailUrl || first?.path || ''
}

const rawUrl = computed(() => pickFirstUrl(props.imageUrls))
const imageSrc = ref(sample1)

watchEffect(() => {
  let u = rawUrl.value

  // 상대경로면 BASE 붙여 절대 URL로
  if (u && !/^https?:\/\//i.test(u)) {
    u = IMAGE_BASE ? `${IMAGE_BASE}/${u.replace(/^\/+/, '')}` : u
  }

  // 강제 샘플 or 빈 값 or http(혼합콘텐츠)면 샘플
  imageSrc.value = FORCE_SAMPLE || !u || /^http:\/\//i.test(u) ? sample1 : u
})
function handleImgError(e) {
  if (e?.target) e.target.src = sample1
}

// 금액 단위 포맷 함수
function formatDepositPrice(value) {
  if (!value || value === 0) return '가격 정보 없음'

  const billion = Math.floor(value / 100000000) // 억
  const rest = value % 100000000
  const million = Math.floor(rest / 10000) // 만

  let millionStr = ''

  if (million > 0) {
    const thousand = Math.floor(million / 1000)
    const remain = million % 1000

    if (thousand > 0) {
      millionStr += ` ${thousand}천`
    }

    if (remain > 0) {
      millionStr += ` ${remain}만`
    } else if (thousand === 0) {
      // 1000보다 작고 정확히 떨어질 때만 '만' 붙이기
      millionStr += '만'
    }
  }

  return `${billion > 0 ? `${billion}억 ` : ''}${millionStr}`.trim()
}

function formatMonthlyRent(value) {
  if (!value || value === 0) return '가격 정보 없음'

  const billion = Math.floor(value / 10000) // 억
  const thousand = Math.floor((value % 10000) / 1000) // 천
  const rest = value % 1000 // 나머지 만 단위

  let result = ''
  if (billion > 0) result += `${billion}억 `
  if (thousand > 0) result += ` ${thousand}천`
  if (rest > 0) {
    result += ` ${rest}만`
  } else if (thousand === 0 && billion === 0) {
    result += '만' // 만 단위만 있는 경우
  }

  return result.trim()
}

// 전세 or 월세 형식의 가격 문자열
const formattedPrice = computed(() => {
  if (props.transactionType === 'JEONSE') {
    return `전세 ${formatDepositPrice(props.price)}`
  } else if (props.transactionType === 'MONTHLY_RENT') {
    const depositStr = formatDepositPrice(props.price) // monthlyDeposit
    const rentStr = formatMonthlyRent(props.monthlyRent)
    return `월세 ${depositStr} / ${rentStr}`
  }
  return ''
})

// 외부 값 변경 감지 (필요 시)
watch(
  () => props.isFavorite,
  newVal => {
    localIsFavorite.value = newVal
  },
)

const handleFavoriteToggle = async (propertyId, newFavoriteStatus) => {
  if (newFavoriteStatus) {
    await api.addFavoriteProperty(propertyId)
  } else {
    await api.removeFavoriteProperty(propertyId)
  }

  propertyStore.bumpFavoriteVersion()

  // 즉시 로컬 상태 업데이트
  localIsFavorite.value = newFavoriteStatus
  propertyStore.favoriteVersion++

  // store에서 다시 불러오는 건 필요 시만
  // await property.fetchPropertyDetails(propertyId)
}

//
function goToDetail() {
  console.log('[goToDetail] propertyId:', props.propertyId)

  router.push({ name: 'propertyDetails', params: { id: props.propertyId } })
}
</script>

<template>
  <SafePropertyModal
    v-model="modalVisible"
    :property-id="propertyId"
    @cta="router.push({ name: 'DepositInput' })"
  />
  <div class="property-card" @click="goToDetail()">
    <div class="image-wrapper">
      <template v-if="imageSrc">
        <img
          :src="imageSrc"
          alt="매물 이미지"
          class="property-thumbnail"
          loading="lazy"
          @error="handleImgError"
        />
      </template>
      <template v-else>
        <div class="property-image-placeholder">이미지 없음</div>
      </template>

      <!-- 안심 매물 뱃지 -->
      <div class="property-card-badge">
        <button
          type="button"
          class="badge-btn"
          @click.stop="modalVisible = true"
          aria-label="안심매물 리포트 열기"
        >
          <img
            v-if="isSafe"
            :src="badge"
            alt="안심매물 뱃지"
            class="badge-img"
          />
        </button>
      </div>
    </div>

    <div class="details">
      <div class="title">{{ title }} {{ detailAddress }}</div>
      <div class="price">{{ formattedPrice }}</div>

      <div class="info">
        {{ propertyType }} · {{ supplyArea }}/{{ exclusiveArea }}m² ·
        {{ floor }}층 / {{ totalFloors }}층 ·
        {{ direction }}
      </div>
      <div class="address">{{ address }}</div>
    </div>
    <!-- 관심 하트 버튼 -->
    <div class="card-favorite-btn" @click.stop>
      <FavoriteButton
        :width="16"
        :height="16"
        :isFavorite="localIsFavorite"
        :propertyId="propertyId"
        @toggle-favorite="handleFavoriteToggle"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.property-card {
  display: flex;
  padding: 16px 0;
  border-top: 1px solid var(--whitish);
  border-bottom: 1px solid var(--whitish);
  cursor: pointer;
}
.image-wrapper {
  position: relative;
  width: 90px;
  height: 90px;
  background-color: #ddd;
  font-size: 13px;
  flex-shrink: 0;
  border-radius: 8px;
  overflow: visible;
}
.property-thumbnail {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #555;
  border-radius: 8px;
}
.property-image-placeholder {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 0.8rem;
  color: var(--whitish);
  text-align: center;
}
.property-card-badge .badge-btn {
  background: transparent;
  border: 0;
  padding: 0;
  position: absolute;
  top: 6px;
  left: 2px;
  transform: translate(-50%, -50%);
  z-index: 2;
  width: 50px;
  height: auto;
  display: block;
}

.badge-img {
  width: 100%;
  height: auto;
  display: block;
}

.details {
  margin-left: 12px;
  flex: 1;
}
.price {
  font-size: 19px;
  font-weight: 700;
  margin-bottom: 4px;
}
.title {
  font-size: 13px;
  color: #333;
  margin-bottom: 2px;
}
.info {
  font-size: 13px;
  color: #666;
  margin-bottom: 2px;
}
.address {
  font-size: 12px;
  color: #999;
}

.card-favorite-btn {
  margin-right: 0.5rem;
  cursor: pointer;
}
</style>
