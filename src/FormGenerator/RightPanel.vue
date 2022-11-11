<!-- eslint-disable vue/no-mutating-props -->
<!-- eslint-disable vue/no-mutating-props -->
<!-- eslint-disable vue/no-mutating-props -->
<template>
  <div class="right-board">
    <el-tabs v-model="currentTab" class="center-tabs">
      <el-tab-pane label="组件属性" name="field" />
      <el-tab-pane label="表单设置" name="form" />
    </el-tabs>
    <div class="field-box">
      <el-scrollbar class="right-scrollbar">
        <!-- 组件属性 -->
        <el-form v-show="currentTab==='field' && showField" size="small" label-width="90px">
          <el-divider>基础设置</el-divider>
          <el-form-item v-if="activeData.__config__.label!==undefined" label="标题">
            <el-input v-model="activeData.__config__.label" placeholder="请输入标题" @input="changeRenderKey" />
          </el-form-item>
          <el-form-item v-if="activeData.placeholder!==undefined" label="占位提示">
            <el-input v-model="activeData.placeholder" placeholder="请输入占位提示" @input="changeRenderKey" />
          </el-form-item>
          <el-form-item v-if="activeData.__config__.required !== undefined" label="是否必填">
            <el-switch v-model="activeData.__config__.required" />
          </el-form-item>
          <el-form-item v-if="activeData.__config__.tag==='el-checkbox-group'" label="至少应选">
            <el-input-number
              :value="activeData.min"
              :min="0"
              placeholder="至少应选"
              @input="$set(activeData, 'min', $event?$event:undefined)"
            />
          </el-form-item>
          <el-form-item v-if="activeData.__config__.tag==='el-checkbox-group'" label="最多可选">
            <el-input-number
              :value="activeData.max"
              :min="0"
              placeholder="最多可选"
              @input="$set(activeData, 'max', $event?$event:undefined)"
            />
          </el-form-item>
          <template v-if="['el-checkbox-group', 'el-radio-group', 'el-select'].indexOf(activeData.__config__.tag) > -1">
            <el-divider>选项</el-divider>
            <draggable
              :list="activeData.__slot__.options"
              :animation="340"
              group="selectItem"
              handle=".option-drag"
            >
              <div v-for="(item, index) in activeData.__slot__.options" :key="index" class="select-item">
                <div class="select-line-icon option-drag">
                  <i class="el-icon-s-operation" />
                </div>
                <el-input v-model="item.label" placeholder="选项名" size="small" />
                <el-input
                  placeholder="选项值"
                  size="small"
                  :value="item.value"
                  @input="setOptionValue(item, $event)"
                />
                <div class="close-btn select-line-icon" @click="activeData.__slot__.options.splice(index, 1)">
                  <i class="el-icon-remove-outline" />
                </div>
              </div>
            </draggable>
            <div class="add-btn pointer" @click="addSelectItem">
              <svg-icon icon-class="analysis-add-event" />
              <span>选项</span>
            </div>
          </template>
          <!-- 添加规则 -->
          <template v-if="Array.isArray(activeData.__config__.regList)">
            <slot name="rule" :activeData="activeData" />
            <!-- <el-divider>规则校验</el-divider>
            <div
              v-for="(item, index) in activeData.__config__.regList"
              :key="index"
              class="reg-item"
            >
              <span class="close-btn" @click="activeData.__config__.regList.splice(index, 1)">
                <i class="el-icon-close" />
              </span>
              <el-form-item label="表达式">
                <el-input v-model="item.pattern" placeholder="请输入正则" />
              </el-form-item>
              <el-form-item label="错误提示" style="margin-bottom:0">
                <el-input v-model="item.message" placeholder="请输入错误提示" />
              </el-form-item>
            </div>
            <div class="add-btn pointer" @click="addReg">
              <svg-icon icon-class="analysis-add-event" />
              <span>规则</span>
            </div> -->
          </template>
          <!-- 数据同步 -->
          <template v-if="Array.isArray(activeData.__config__.attrList)">
            <slot name="attr" :activeData="activeData" />
            <!-- <el-divider>数据同步</el-divider>
            <div
              v-for="(item, index) in activeData.__config__.attrList"
              :key="index"
              class="reg-item"
            >
              <suit-select
                v-model="activeData.__config__.attrList[index]"
                :is-search="true"
                :options="userAttr"
                :options-config="userAttrConfig"
              />
              <span>
                <svg-icon
                  style="font-size:20px;margin-left:10px;cursor:pointer"
                  class="event-handle-delete"
                  icon-class="delete"
                  @click="handleDelSttr(index)"
                />
              </span>
            </div>
            <div class="add-btn pointer" @click="addAttr">
              <svg-icon icon-class="analysis-add-event" />
              <span>数据同步</span>
            </div> -->
          </template>
          <!-- 标签关联 -->
          <template v-if="Array.isArray(activeData.__config__.tagList)">
            <slot name="tag" :activeData="activeData" />
            <!-- <el-divider>标签关联</el-divider>
            <select-tag
              v-model="activeData.__config__.tagList"
              :limit="10"
            /> -->
          </template>
        </el-form>
        <!-- 表单属性 -->
        <el-form v-show="currentTab === 'form'" ref="formRef" size="small" label-width="90px" label-position="top">
          <el-form-item label="头图" class="upload-item">
            <el-switch v-model="formLogoFlag" />
            <template v-if="formLogoFlag">
              <el-upload
                :action="config.fileAction"
                :headers="config.fileHeaders"
                :name="config.fileUploadName"
                list-type="picture-card"
                :show-file-list="false"
                accept="image/png, image/jpeg, image/gif, image/jpg"
                :on-change="beforeImageUpload"
                :on-success="uploadSuccess"
              >
                <div v-if="formConf.formLogoUrl" class="reupload-mask">
                  <img class="avatar" :src="config.fileBaseUrl + formConf.formLogoUrl">
                  <div class="mask-btn" @click.stop="">
                    <span @click="setFormConf('formLogoUrl', '')">删除图片</span>
                  </div>
                </div>
                <div v-else class="add-btn">
                  <i class="el-icon-plus avatar-uploader-icon" />
                  <span>从本地添加图片</span>
                </div>
              </el-upload>
              <div class="upload-tip">（建议上传比例为375*235px，切小于2M图）</div>
            </template>
          </el-form-item>
          <el-form-item label="表单名称">
            <el-input v-model.trim="formConf.formName" placeholder="请输入表单名称" />
          </el-form-item>
          <el-form-item label="表单说明" class="upload-item">
            <el-switch v-model="formRemarkFlag" @change="setFormConf('formRemark', '')" />
            <el-input
              v-if="formRemarkFlag"
              v-model="formConf.formRemark"
              maxlength="500"
              show-word-limit
              type="textarea"
              placeholder="请输入表单说明"
            />
          </el-form-item>
          <el-form-item label="按钮文案">
            <el-input v-model.trim="formConf.submitBtnText" placeholder="请输入按钮文案" />
          </el-form-item>
          <!--          <el-form-item label="表单名">
            <el-input v-model="formConf.formRef" placeholder="请输入表单名（ref）" />
          </el-form-item>
          <el-form-item label="表单模型">
            <el-input v-model="formConf.formModel" placeholder="请输入数据模型" />
          </el-form-item>
          <el-form-item label="校验模型">
            <el-input v-model="formConf.formRules" placeholder="请输入校验模型" />
          </el-form-item>
          <el-form-item label="表单尺寸">
            <el-radio-group v-model="formConf.size">
              <el-radio-button label="medium">
                中等
              </el-radio-button>
              <el-radio-button label="small">
                较小
              </el-radio-button>
              <el-radio-button label="mini">
                迷你
              </el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="标签对齐">
            <el-radio-group v-model="formConf.labelPosition">
              <el-radio-button label="left">
                左对齐
              </el-radio-button>
              <el-radio-button label="right">
                右对齐
              </el-radio-button>
              <el-radio-button label="top">
                顶部对齐
              </el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="标签宽度">
            <el-input v-model.number="formConf.labelWidth" type="number" placeholder="请输入标签宽度" />
          </el-form-item>
          <el-form-item label="栅格间隔">
            <el-input-number v-model="formConf.gutter" :min="0" placeholder="栅格间隔" />
          </el-form-item>
          <el-form-item label="禁用表单">
            <el-switch v-model="formConf.disabled" />
          </el-form-item>
          <el-form-item label="表单按钮">
            <el-switch v-model="formConf.formBtns" />
          </el-form-item>
          <el-form-item label="显示未选中组件边框">
            <el-switch v-model="formConf.unFocusedComponentBorder" />
          </el-form-item>-->
        </el-form>
      </el-scrollbar>
    </div>

    <treeNode-dialog :visible.sync="dialogVisible" title="添加选项" @commit="addNode" />
    <icons-dialog :visible.sync="iconsVisible" :current="activeData[currentIconModel]" @select="setIcon" />
  </div>
