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
        <el-form v-show="currentTab==='field' && showField && activeData" size="small" label-width="90px">
          <el-divider>基础设置</el-divider>
          <el-form-item v-if="activeData.__config__.label!==undefined" label="标题" required>
            <el-input v-model="activeData.__config__.label" :maxlength="10" placeholder="请输入标题" @input="changeRenderKey" />
          </el-form-item>
          <el-form-item v-if="activeData.placeholder!==undefined" label="占位提示">
            <el-input v-model="activeData.placeholder" :maxlength="20" placeholder="请输入占位提示" @input="changeRenderKey" />
          </el-form-item>
          <el-form-item v-if="activeData.__config__.required !== undefined" label="是否必填">
            <el-switch v-model="activeData.__config__.required" />
          </el-form-item>
          <el-form-item v-if="activeData.__config__.tag==='el-checkbox-group'" label="至少应选">
            <el-input-number
              :value="activeData.min"
              :min="1"
              :max="activeData.__config__.tagList.length"
              placeholder="至少应选"
              :disabled="true"
              @input="$set(activeData, 'min', $event?$event:undefined)"
            />
          </el-form-item>
          <el-form-item v-if="activeData.__config__.tag==='el-checkbox-group'" label="最多可选">
            <el-input-number
              :value="activeData.max"
              :min="1"
              :max="activeData.__config__.tagList.length"
              placeholder="最多可选"
              @input="$set(activeData, 'max', $event?$event:undefined)"
            />
          </el-form-item>
          <template v-if="['el-checkbox-group', 'el-radio-group', 'el-select'].indexOf(activeData.__config__.tag) > -1">
            <div class="options-wrapper">
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
                  <!-- 鉴于产品和测试提的优化点，予以优化 -->
                  <el-input v-model="item.title" placeholder="选项名" size="small" maxlength="20" />
                  <el-input
                    placeholder="选项值"
                    size="small"
                    maxlength="20"
                    :value="item.value"
                    @input="setOptionValue(item, $event)"
                  />
                  <div class="close-btn select-line-icon" @click="deleteSelectItem(index)">
                    <i class="el-icon-remove-outline" />
                  </div>
                </div>
              </draggable>
              <div v-if="activeData.__slot__.options.length < 10" class="add-btn pointer" @click="addSelectItem">
                <svg-icon icon-class="analysis-add-event" />
                <span>选项</span>
              </div>
              <!-- 编辑组件时，不可修改选项 -->
              <div v-show="activeData.unDelete" class="options-wrapper--disabled" />
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
            <!-- <el-switch v-model="formConf.formLogoSwitch" /> -->
            <template v-if="formConf.formLogoSwitch">
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
              <div class="upload-tip">（建议上传比例为375*235px，且小于2M图）</div>
            </template>
          </el-form-item>
          <el-form-item label="表单名称" required>
            <el-input v-model.trim="formConf.formName" :maxlength="20" show-word-limit placeholder="请输入表单名称" />
          </el-form-item>
          <el-form-item label="表单说明" class="upload-item">
            <el-switch v-model="formConf.formRemarkSwitch" />
            <el-input
              v-if="formConf.formRemarkSwitch"
              v-model="formConf.formRemark"
              maxlength="500"
              show-word-limit
              type="textarea"
              placeholder="请输入表单说明"
            />
          </el-form-item>
          <el-form-item label="按钮文案" required>
            <el-input v-model.trim="formConf.submitBtnText" :maxlength="10" show-word-limit placeholder="请输入按钮文案" />
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

    <!-- <treeNode-dialog :visible.sync="dialogVisible" title="添加选项" @commit="addNode" />
    <icons-dialog :visible.sync="iconsVisible" :current="activeData[currentIconModel]" @select="setIcon" /> -->
  </div>
</template>

<script>
import { isNumberStr } from './utils/index'
import draggable from 'vuedraggable'
import { changeNumber } from './components/generator/config'

// 使changeRenderKey在目标组件改变时可用
const needRerenderList = ['tinymce']

export default {
  components: {
    // TreeNodeDialog,
    // IconsDialog,
    draggable
  },
  props: ['showField', 'activeData', 'formConf', 'config'],
  data() {
    return {
      currentTab: 'field'
    }
  },
  computed: {
    activeTag() {
      return this.activeData.__config__.tag
    }
  },
  watch: {
    'activeData.max': function(val,oldVal){
      this.activeData.__config__.tips = `(最多选择${val}项)`
    }
  },
  created() {
    console.log('formConf', this.formConf, this.activeData)
    // this.init()
  },
  methods: {
    addSelectItem() {
      // eslint-disable-next-line vue/no-mutating-props
      const len = this.activeData.__slot__.options.length
      this.activeData.__slot__.options.push({
        title: `选项${changeNumber[len]}`,
        label: len + 1,
        value: len + 1
      })
      // eslint-disable-next-line vue/no-mutating-props
      if (this.activeData.__config__.tag === 'el-checkbox-group') this.activeData.max = this.activeData.__slot__.options.length
      this.$listeners.onOptionsChange(this.activeData, 'ADD', this.activeData.__slot__.options.length - 1)
    },
    deleteSelectItem(index) {
      // eslint-disable-next-line vue/no-mutating-props
      this.activeData.__slot__.options.splice(index, 1)
      // eslint-disable-next-line vue/no-mutating-props
      if (this.activeData.__config__.tag === 'el-checkbox-group') this.activeData.max = this.activeData.__slot__.options.length
      this.$listeners.onOptionsChange(this.activeData, 'DELETE', index)
    },
    setOptionValue(item, val) {
      // item.value = isNumberStr(val) ? +val : val
      item.value = val
      item.label = item.value
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
    .options-wrapper {
      position: relative;
      .options-wrapper--disabled {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        cursor: not-allowed;
      }
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
