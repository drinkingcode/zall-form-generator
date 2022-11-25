## 简介
> 为了了解自定义表单的基本实现原理，在 [form-generator] 项目基础上做了一点点改造，以满足自身的需求。

## 效果展示
- Web端效果展示
 > <img src="public/web.jpg"/>

- H5效果展示
 > <img src="public/H5.jpg"/>

## 配置
> vue.config.js 新增一栏配置  
```js
module.exports = {
	// 编译 zall-form-generator
	transpileDependencies: ['zall-form-generator'], 
}
```

  

## 基本使用
### FormGeneratorComponent
主要用于拖拽组件，根据自身需要设置表单基本信息

- 引入组件
> `import {FormGeneratorComponent} from 'zall-form-generator'`  

- 使用组件  
> `<form-generator-component :data="data"   :config="formConfig"/>`

> data 的数据格式如下：
```json
{
	"fields": [
		{
			"__config__": {
				"label": "单行文本",
				"labelWidth": null,
				"showLabel": true,
				"changeTag": false,
				"tag": "el-input",
				"tagIcon": "input",
				"required": true,
				"layout": "colFormItem",
				"span": 24,
				"document": "https://element.eleme.cn/#/zh-CN/component/input",
				"regList": [],
				"syncList": [],
				"formId": 107,
				"renderKey": "1071667530074981"
			},
			"__slot__": {
				"prepend": "",
				"append": ""
			},
			"placeholder": "请输入单行文本",
			"style": {
				"width": "100%"
			},
			"clearable": true,
			"prefix-icon": "",
			"suffix-icon": "",
			"maxlength": null,
			"show-word-limit": false,
			"readonly": false,
			"disabled": false,
			"__vModel__": "field107"
		},
		{
			"__config__": {
				"label": "单行文本",
				"labelWidth": null,
				"showLabel": true,
				"changeTag": true,
				"tag": "el-input",
				"tagIcon": "input",
				"required": true,
				"layout": "colFormItem",
				"span": 24,
				"document": "https://element.eleme.cn/#/zh-CN/component/input",
				"regList": [
					{
						"pattern": "/^1(3|4|5|7|8|9)\\d{9}$/",
						"message": "手机号格式错误"
					}
				]
			},
			"__slot__": {
				"prepend": "",
				"append": ""
			},
			"__vModel__": "mobile",
			"placeholder": "请输入手机号",
			"style": {
				"width": "100%"
			},
			"clearable": true,
			"prefix-icon": "el-icon-mobile",
			"suffix-icon": "",
			"maxlength": 11,
			"show-word-limit": true,
			"readonly": false,
			"disabled": false
		}
	],
	"formRef": "elForm",
	"formModel": "customFormData",
	"size": "medium",
	"labelPosition": "top",
	"labelWidth": 100,
	"formRules": "rules",
	"gutter": 15,
	"disabled": false,
	"span": 24,
	"formBtns": true,
	"formLogoUrl": "zall-dddssss/CONTENT_CENTER/er6czr1kqgo51w0.jpeg",
	"formName": "表单名称表单名称",
	"formRemark": "表单说明表单说",
	"submitBtnText": "提交",
	"type": "add"
}
```

> formConfig 的数据格式如下：
```json
{
        "fileBaseUrl": "", // 展示图片的前缀
        "fileAction": "", // 上传图片的接口路径
        "fileUploadName": "file",
        "fileHeaders": {
          // 其他部分自定义Header...
        }
      },
```

### Parser
主要用于渲染组件

- 引入组件
> `import {Parser} from 'zall-form-generator'`  

- 使用组件
> `<parser :form-conf="data" />`

> data的数据格式，同上方的data一致。


## 参考
> 在这里非常感谢 [form-generator] 项目的付出，更多自定义表单的使用细节，可参考 [form-generator] 

## LICENSE
[MIT]


[form-generator]: https://github.com/JakHuang/form-generator
[MIT]: https://github.com/drinkingcode/zall-form-generator/blob/master/LICENSE