</template>

<script>
import { isArray } from 'util'
import TreeNodeDialog from './TreeNodeDialog'
import { isNumberStr } from './utils/index'
import IconsDialog from './IconsDialog'
import {
  inputComponents, selectComponents
} from './components/generator/config'
import draggable from 'vuedraggable'

const dateTimeFormat = {
  date: 'yyyy-MM-dd',
  week: 'yyyy 第 WW 周',
  month: 'yyyy-MM',
  year: 'yyyy',
  datetime: 'yyyy-MM-dd HH:mm:ss',
  daterange: 'yyyy-MM-dd',
  monthrange: 'yyyy-MM',
  datetimerange: 'yyyy-MM-dd HH:mm:ss'
}

// 使changeRenderKey在目标组件改变时可用
const needRerenderList = ['tinymce']

export default {
  components: {
    TreeNodeDialog,
    IconsDialog,
    draggable
  },
  props: ['showField', 'activeData', 'formConf', 'config'],
  data() {
    return {
      currentTab: 'field',
      currentNode: null,
      dialogVisible: false,
      iconsVisible: false,
      currentIconModel: null,
      formLogoFlag: true,
      formRemarkFlag: true,
      // userAttrConfig: {
      //   label: 'attributeName',
      //   value: 'id',
      //   children: 'children'
      // },
      dateTypeOptions: [
        {
          label: '日(date)',
          value: 'date'
        },
        {
          label: '周(week)',
          value: 'week'
        },
        {
          label: '月(month)',
          value: 'month'
        },
        {
          label: '年(year)',
          value: 'year'
        },
        {
          label: '日期时间(datetime)',
          value: 'datetime'
        }
      ],
      dateRangeTypeOptions: [
        {
          label: '日期范围(daterange)',
          value: 'daterange'
        },
        {
          label: '月范围(monthrange)',
          value: 'monthrange'
        },
        {
          label: '日期时间范围(datetimerange)',
          value: 'datetimerange'
        }
      ],
      colorFormatOptions: [
        {
          label: 'hex',
          value: 'hex'
        },
        {
          label: 'rgb',
          value: 'rgb'
        },
        {
          label: 'rgba',
          value: 'rgba'
        },
        {
          label: 'hsv',
          value: 'hsv'
        },
        {
          label: 'hsl',
          value: 'hsl'
        }
      ],
      justifyOptions: [
        {
          label: 'start',
          value: 'start'
        },
        {
          label: 'end',
          value: 'end'
        },
        {
          label: 'center',
          value: 'center'
        },
        {
          label: 'space-around',
          value: 'space-around'
        },
        {
          label: 'space-between',
          value: 'space-between'
        }
      ],
      layoutTreeProps: {
        label(data, node) {
          const config = data.__config__
          return data.componentName || `${config.label}: ${data.__vModel__}`
        }
      }
    }
  },
  computed: {
    // ...mapState('commonAnalysis', [
    //   'userAttr'
    // ]),
    dateOptions() {
      if (
        this.activeData.type !== undefined &&
        this.activeData.__config__.tag === 'el-date-picker'
      ) {
        if (this.activeData['start-placeholder'] === undefined) {
          return this.dateTypeOptions
        }
        return this.dateRangeTypeOptions
      }
      return []
    },
    tagList() {
      return [
        {
          label: '输入型组件',
          options: inputComponents
        },
        {
          label: '选择型组件',
          options: selectComponents
        }
      ]
    },
    activeTag() {
      return this.activeData.__config__.tag
    },
    isShowMin() {
      return ['el-input-number', 'el-slider'].indexOf(this.activeTag) > -1
    },
    isShowMax() {
      return ['el-input-number', 'el-slider', 'el-rate'].indexOf(this.activeTag) > -1
    },
    isShowStep() {
      return ['el-input-number', 'el-slider'].indexOf(this.activeTag) > -1
    }
  },
  watch: {},
  created() {
    // this.init()
  },
  methods: {
    // async init() {
    //   this.$store.dispatch('commonAnalysis/getCustomerTags')
    //   this.$store.dispatch('commonAnalysis/getUserAttr')
    // },
    // addReg() {
    //   // eslint-disable-next-line vue/no-mutating-props
    //   this.activeData.__config__.regList.push({
    //     pattern: '',
    //     message: ''
    //   })
    // },
    // addAttr() {
    //   // eslint-disable-next-line vue/no-mutating-props
    //   this.activeData.__config__.attrList.push(-1)
    // },
    // handleDelSttr(index) {
    //   // eslint-disable-next-line vue/no-mutating-props
    //   this.activeData.__config__.attrList.splice(index, 1)
    // },
    addSelectItem() {
      // eslint-disable-next-line vue/no-mutating-props
      this.activeData.__slot__.options.push({
        label: '',
        value: ''
      })
    },
    addTreeItem() {
      ++this.idGlobal
      this.dialogVisible = true
      this.currentNode = this.activeData.options
    },
    updateTags(v) {
      // eslint-disable-next-line vue/no-mutating-props
      this.activeData.__config__.tagList = v || []
    },
    renderContent(h, { node, data, store }) {
      return (
        <div class='custom-tree-node'>
          <span>{node.label}</span>
          <span class='node-operation'>
            <i on-click={() => this.append(data)}
              class='el-icon-plus'
              title='添加'
            ></i>
            <i on-click={() => this.remove(node, data)}
              class='el-icon-delete'
              title='删除'
            ></i>
          </span>
        </div>
      )
    },
    append(data) {
      if (!data.children) {
        this.$set(data, 'children', [])
      }
      this.dialogVisible = true
      this.currentNode = data.children
    },
    remove(node, data) {
      // eslint-disable-next-line vue/no-mutating-props
      this.activeData.__config__.defaultValue = [] // 避免删除时报错
      const { parent } = node
      const children = parent.data.children || parent.data
      const index = children.findIndex(d => d.id === data.id)
      children.splice(index, 1)
    },
    addNode(data) {
      this.currentNode.push(data)
    },
    setOptionValue(item, val) {
      item.value = isNumberStr(val) ? +val : val
    },
    setDefaultValue(val) {
      if (Array.isArray(val)) {
        return val.join(',')
      }
      // if (['string', 'number'].indexOf(typeof val) > -1) {
      //   return val
      // }
      if (typeof val === 'boolean') {
        return `${val}`
      }
      return val
    },
    onDefaultValueInput(str) {
      if (isArray(this.activeData.__config__.defaultValue)) {
        // 数组
        this.$set(
          this.activeData.__config__,
          'defaultValue',
          str.split(',').map(val => (isNumberStr(val) ? +val : val))
        )
      } else if (['true', 'false'].indexOf(str) > -1) {
        // 布尔
        this.$set(this.activeData.__config__, 'defaultValue', JSON.parse(str))
      } else {
        // 字符串和数字
        this.$set(
          this.activeData.__config__,
          'defaultValue',
          isNumberStr(str) ? +str : str
        )
      }
    },
    onSwitchValueInput(val, name) {
      if (['true', 'false'].indexOf(val) > -1) {
        this.$set(this.activeData, name, JSON.parse(val))
      } else {
        this.$set(this.activeData, name, isNumberStr(val) ? +val : val)
      }
    },
    setTimeValue(val, type) {
      const valueFormat = type === 'week' ? dateTimeFormat.date : val
      this.$set(this.activeData.__config__, 'defaultValue', null)
      this.$set(this.activeData, 'value-format', valueFormat)
      this.$set(this.activeData, 'format', val)
    },
    spanChange(val) {
      // eslint-disable-next-line vue/no-mutating-props
      this.formConf.span = val
    },
    multipleChange(val) {
      this.$set(this.activeData.__config__, 'defaultValue', val ? [] : '')
    },
    dateTypeChange(val) {
      this.setTimeValue(dateTimeFormat[val], val)
    },
    rangeChange(val) {
      this.$set(
        this.activeData.__config__,
        'defaultValue',
        val ? [this.activeData.min, this.activeData.max] : this.activeData.min
      )
    },
    rateTextChange(val) {
      // eslint-disable-next-line vue/no-mutating-props
      if (val) this.activeData['show-score'] = false
    },
    rateScoreChange(val) {
      // eslint-disable-next-line vue/no-mutating-props
      if (val) this.activeData['show-text'] = false
    },
    colorFormatChange(val) {
      // eslint-disable-next-line vue/no-mutating-props
      this.activeData.__config__.defaultValue = null
      // eslint-disable-next-line vue/no-mutating-props
      this.activeData['show-alpha'] = val.indexOf('a') > -1
      // eslint-disable-next-line vue/no-mutating-props
      this.activeData.__config__.renderKey = +new Date() // 更新renderKey,重新渲染该组件
    },
    openIconsDialog(model) {
      this.iconsVisible = true
      this.currentIconModel = model
    },
    setIcon(val) {
      // eslint-disable-next-line vue/no-mutating-props
      this.activeData[this.currentIconModel] = val
    },
    tagChange(tagIcon) {
      let target = inputComponents.find(item => item.__config__.tagIcon === tagIcon)
      if (!target) target = selectComponents.find(item => item.__config__.tagIcon === tagIcon)
      this.$emit('tag-change', target)
    },
    changeRenderKey() {
      if (needRerenderList.includes(this.activeData.__config__.tag)) {
        // eslint-disable-next-line vue/no-mutating-props
        this.activeData.__config__.renderKey = +new Date()
      }
    },
    setFormConf(key, value) {
      this.$set(this.formConf, key, value)
    },
    // 文件上传格式校验
    beforeImageUpload(file) {
      if (
        ['png', 'jpeg', 'jpg', 'gif'].indexOf(
          file.name.substr(file.name.lastIndexOf('.') + 1).toLocaleLowerCase()
        ) === -1
      ) {
        this.$showNotify({
          type: 'warning',
          content: '图片格式只支持png、jpeg、jpg、gif'
        })
        return false
      }
      const isLt10M = file.size / 1024 / 1024 < 2
      if (!isLt10M) {
        this.$showNotify({
          type: 'warning',
          content: '上传图片大小不能超过 2MB!'
        })
        return false
      }
      this.$refs.formRef?.validateField('file', () => {})
      return true
    },
    // 文件上传成功
    uploadSuccess(res) {
      const { status, data } = res
      if (status === 0 && data) this.setFormConf('formLogoUrl', data.value)
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/.upload-item {
  .upload-tip {
    color: #888d97;
    font-size: 12px;
  }
  .el-switch {
    position: absolute;
    top: -29px;
    right: 0;
  }
  .el-form-item__content {
    > div:not(.el-switch):not(.upload-tip) {
      width: 100%;
      margin-top: 10px;
    }
    .el-upload {
      overflow: hidden;
      width: 316px;
      height: 200px;
      display: flex;
      align-items: center;
      justify-content: center;
      .add-btn {
        display: flex;
        flex-direction: column;
        i {
          margin-top: 25%;
        }
        span {
          line-height: 60px;
          color: #409eff;
        }
      }
      .reupload-mask {
        width: 100%;
        height: 100%;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        img {
          object-fit: cover;
        }
        .avatar {
          max-width: 316px;
          max-height: 200px;
          object-fit: cover;
        }
        &:hover {
          .mask-btn {
            visibility: visible;
          }
        }
        .mask-btn {
          position: absolute;
          visibility: hidden;
          width: 100%;
          height: 100%;
          top: 0;
          background: rgba(38, 41, 46, 0.74);
          display: flex;
          align-items: center;
          justify-content: center;
          user-select: none;
          span {
            display: block;
            width: 92px;
            height: 32px;
            background: #ee6867;
            cursor: pointer;
            border-radius: 4px;
            color: #ffffff;
            line-height: 32px;
          }
        }
      }
    }
  }
  .el-textarea__inner {
    height: 130px;
  }
}
.right-board {
  width: 350px;
  padding: 3px 16px 0;
  position: absolute;
  right: 0;
  top: 0;
  .field-box {
    position: relative;
    height: 100%;
    box-sizing: border-box;
    overflow: hidden;
    .right-scrollbar {
      height: calc(100vh - 181px);
      overflow-y: auto;
    }
  }
  .el-scrollbar {
    height: 100%;
  }
  /deep/ .ml-none .el-form-item__content{
    margin-left: 0 !important;
  }
  .add-btn {
  display: flex;
  align-items: center;
  width: fit-content;
  svg {
    font-size: 32px;
    margin-right: 8px;
    color: #00a39b;
  }
  span {
    font-size: 14px;
    color: #26292e;
  }
}
.reg-item + .reg-item {
    margin-top: 5px;
  }
}
.select-item {
  display: flex;
  border: 1px dashed #fff;
  box-sizing: border-box;
  & .close-btn {
    cursor: pointer;
    color: #f56c6c;
  }
  & .el-input + .el-input {
    margin-left: 4px;
  }
}
.select-item + .select-item {
  margin-top: 4px;
}
.select-item.sortable-chosen {
  border: 1px dashed #409eff;
}
.select-line-icon {
  line-height: 32px;
  font-size: 22px;
  padding: 0 4px;
  color: #777;
}
.option-drag {
  cursor: move;
}
.time-range {
  .el-date-editor {
    width: 227px;
  }
  ::v-deep .el-icon-time {
    display: none;
  }
}
.document-link {
  position: absolute;
  display: block;
  width: 26px;
  height: 26px;
  top: 0;
  left: 0;
  cursor: pointer;
  background: #409eff;
  z-index: 1;
  border-radius: 0 0 6px 0;
  text-align: center;
  line-height: 26px;
  color: #fff;
  font-size: 18px;
}
.node-label{
  font-size: 14px;
}
.node-icon{
  color: #bebfc3;
}
</style>
