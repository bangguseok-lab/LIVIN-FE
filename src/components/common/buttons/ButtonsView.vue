<script setup>
import { ref } from 'vue'
import Buttons from './Buttons.vue'

// 각 버튼의 상태를 관리하는 반응형 변수들
const defaultBtn = ref(true)
const mdCompleteBtn = ref(true)
const mdResetBtn = ref(false)
const smOption1Btn = ref(true)
const smOption2Btn = ref(true)
const smOption3Btn = ref(false)
const smOption4Btn = ref(false)
const xsBtn1 = ref(true)
const xsBtn2 = ref(false)
const xsBtn3 = ref(true)
const xsBtn4 = ref(false)
const okBtn = ref(false)
const goBtn1 = ref(false)
const goBtn2 = ref(true)
const propertyBtn1 = ref(true)
const propertyBtn2 = ref(false)
const roleBtn1 = ref(true)
const roleBtn2 = ref(false)
const optionBtn1 = ref(true)
const optionBtn2 = ref(false)
const directionBtn1 = ref(true)
const directionBtn2 = ref(false)
const dateBtn1 = ref(false)
const photoBtn1 = ref(true)
const floorBtn1 = ref(true)
const myBtn1 = ref(true)
const myBtn2 = ref(true)
</script>

<template>
  <div class="ButtonsView">
    <h1>버튼 모음</h1>
    <br />
    <p>피그마 순서대로 작성</p>
    <p>type을 작성할 때는 btn- 을 제외하고 작성하시면 됩니다.</p>
    <div class="box-contaier">
      <div class="btn-left-side">
        <div class="btn-box">
          <p>btn-xl</p>
          <Buttons type="xl" togo="/checklist" class="xl">
            <div class="top-text">
              나만의 공간을 위한 모든 준비, 지금 여기서 시작하세요
            </div>
            <div class="bottom-text">나만의 체크리스트 만들기</div>
          </Buttons>
        </div>
        <div class="btn-box">
          <p>btn-default (상태: {{ defaultBtn ? '활성' : '비활성' }})</p>
          <Buttons
            label="완료"
            v-model:is-active="defaultBtn"
            type="default"
            class="default"
          />
        </div>
        <div class="btn-md-box">
          <div class="btn-box">
            <p>btn-md (상태: {{ mdCompleteBtn ? '활성' : '비활성' }})</p>
            <Buttons
              class="md"
              label="완료"
              v-model:is-checked="mdCompleteBtn"
              type="md"
            />
          </div>
          <div class="btn-box">
            <p>btn-md (상태: {{ mdResetBtn ? '활성' : '비활성' }})</p>
            <Buttons
              class="md"
              label="초기화"
              v-model:is-checked="mdResetBtn"
              type="md"
            />
          </div>
        </div>
        <div class="btn-sm-box">
          <div class="btn-box">
            <p>btn-sm (상태: {{ smOption1Btn ? '활성' : '비활성' }})</p>
            <Buttons class="sm" type="sm" v-model:is-checked="smOption1Btn">
              <div class="option-text">강한 수압</div>
            </Buttons>
          </div>
          <div class="btn-box">
            <p>btn-sm (상태: {{ smOption2Btn ? '활성' : '비활성' }})</p>
            <Buttons class="sm" type="sm" v-model:is-checked="smOption2Btn">
              <div class="option-text">채광</div>
            </Buttons>
          </div>
          <div class="btn-box">
            <p>btn-sm (상태: {{ smOption3Btn ? '활성' : '비활성' }})</p>
            <Buttons type="sm" v-model:is-checked="smOption3Btn">
              <div class="option-text">누수 없는 방</div>
            </Buttons>
          </div>
          <div class="btn-box">
            <p>btn-sm (상태: {{ smOption4Btn ? '활성' : '비활성' }})</p>
            <Buttons class="sm" type="sm" v-model:is-checked="smOption4Btn">
              <div class="option-text">쿠팡 새벽배송 쿠팡 새벽배송송송송</div>
            </Buttons>
          </div>
        </div>
        <div class="btn-xs-box">
          <div class="btn-box">
            <p>btn-xs (상태: {{ xsBtn1 ? '활성' : '비활성' }})</p>
            <Buttons
              class="xs"
              label="수도료"
              v-model:is-checked="xsBtn1"
              type="xs"
            />
          </div>
          <div class="btn-box">
            <p>btn-xs (상태: {{ xsBtn2 ? '활성' : '비활성' }})</p>
            <Buttons
              class="xs"
              label="전기료"
              v-model:is-checked="xsBtn2"
              type="xs"
            />
          </div>
          <div class="btn-box">
            <p>btn-xs (상태: {{ xsBtn3 ? '활성' : '비활성' }})</p>
            <Buttons
              class="xs"
              label="인터넷비"
              v-model:is-checked="xsBtn3"
              type="xs"
            />
          </div>
          <div class="btn-box">
            <p>btn-xs (상태: {{ xsBtn4 ? '활성' : '비활성' }})</p>
            <Buttons
              class="xs"
              label="승강기 유지비"
              v-model:is-checked="xsBtn4"
              type="xs"
            />
          </div>
        </div>
        <div class="btn-ok-box">
          <div class="btn-box">
            <p>btn-ok (상태: {{ okBtn ? '활성' : '비활성' }})</p>
            <Buttons
              class="ok"
              label="확인"
              v-model:is-checked="okBtn"
              type="ok"
            />
          </div>
        </div>
      </div>

      <div class="btn-right-side">
        <div class="btn-go-box">
          <div class="btn-box">
            <p>btn-go (상태: {{ goBtn1 ? '활성' : '비활성' }})</p>
            <Buttons
              class="go"
              v-model:is-checked="goBtn1"
              type="go"
              label="적용된 매물 보러가기"
              :icon-type="goBtn1 ? 'white' : 'blue'"
            />
          </div>
          <div class="btn-box">
            <p>btn-go (상태: {{ goBtn2 ? '활성' : '비활성' }})</p>
            <Buttons
              class="go"
              v-model:is-checked="goBtn2"
              type="go"
              label="체크리스트 확인하기"
              :icon-type="goBtn2 ? 'white' : 'blue'"
            />
          </div>
        </div>
        <div class="btn-property-box">
          <div class="btn-box">
            <p>btn-property (상태: {{ propertyBtn1 ? '활성' : '비활성' }})</p>
            <Buttons
              class="property"
              v-model:is-checked="propertyBtn1"
              type="property"
              label="일반 매물"
            />
          </div>
          <div class="btn-box">
            <p>btn-property (상태: {{ propertyBtn2 ? '활성' : '비활성' }})</p>
            <Buttons
              class="property"
              v-model:is-checked="propertyBtn2"
              type="property"
              label="관심 매물"
            />
          </div>
        </div>
        <div class="btn-role-box">
          <div class="btn-box">
            <p>btn-role (상태: {{ roleBtn1 ? '활성' : '비활성' }})</p>
            <Buttons class="role" v-model:is-checked="roleBtn1" type="role">
              <div class="role-text">임차인</div>
              <div class="role-description-text">집을 구해요</div>
            </Buttons>
          </div>
          <div class="btn-box">
            <p>btn-role (상태: {{ roleBtn2 ? '활성' : '비활성' }})</p>
            <Buttons class="role" v-model:is-checked="roleBtn2" type="role">
              <div class="role-text">임대인</div>
              <div class="role-description-text">집을 빌려줘요</div>
            </Buttons>
          </div>
        </div>
        <div class="btn-option-box">
          <div class="btn-box">
            <p>btn-option (상태: {{ optionBtn1 ? '활성' : '비활성' }})</p>
            <Buttons
              class="option"
              v-model:is-checked="optionBtn1"
              type="option"
              label="에어컨"
            />
          </div>
          <div class="btn-box">
            <p>btn-option (상태: {{ optionBtn2 ? '활성' : '비활성' }})</p>
            <Buttons
              class="option"
              v-model:is-checked="optionBtn2"
              type="option"
              label="세탁기"
            />
          </div>
        </div>
        <div class="btn-date-box">
          <div class="btn-box">
            <p>btn-date (상태: {{ dateBtn1 ? '활성' : '비활성' }})</p>
            <Buttons
              class="date"
              v-model:is-checked="dateBtn1"
              type="date"
              label="즉시 입주 가능합니다"
            />
          </div>
        </div>
        <div class="btn-photo-box">
          <div class="btn-box">
            <p>btn-photo (상태: {{ photoBtn1 ? '활성' : '비활성' }})</p>
            <Buttons
              class="photo"
              v-model:is-checked="photoBtn1"
              type="photo"
              label="+ 사진 추가하기"
            />
          </div>
        </div>
        <div class="btn-direction-box">
          <div class="btn-box">
            <p>btn-direction (상태: {{ directionBtn1 ? '활성' : '비활성' }})</p>
            <Buttons
              class="direction"
              v-model:is-checked="directionBtn1"
              type="direction"
              label="남향"
            />
          </div>
          <div class="btn-box">
            <p>btn-direction (상태: {{ directionBtn2 ? '활성' : '비활성' }})</p>
            <Buttons
              class="direction"
              v-model:is-checked="directionBtn2"
              type="direction"
              label="동향"
            />
          </div>
        </div>
        <div class="btn-floor-box">
          <div class="btn-box">
            <p>btn-floor (상태: {{ floorBtn1 ? '활성' : '비활성' }})</p>
            <Buttons
              v-model:is-checked="floorBtn1"
              type="floor"
              label="복층입니다"
            />
          </div>
        </div>
        <div class="btn-my-option-box">
          <div class="btn-box">
            <p>btn-my-option (상태: {{ myBtn1 ? '활성' : '비활성' }})</p>
            <Buttons
              class="my-option"
              v-model:is-checked="myBtn1"
              type="my-option"
              label="쿠팡 새벽배송"
            />
          </div>
          <div class="btn-box">
            <p>btn-my-option (상태: {{ myBtn2 ? '활성' : '비활성' }})</p>
            <Buttons
              class="my-option"
              v-model:is-checked="myBtn2"
              type="my-option"
              label="버스정류장 가까움"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.ButtonsView {
  width: 100%;
  padding: 2rem;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.box-contaier {
  display: flex;
  width: 100%;
  justify-content: space-around;
}

/* .btn-left-side,
.btn-right-side {
  display: flex;
  flex-direction: column;
} */

.btn-box {
  margin: 1rem;
}

.btn-md-box {
  display: flex;
  width: 80%;
  justify-content: space-between;
}

.btn-sm-box,
.btn-xs-box {
  display: flex;
  width: 60%;
  justify-content: space-between;
  /* 여러 줄 허용 */
  flex-wrap: wrap;
}

.btn-ok-box,
.btn-go-box,
.btn-property-box,
.btn-role-box,
.btn-direction-box {
  display: flex;
  width: 100%;
  justify-content: space-between;
}

.btn-photo-box,
.btn-floor-box,
.btn-option-box {
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: space-between;
}

.default {
  width: rem(294px);
  height: rem(42px);
}

.xl {
  width: rem(358px);
  height: rem(108px);
}

.md {
  width: rem(130px);
  height: rem(42px);
}

.sm {
  width: fit-content;
}
</style>
