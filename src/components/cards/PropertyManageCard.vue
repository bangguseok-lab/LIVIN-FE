<script setup>
import { computed, defineProps, defineEmits } from 'vue'
import badge from '@/assets/images/landing/SecureBadge.png'
import { useRouter } from 'vue-router'

const router = useRouter()

const props = defineProps({
  propertyId: {
    type: Number,
    required: true,
  },
  transactionType: String, // 'JEONSE' | 'MONTHLY_RENT'
  price: Number, // 전세 보증금 또는 월세 보증금
  monthlyRent: Number, // 월세 금액
  title: String,
  imageUrls: Array,
  propertyType: String,
  detailAddress: String,
  exclusiveArea: String,
  supplyArea: String,
  floor: String,
  totalFloors: String,
  direction: String,
  address: String,
  isSafe: Boolean,
})

const emit = defineEmits(['edit', 'delete'])

import sample1 from '../../assets/images/home/sample-img1.png'

const imageUrl = computed(() => {
  return props.imageUrls?.[0]?.imageUrl || sample1
})

function formatDepositPrice(value) {
  if (!value || value === 0) return '가격 정보 없음'
  const billion = Math.floor(value / 100000000)
  const rest = value % 100000000
  const million = Math.floor(rest / 10000)
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
      millionStr += '만'
    }
  }
  return `${billion > 0 ? `${billion}억 ` : ''}${millionStr}`.trim()
}

function formatMonthlyRent(value) {
  if (!value || value === 0) return ''
  const billion = Math.floor(value / 10000)
  const thousand = Math.floor((value % 10000) / 1000)
  const rest = value % 1000
  let result = ''
  if (billion > 0) result += `${billion}억 `
  if (thousand > 0) result += ` ${thousand}천`
  if (rest > 0) {
    result += ` ${rest}만`
  } else if (thousand === 0 && billion === 0) {
    result += '만'
  }
  return result.trim()
}

const formattedPrice = computed(() => {
  if (props.transactionType === 'JEONSE') {
    return `전세 ${formatDepositPrice(props.price)}`
  } else if (props.transactionType === 'MONTHLY_RENT') {
    const depositStr = formatDepositPrice(props.price)
    const rentStr = formatMonthlyRent(props.monthlyRent)
    return `월세 ${depositStr} / ${rentStr}`
  }
  return ''
})

const handleEditClick = () => {
  emit('edit', props.propertyId)
}

const handleDeleteClick = () => {
  emit('delete', props.propertyId)
}
</script>

<template>
  <div class="property-card">
    <div class="image-wrapper">
      <template v-if="imageUrl">
        <img :src="imageUrl" alt="매물 이미지" class="property-thumbnail" />
      </template>
      <template v-else>
        <div class="property-image-placeholder">이미지 없음</div>
      </template>
      <div class="property-card-badge">
        <img v-if="isSafe" :src="badge" alt="안심매물 뱃지" class="badge-img" />
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

    <div class="card-action-btn" @click.stop>
      <div class="actions">
        <button @click="handleEditClick" class="action-btn edit-btn">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 20H21"
              stroke="#888"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M16.5 3.5C16.8979 3.10217 17.4371 2.87865 18 2.87865C18.5629 2.87865 19.1021 3.10217 19.5 3.5C19.8978 3.89782 20.1213 4.43708 20.1213 5C20.1213 5.56292 19.8978 6.10218 19.5 6.5L9 17L3 18L4 12L14.5 3.5Z"
              stroke="#888"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>
        <button @click="handleDeleteClick" class="action-btn">
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3 6H5H21"
              stroke="#888"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z"
              stroke="#888"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.property-card {
  display: flex;
  padding: 16px 0;
  border-top: 1px solid var(--whitish);
  border-bottom: 1px solid var(--whitish);
  position: relative;
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
.property-card-badge {
  position: absolute;
  top: 6px;
  left: 2px;
  transform: translate(-50%, -50%);
  z-index: 2;
  width: 50px;
  height: auto;
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

.card-action-btn {
  position: absolute;
  top: 10px;
  right: 1px;
  z-index: 10;
}
.actions {
  display: flex;
  gap: 16px;
}
.action-btn {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 0.35rem;
}
.edit-btn {
  margin-top: 0.5rem;
}
</style>
