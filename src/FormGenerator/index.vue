<template>
  <div class="form-generator-container" :class="[data.type]">
    <div v-if="showLeft" class="left-board">
      <el-scrollbar class="left-scrollbar">
        <div class="components-list">
          <div v-for="(item, listIndex) in leftComponents" :key="listIndex">
            <div class="components-title">
              <svg-icon icon-class="component" />
              {{ item.title }}
            </div>
            <draggable
              class="components-draggable"
              :list="item.list"
              :disabled="isMaxComponentsCount"
              :group="{ name: 'componentsGroup', pull: 'clone', put: false, revertClone: true }"
              :clone="cloneComponent"
              draggable=".components-item"
              :sort="false"
              @end="onEnd"
            >
              <div
                v-for="(element, index) in item.list"
                :key="index"
                class="components-item"
                @click="addComponent(element)"
              >
                <div class="components-body">
                  <!--                  <svg-icon :icon-class="element.__config__.tagIcon" />-->
                  {{ element.__config__.label }}
                </div>
              </div>
            </draggable>
          </div>
        </div>
      </el-scrollbar>
    </div>

    <div class="center-board">
      <el-scrollbar class="center-scrollbar">
        <div class="center-board-row" :class="{ pt24: !formConfFlag }">
          <div class="form-info" v-show="drawingList.length > 0" :class="{ mb32: formConf.formLogoUrl || formConf.formName || formConf.formRemark }">
            <img v-if="formConf.formLogoUrl && formConf.formLogoSwitch" class="form-logo" :src="config.fileBaseUrl + formConf.formLogoUrl">
            <div v-if="formConf.formName" class="form-name mt24 pl16 pr16">{{ formConf.formName }}</div>
            <div v-if="formConf.formRemark && formConf.formRemarkSwitch" class="form-remark mt24 pl16 pr16">{{ formConf.formRemark }}</div>
          </div>
          <el-form
            :class="{ h100: !drawingList.length }"
            :size="formConf.size"
            :label-position="formConf.labelPosition"
            :disabled="formConf.disabled"
            :label-width="formConf.labelWidth + 'px'"
          >
            <draggable class="drawing-board" draggable=".draggable" :list="drawingList" :animation="340" :disabled="data.type === 'preview'" group="componentsGroup">
              <draggable-item
                v-for="(item, index) in drawingList"
                :key="item.renderKey"
                :drawing-list="drawingList"
                :current-item="item"
                :index="index"
                :active-id="activeId"
                :form-conf="formConf"
                :class="{ 'un-delete': item.unDelete }"
                @activeItem="activeFormItem"
                @copyItem="drawingItemCopy"
                @deleteItem="drawingItemDelete"
              />
            </draggable>
            <div v-show="!drawingList.length" class="empty-info">
              ????????????????????????????????????????????????
            </div>
          </el-form>
          <el-button
            v-if="drawingList && drawingList.length > 0"
            :disabled="data.type === 'preview'"
            class="form-btn mt24 mb24 ml16"
            type="success"
            size="small"
          >{{ formConf.submitBtnText }}</el-button>
        </div>
      </el-scrollbar>
    </div>

    <right-panel
      v-if="showRight"
      :active-data="activeData"
      :form-conf="formConf"
      :show-field="!!drawingList.length"
      :config="config"
      @tag-change="tagChange"
      @fetch-data="fetchData"
      v-on="$listeners"
    >
      <!-- rule: ???????????? -->
      <template #rule="ruleProps">
        <slot name="rule" :activeData="ruleProps.activeData" />
      </template>
      <!-- attr: ???????????? -->
      <template #attr="arrtProps">
        <slot name="attr" :activeData="arrtProps.activeData" />
      </template>
      <!-- tag??????????????? -->
      <template #tag="tagProps">
        <slot name="tag" :activeData="tagProps.activeData" />
      </template>
    </right-panel>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import { debounce } from 'throttle-debounce'
import render from './components/render/render'
import RightPanel from './RightPanel'
import {
  inputComponents, selectComponents, formConf
} from './components/generator/config'
import {
  titleCase, deepClone, isObjectObject
} from './utils/index'
import DraggableItem from './DraggableItem'
import { getIdGlobal, saveIdGlobal } from './utils/db'
// ???????????????????????????????????????????????????
// import Vue from 'vue'
// import axios from 'axios'
// Vue.prototype.$axios = axios

let oldActiveId
let tempActiveData
const idGlobal = getIdGlobal()
// ????????????????????????
const MAX_COMPONENTS_COUNT = 50

