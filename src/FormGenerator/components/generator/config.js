import cities from './city.min.js'

// 表单属性【右面板】
export const formConf = {
  formRef: 'elForm',
  formModel: 'formData',
  size: 'medium',
  labelPosition: 'top',
  labelWidth: 100,
  formRules: 'rules',
  gutter: 15,
  disabled: false,
  span: 24,
  formBtns: true,
  formLogoUrl: '',
  formLogoSwitch: true,
  formName: '',
  formRemark: '',
  formRemarkSwitch: true,
  submitBtnText: '提交'
}

// 输入 【左面板】
export const inputComponents = [
  {
    // 组件的自定义配置
    __config__: {
      label: '单行文本',
      labelWidth: null,
      showLabel: true,
      changeTag: false,
      tag: 'el-input',
      tagIcon: 'input',
      defaultValue: undefined,
      required: true,
      layout: 'colFormItem',
      span: 24,
      document: 'https://element.eleme.cn/#/zh-CN/component/input',
      // 正则校验规则
      regList: [],
      attrList: [] // 数据同步
    },
    // 组件的插槽属性
    __slot__: {
      prepend: '',
      append: ''
    },
    // 其余的为可直接写在组件标签上的属性
    placeholder: '请输入',
    style: { width: '100%' },
    clearable: true,
    'prefix-icon': '',
    'suffix-icon': '',
    maxlength: 100,
    'show-word-limit': false,
    readonly: false,
    disabled: false
  },
  {
    __config__: {
      label: '多行文本',
      labelWidth: null,
      showLabel: true,
      tag: 'el-input',
      tagIcon: 'textarea',
      defaultValue: undefined,
      required: true,
      layout: 'colFormItem',
      span: 24,
      regList: [],
      attrList: [], // 数据同步
      changeTag: true,
      document: 'https://element.eleme.cn/#/zh-CN/component/input'
    },
    type: 'textarea',
    placeholder: '请输入',
    autosize: {
      minRows: 4,
      maxRows: 4
    },
    style: { width: '100%' },
    maxlength: 1000,
    'show-word-limit': false,
    readonly: false,
    disabled: false
  }
]

// 选项 【左面板】
export const selectComponents = [
  {
    __config__: {
      label: '日期',
      tag: 'el-date-picker',
      tagIcon: '',
      defaultValue: null,
      showLabel: true,
      labelWidth: null,
      span: 24,
      layout: 'colFormItem',
      required: true,
      regList: [],
      attrList: [], // 数据同步
      changeTag: true,
      document: 'https://element.eleme.cn/#/zh-CN/component/date-picker'
    },
    placeholder: '请选择',
    type: 'date',
    style: { width: '100%' },
    disabled: false,
    clearable: false,
    format: 'yyyy-MM-dd',
    'value-format': 'yyyy-MM-dd',
    readonly: false,
    editable: false // 避免移动端弹出键盘
  },
  {
    __config__: {
      type: 'address',
      label: '省市',
      url: '',
      method: 'get',
      dataPath: 'list',
      dataConsumer: 'options',
      showLabel: true,
      labelWidth: null,
      tag: 'el-cascader',
      tagIcon: 'cascader',
      layout: 'colFormItem',
      defaultValue: [],
      dataType: 'static',
      span: 24,
      required: true,
      regList: [],
      attrList: [], // 数据同步
      changeTag: true,
      document: 'https://element.eleme.cn/#/zh-CN/component/cascader'
    },
    options: cities,
    placeholder: '请选择',
    style: { width: '100%' },
    props: {
      props: {
        multiple: false,
        label: 'name',
        value: 'name', // 方便转化
        children: 'children'
      }
    },
    'show-all-levels': true,
    disabled: false,
    clearable: false,
    filterable: false,
    separator: '/'
  },
  {
    __config__: {
      label: '单选',
      labelWidth: null,
      showLabel: true,
      tag: 'el-radio-group',
      tagIcon: 'radio',
      changeTag: true,
      defaultValue: undefined,
      layout: 'colFormItem',
      span: 24,
      optionType: 'default',
      regList: [],
      tagList: [{ // 跟选项联动
        cname: '',
        tagId: '',
        tagValues: [],
        value: '',
        valueIndex: ''
      }, {
        cname: '',
        tagId: '',
        tagValues: [],
        value: '',
        valueIndex: ''
      }], // 标签关联
      required: true,
      border: false,
      document: 'https://element.eleme.cn/#/zh-CN/component/radio'
    },
    __slot__: {
      options: [{
        title: '选项一',
        label: 1,
        value: 1
      }, {
        title: '选项二',
        label: 2,
        value: 2
      }]
    },
    style: { width: '100%' },
    size: 'medium',
    disabled: false
  },
  {
    __config__: {
      label: '多选',
      tag: 'el-checkbox-group',
      tagIcon: 'checkbox',
      defaultValue: [],
      span: 24,
      showLabel: true,
      labelWidth: null,
      layout: 'colFormItem',
      optionType: 'default',
      required: true,
      showTips: true,
      tips:`(最多选择2项)`,
      regList: [],
      tagList: [{ // 跟选项联动
        cname: '',
        tagId: '',
        tagValues: [],
        value: '',
        valueIndex: ''
      }, {
        cname: '',
        tagId: '',
        tagValues: [],
        value: '',
        valueIndex: ''
      }], // 标签关联
      changeTag: true,
      border: false,
      document: 'https://element.eleme.cn/#/zh-CN/component/checkbox'
    },
    __slot__: {
      options: [{
        title: '选项一',
        label: 1,
        value: 1
      }, {
        title: '选项二',
        label: 2,
        value: 2
      }]
    },
    style: { width: '100%' },
    size: 'medium',
    min: 1,
    max: 2,
    disabled: false
  },
  {
    __config__: {
      label: '下拉选择',
      showLabel: true,
      labelWidth: null,
      tag: 'el-select',
      tagIcon: 'select',
      layout: 'colFormItem',
      span: 24,
      required: true,
      regList: [],
      tagList: [{ // 跟选项联动
        cname: '',
        tagId: '',
        tagValues: [],
        value: '',
        valueIndex: ''
      }, {
        cname: '',
        tagId: '',
        tagValues: [],
        value: '',
        valueIndex: ''
      }], // 标签关联
      changeTag: true,
      document: 'https://element.eleme.cn/#/zh-CN/component/select'
    },
    __slot__: {
      options: [{
        title: '选项一',
        label: 1,
        value: 1
      }, {
        title: '选项二',
        label: 2,
        value: 2
      }]
    },
    placeholder: '请选择',
    style: { width: '100%' },
    clearable: true,
    disabled: false,
    filterable: false,
    multiple: false
  }
]

// 中文数组
export const changeNumber = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十']
