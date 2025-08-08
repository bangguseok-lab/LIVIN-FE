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

const chips = computed(() => {
  const list = []
  if (props.dealType?.length) list.push(...props.dealType) // 전세/월세 모두 표시
  if (props.region?.city) list.push(props.region.city)
  if (props.region?.district) list.push(props.region.district)
  if (props.region?.parish) list.push(props.region.parish)
  if (props.onlySecure) list.push('안심매물')
  return list
})
</script>

<template>
  <div class="search-summary" :class="{ dense }">
    <div class="applied-title">현재 적용 중인 옵션</div>
    <div class="chips">
      <span v-for="(c, i) in chips" :key="i" class="chip">{{ c }}</span>
      <span v-if="!chips.length" class="chip empty">없음</span>
    </div>

    <div class="divider" />

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
}
.chip.empty {
  background: #f1f3f4;
  color: #5f6368;
  font-weight: 500;
}
.divider {
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