export default {
  components: {
    draggable,
    render,
    RightPanel,
    DraggableItem
  },
  props: {
    data: {
      type: Object,
      default: () => {}
    },
    config: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      baseUrl: process.env.NODE_ENV === 'development' ? process.env.VUE_APP_MEDIA_BASE_URL : window.config.MEDIA_URL,
      idGlobal,
      formConf,
      inputComponents,
      selectComponents,
      labelWidth: 100,
      drawingList: [],
      drawingData: {},
      activeId: '',
      drawerVisible: false,
      formData: {},
      dialogVisible: false,
      jsonDrawerVisible: false,
      generateConf: null,
      showFileName: false,
      activeData: {
        '__config__': { label: '' }
      },
      saveIdGlobalDebounce: debounce(340, saveIdGlobal),
      leftComponents: [
        {
          title: '??????',
          list: inputComponents
        },
        {
          title: '??????',
          list: selectComponents
        }
      ]
    }
  },
  computed: {
    formConfFlag() {
      return this.formConf.formLogoUrl || this.formConf.formName || this.formConf.formRemark
    },
    showLeft() {
      return this.data.type !== 'preview'
    },
    showRight() {
      return this.data.type !== 'preview' && this.drawingList?.length
    },
    isMaxComponentsCount() {
      // ????????????50???
      return Array.isArray(this.drawingList) && this.drawingList?.length >= MAX_COMPONENTS_COUNT
    }
  },
  watch: {
    // eslint-disable-next-line func-names
    'activeData.__config__.label': function(val, oldVal) {
      if (
        this.activeData.placeholder === undefined ||
        !this.activeData.__config__.tag ||
        oldActiveId !== this.activeId
      ) {
        return
      }
      this.activeData.placeholder = this.activeData.placeholder.replace(oldVal, '') + val
    },
    activeId: {
      handler(val) {
        oldActiveId = val
      },
      immediate: true
    },
    idGlobal: {
      handler(val) {
        this.saveIdGlobalDebounce(val)
      },
      immediate: true
    },
    data: {
      handler(val) {
        if (val && Object.keys(val).length > 0) {
          const fields = deepClone(val)?.fields
          if (fields) {
            this.drawingList = fields
            this.activeFormItem(this.drawingList[0])
          }
          delete val.fields
          this.formConf = {
            ...this.formConf,
            ...val
          }
        }
      },
      immediate: true
    }
  },
  created() {},
  mounted() {
  },
  methods: {
    // addAttr() {
    //   // eslint-disable-next-line vue/no-mutating-props
    //   this.activeData.__config__.attrList.push(-1)
    // },
    // handleDelSttr(index) {
    //   // eslint-disable-next-line vue/no-mutating-props
    //   this.activeData.__config__.attrList.splice(index, 1)
    // },
    showMaxComponentsCountTip() {
      this.$showNotify({
        type: 'warning',
        content: '????????????50????????????'
      })
    },
    setObjectValueReduce(obj, strKeys, data) {
      const arr = strKeys.split('.')
      arr.reduce((pre, item, i) => {
        if (arr.length === i + 1) {
          pre[item] = data
        } else if (!isObjectObject(pre[item])) {
          pre[item] = {}
        }
        return pre[item]
      }, obj)
    },
    setRespData(component, resp) {
      const { dataPath, renderKey, dataConsumer } = component.__config__
      if (!dataPath || !dataConsumer) return
      const respData = dataPath.split('.').reduce((pre, item) => pre[item], resp)

      // ???????????????????????????????????????????????????
      // ???el-tabel???????????????Element?????????????????????????????????el-tabel???data???????????????dataConsumer????????????'data';
      // ??????????????????????????? component[dataConsumer] = respData???
      // ??????????????????????????????????????????dataConsumer?????????'options.data'???,??????setObjectValueReduce
      this.setObjectValueReduce(component, dataConsumer, respData)
      const i = this.drawingList.findIndex(item => item.__config__.renderKey === renderKey)
      if (i > -1) this.$set(this.drawingList, i, component)
    },
    fetchData(component) {
      // const { dataType, method, url } = component.__config__
      // if (dataType === 'dynamic' && method && url) {
      //   this.setLoading(component, true)
      //   this.$axios({
      //     method,
      //     url
      //   }).then(resp => {
      //     this.setLoading(component, false)
      //     this.setRespData(component, resp.data)
      //   })
      // }
    },
    setLoading(component, val) {
      const { directives } = component
      if (Array.isArray(directives)) {
        const t = directives.find(d => d.name === 'loading')
        if (t) t.value = val
      }
    },
    activeFormItem(currentItem) {
      this.activeData = currentItem
      this.activeId = this.data.type === 'preview' ? -1 : currentItem.__config__.formId
    },
    onEnd(obj) {
      if (obj.from !== obj.to) {
        this.fetchData(tempActiveData)
        this.activeData = tempActiveData
        this.activeId = this.idGlobal
      }
    },
    // ????????????
    addComponent(item) {
      if (this.isMaxComponentsCount) {
        this.showMaxComponentsCountTip()
        return
      }
      // ?????????config
      const clone = this.cloneComponent(item)
      //
      this.fetchData(clone)
      this.drawingList.push(clone)
      this.activeFormItem(clone)
    },
    cloneComponent(origin) {
      // ???????????????
      const clone = deepClone(origin)
      const config = clone.__config__
      config.span = this.formConf.span // ???????????????????????????span???????????????
      this.createIdAndKey(clone)
      clone.placeholder !== undefined && (clone.placeholder += config.label)
      tempActiveData = clone
      return tempActiveData
    },
    createIdAndKey(item) {
      const config = item.__config__
      config.formId = ++this.idGlobal
      config.renderKey = `${config.formId}${+new Date()}` // ??????renderKey?????????????????????????????????
      if (config.layout === 'colFormItem') {
        item.__vModel__ = `field${config.renderKey}`
      } else if (config.layout === 'rowFormItem') {
        config.componentName = `row${this.idGlobal}`
        !Array.isArray(config.children) && (config.children = [])
        delete config.label // rowFormItem????????????label??????
      }
      if (Array.isArray(config.children)) {
        config.children = config.children.map(childItem => this.createIdAndKey(childItem))
      }
      return item
    },
    AssembleFormData() {
      this.formData = {
        fields: deepClone(this.drawingList),
        ...this.formConf
      }
    },
    generate(data) {
      const func = this[`exec${titleCase(this.operationType)}`]
      this.generateConf = data
      func && func(data)
    },
    empty() {
      this.$confirm('?????????????????????????????????', '??????', { type: 'warning' }).then(
        () => {
          this.drawingList = []
          this.idGlobal = 100
        }
      )
    },
    drawingItemCopy(item, list) {
      if (this.isMaxComponentsCount) {
        this.showMaxComponentsCountTip()
        return
      }
      let clone = deepClone(item)
      // ?????????????????????
      clone.unDelete = false
      clone = this.createIdAndKey(clone)
      list.push(clone)
      this.activeFormItem(clone)
    },
    drawingItemDelete(index, list) {
      list.splice(index, 1)
      this.$nextTick(() => {
        const len = this.drawingList.length
        if (len) {
          this.activeFormItem(this.drawingList[len - 1])
        }
      })
    },
    tagChange(newTag) {
      newTag = this.cloneComponent(newTag)
      const config = newTag.__config__
      newTag.__vModel__ = this.activeData.__vModel__
      config.formId = this.activeId
      config.span = this.activeData.__config__.span
      this.activeData.__config__.tag = config.tag
      this.activeData.__config__.tagIcon = config.tagIcon
      this.activeData.__config__.document = config.document
      if (typeof this.activeData.__config__.defaultValue === typeof config.defaultValue) {
        config.defaultValue = this.activeData.__config__.defaultValue
      }
      Object.keys(newTag).forEach(key => {
        if (this.activeData[key] !== undefined) {
          newTag[key] = this.activeData[key]
        }
      })
      this.activeData = newTag
      this.updateDrawingList(newTag, this.drawingList)
    },
    updateDrawingList(newTag, list) {
      const index = list.findIndex(item => item.__config__.formId === this.activeId)
      if (index > -1) {
        list.splice(index, 1, newTag)
      } else {
        list.forEach(item => {
          if (Array.isArray(item.__config__.children)) this.updateDrawingList(newTag, item.__config__.children)
        })
      }
    },
    getParams() {
      this.AssembleFormData()
      const params = { ...this.formData }
      if (!params.formLogoSwitch) {
        params['formLogoUrl'] = ''
      }
      if (!params.formRemarkSwitch) {
        params['formRemark'] = ''
      }
      return this.formatFormConf(params)
    },
    // ?????? ?????????
    formatFormConf(formConf) {
      // ??????defaultValue
      let tempFormConf = null
      if (formConf) {
        tempFormConf = {
          ...formConf,
          fields: formConf?.fields?.map(field => {
            return {
              ...field,
              __config__: {
                ...field.__config__,
                defaultValue: Array.isArray(field.__config__.defaultValue) ? [] : ''
              }
            }
          })
        }
      }
      return tempFormConf
    },
  }
}
</script>

