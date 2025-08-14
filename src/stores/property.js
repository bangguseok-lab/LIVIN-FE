import { defineStore } from 'pinia'
import api from '@/api/property'

export const usePropertyStore = defineStore('property', {
  state: () => ({
    favoriteProperties: [],
    properties: [],
    propertyDetails: {},
    favLoading: false,
    lastFavParams: null,
    favoriteVersion: 0,

    // 매물 등록용 state 추가 (지우면 안 됩니다! 매물 등록 시 사용 됩니다.)
    newProperty: {
      postcode: '', // 우편번호
      address: '', // 주소
      detailAddress: '', // 상세주소 (몇 동 몇 호인지)
      extraAddress: '', // 참고 주소 (아파트 이름 등)
      propertyNum: '', // 부동산 고유번호
      propertyType: '', // 거래유형
      propertyDeposit: '', // 보증금 금액
      direction: '', // 주실 방향
      selectOptions: [], // 옵션들 (옵션 id 번호로 가지고 있음)
      moveDate: Date, // 이사 가능 날짜
      imageFiles: '', // 업로드 사진들
      imgRepresentList: '', // 대표이미지 지정을 위한 리스트
      selectedIndex: '', // 대표이미지로 선택된 이미지 인덱스
    },
  }),
  actions: {
    bumpFavoriteVersion() {
      this.favoriteVersion++
    },
    async fetchFavoriteProperties(params) {
      this.favLoading = true
      this.lastFavParams = params
      try {
        const res = await api.getFavorite(params)
        this.favoriteProperties = Array.isArray(res)
          ? res
          : Array.isArray(res?.content)
            ? res.content
            : []
      } catch (error) {
        console.error('찜한 매물 데이터를 불러오는 데 실패했습니다:', error)
        this.favoriteProperties = []
      } finally {
        this.favLoading = false
      }
    },
    async fetchProperties(params) {
      try {
        const data = await api.getProperties(params)
        this.properties = data
      } catch (error) {
        console.error('매물 데이터를 불러오는 데 실패했습니다:', error)
      }
    },
    // 매물 등록용 상태 업데이트 액션
    updateNewProperty(key, value) {
      if (key in this.newProperty) {
        this.newProperty[key] = value
      } else {
        console.warn(`${key} 필드는 newProperty에 존재하지 않습니다.`)
      }
    },
    // 매물 등록 API 호출 액션
    async createNewProperty() {
      try {
        const response = await api.postProperty(this.newProperty)
        console.log('매물 등록을 성공했습니다: ', response)
        return response
      } catch (error) {
        console.error('매물 등록을 실패했습니다: ', error)
      }
    },
    // 등록 상태 초기화
    resetNewProperty() {
      this.newProperty = {
        postcode: '', // 우편번호
        address: '', // 주소
        detailAddress: '', // 상세주소 (몇 동 몇 호인지)
        extraAddress: '', // 참고 주소 (아파트 이름 등)
        propertyNum: '', // 부동산 고유번호
        propertyType: '', // 거래유형
        propertyDeposit: '', // 보증금 금액
        direction: '', // 주실 방향
        selectOptions: [], // 선택된 옵션들
        moveDate: Date, // 이사 가능 날짜
        imageFiles: '', // 업로드 사진들
        imgRepresentList: '', // 대표이미지 지정을 위한 리스트
        selectedIndex: '', // 대표이미지로 선택된 이미지 인덱스
      }
    },
    async fetchPropertyDetails(params) {
      try {
        const data = await api.getPropertyDetails(params)
        this.propertyDetails = data
      } catch (error) {
        console.error('매물 상세 데이터를 불러오는 데 실패했습니다:', error)
      }
    },
    clearProperties() {
      this.properties = []
    },
  },
  getters: {
    getFavorite: state => state.favoriteProperties,
    getPropertiesList: state => state.properties,
    getAddress: state => state.address,
    // 등록 중인 매물
    getNewProperty: state => state.newProperty,
    getPropertyDetails: state => state.propertyDetails,
  },
})
