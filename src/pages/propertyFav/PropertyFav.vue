<script setup>
import { ref, onMounted, computed } from 'vue'
import { usePropertyStore } from '@/stores/property'
import PropertyCard from '@/components/cards/PropertyCard.vue'
import RegionFilter from '@/components/filters/RegionFilter.vue'
import ChecklistFilter from '@/components/filters/ChecklistFilter.vue'

const store = usePropertyStore()

const showRegion = ref(false)
const showChecklist = ref(false)

const filteredList = computed(() => store.filteredWishList)

const applyRegion = (region) => {
  store.setRegion(region)
  showRegion.value = false
}

const applyChecklist = (list) => {
  store.setChecklist(list)
  showChecklist.value = false
}
const remove = (id) => {
  store.removeFromWish(id)
}
onMounted(() => {
  store.fetchFavoriteProperties()
})
</script>

<template>
  <!-- slot 스타일 테스트용이라 필요에 따라 마크업이랑 스타일 수정하시면 됩니다. -->
    <div class="PropertyFav">
    <h2 class="title">찜하신 관심매물이에요</h2>

    <!-- 필터 버튼 -->
    <div class="filters">
      <button @click="showRegion = true">지역별</button>
      <button @click="showChecklist = true">체크리스트</button>
    </div>

     <RegionFilter v-if="showRegion" @close="showRegion = false" @apply="applyRegion" />
    <ChecklistFilter v-if="showChecklist" @close="showChecklist = false" @apply="applyChecklist" />

    <!-- 관심 매물 리스트 -->
    <div v-if="filteredList.length > 0" class="property-list">
      <PropertyCard
        v-for="property in filteredList"
        :key="property.id"
        :property="property"
        @unwish="remove(property.id)"
      />
    </div>
    <p v-else class="empty-message">관심 매물이 없습니다.</p>
  </div>
</template>

<style scoped lang="scss">
.PropertyFav {
  width: 100%;
  padding: 4rem 2rem;
}

.test-box {
  height: 1400px;
}
</style>