<style lang='scss'>
@import './styles/home';
</style>
<style lang="scss" scoped>
.form-generator-container {
  /deep/.center-board {
    .drawing-board {
      .un-delete {
        .drawing-item-copy {
          right: 24px;
        }
        .drawing-item-delete {
          display: none;
        }
      }
    }
  }
  /deep/.el-input {
    .el-input__inner {
      height: 32px !important;
      line-height: 32px !important;
    }
    .el-input__icon {
      line-height: 32px;
    }
  }
}
.w375 {
  width: 375px;
}
.h100 {
  height: 100%;
}
.left-scrollbar {
  height: calc(100vh - 120px);
  overflow-y: auto;
}
/deep/.center-scrollbar {
  background-color: #DBDEE4;
  height: 100%;
  .el-scrollbar__wrap {
    display: flex;
    align-items: center;
    .el-scrollbar__view {
      height: 100%;
      overflow-y: auto;
      overflow-x: hidden;
      background-color: #FFFFFF;
      &::-webkit-scrollbar {
        width: 0;
      }
    }
  }
  .center-board-row {
    height: 100%;
    .el-form {
      padding: 0 12px;
      position: relative;
    }
  }
  .form-info {
    .form-logo {
      width: 100%;
      object-fit: cover;
      border-radius: 4px;
    }
    .form-name {
      text-align: center;
      font-size: 18px;
      font-weight: bold;
      color: #26292e;
    }
    .form-remark {
      // text-align: center;
      word-break: break-all;
      white-space: pre-wrap;
      font-size: 14px;
      color: #545860;
    }
  }
  .form-btn {
    width: 342px;
  }
}
</style>
