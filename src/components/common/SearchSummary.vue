<script setup>
import { computed } from 'vue'

const props = defineProps({
  dealType: { type: Array, default: () => [] }, // ['전세'] or ['전세','월세'] or []
  region: {
    type: Object,
    default: () => ({ city: null, district: null, parish: null }),
  },
  onlySecure: { type: Boolean, default: false },
  totalCount: { type: Number, default: 0 },
  loadedCount: { type: Number, default: 0 },
  showLoaded: { type: Boolean, default: true }, // (n / total) 표시 여부
  dense: { type: Boolean, default: false }, // 여백 줄이기 옵션
})

const emit = defineEmits(['clear'])

// 문자열 대신 메타 정보 포함한 칩 객체로 구성
const chips = computed(() => {
  const list = []

  // 거래유형 칩들
  if (props.dealType?.length) {
    for (const t of props.dealType) {
      list.push({ type: 'dealType', label: t, payload: { value: t } })
    }
  }

  // 지역 칩들 (city > district > parish 각각 따로 해제 가능)
  if (props.region?.city)
    list.push({
      type: 'region',
      label: props.region.city,
      payload: { level: 'city' },
    })
  if (props.region?.district)
    list.push({
      type: 'region',
      label: props.region.district,
      payload: { level: 'district' },
    })
  if (props.region?.parish)
    list.push({
      type: 'region',
      label: props.region.parish,
      payload: { level: 'parish' },
    })

  // 안심매물 칩
  if (props.onlySecure)
    list.push({ type: 'onlySecure', label: '안심매물', payload: {} })

  return list
})
</script>

<template>
  <div class="search-summary" :class="{ dense: props.dense }">
    <div class="applied-title">현재 적용 중인 옵션</div>
    <div class="chips">
      <button
        v-for="chip in chips"
        :key="`${chip.type}:${chip.label}`"
        class="chip"
        type="button"
        @click="emit('clear', chip)"
        :aria-label="`${chip.label} 필터 해제`"
        title="이 필터 해제"
      >
        {{ chip.label }}
      </button>

      <span v-if="!chips.length" class="chip empty">없음</span>
    </div>

    <div class="summary-divider" />

    <div class="total">
      <span>총 {{ (totalCount ?? 0).toLocaleString() }}개</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.search-summary {
  margin: 10px 0 16px 0;
}
.applied-title {
  font-size: 12px;
  color: #9aa0a6;
  margin-bottom: 8px;
}
.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
}
.chip {
  padding: 6px 10px;
  border-radius: 999px;
  background: rgba(66, 133, 244, 0.18);
  color: #1a73e8;
  font-weight: 600;
  font-size: 13px;
  border: none;
  cursor: pointer;
}
.chip:hover {
  background: rgba(66, 133, 244, 0.28);
}
.chip.empty {
  background: #f1f3f4;
  color: #5f6368;
  font-weight: 500;
  cursor: default;
}
.summary-divider {
  height: 1px;
  background: #eaecef;
  margin: 8px 0 10px;
}
.total {
  font-size: 14px;
  color: var(--grey);
}

.dense {
  margin: 6px 0 10px 0;
}
</style>
