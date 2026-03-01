# @qubit-ltd/common-ui-quasar

[![npm package](https://img.shields.io/npm/v/@qubit-ltd/common-ui-quasar.svg)](https://npmjs.com/package/@qubit-ltd/common-ui-quasar)
[![License](https://img.shields.io/badge/License-Apache-blue.svg)](https://www.apache.org/licenses/LICENSE-2.0)
[![CircleCI](https://dl.circleci.com/status-badge/img/gh/qubit-ltd/js-common-ui-quasar/tree/master.svg?style=shield)](https://dl.circleci.com/status-badge/redirect/gh/qubit-ltd/js-common-ui-quasar/tree/master)
[![Coverage Status](https://coveralls.io/repos/github/qubit-ltd/js-common-ui-quasar/badge.svg?branch=master)](https://coveralls.io/github/qubit-ltd/js-common-ui-quasar?branch=master)

## 简介

[@qubit-ltd/common-ui-quasar] 是基于 [Quasar Framework](https://quasar.dev/) 实现的通用UI组件库。该库包含了一系列常用UI组件的实现，为开发者提供了统一的界面交互体验。

本项目提供了基于 Quasar 框架的通知、确认框、提示框和加载指示器等常用组件的实现，与 [@qubit-ltd/common-ui] 库无缝集成，使开发者能够在 Quasar 项目中轻松使用这些组件。

## 特性

- **统一的组件接口**：与 [@qubit-ltd/common-ui] 保持一致的API，便于在不同项目间迁移
- **Quasar框架集成**：针对 Quasar Framework 优化，充分利用其组件生态
- **全面的通知系统**：支持多种通知类型（信息、成功、警告、错误、调试）
- **可定制性强**：支持自定义图标、位置、持续时间等参数
- **完整的类型支持**：提供完整的TypeScript类型定义
- **100%测试覆盖率**：确保代码质量和可靠性

## 安装

使用 npm 安装:

```bash
npm install @qubit-ltd/common-ui-quasar --save
```

或者使用 yarn:

```bash
yarn add @qubit-ltd/common-ui-quasar
```

## 依赖

本库依赖以下包:

- `@qubit-ltd/common-ui`: 通用UI组件接口定义
- `quasar`: Quasar框架
- `vue`: Vue.js框架

确保这些依赖已正确安装在您的项目中。

## 自定义图标配置

从 v1.1.0 开始，`@qubit-ltd/common-ui-quasar` 支持自定义图标配置功能。您可以为不同的消息类型配置自定义的图标CSS类名。

### 基本配置

```javascript
import { alert, confirm, notify } from '@qubit-ltd/common-ui';
import { QuasarAlertImpl, QuasarConfirmImpl, QuasarNotifyImpl } from '@qubit-ltd/common-ui-quasar';
import { Dialog, Notify } from 'quasar';

// 配置自定义图标
const iconConfig = {
  iconClassMap: {
    'info': 'fa-solid fa-info-circle',
    'success': 'fa-solid fa-check-circle',
    'warn': 'fa-solid fa-exclamation-triangle',
    'error': 'fa-solid fa-times-circle',
    'debug': 'fa-solid fa-bug'
  }
};

// 在设置实现时传入配置
alert.setImpl(new QuasarAlertImpl(Dialog), iconConfig);
confirm.setImpl(new QuasarConfirmImpl(Dialog), iconConfig);
notify.setImpl(new QuasarNotifyImpl(Notify), iconConfig);
```

### 部分自定义配置

您只需要配置想要自定义的图标类型，其他类型将使用默认图标：

```javascript
// 只自定义错误和成功图标
const partialConfig = {
  iconClassMap: {
    'error': 'fa-solid fa-skull-crossbones',
    'success': 'fa-solid fa-thumbs-up'
  }
};

alert.setImpl(new QuasarAlertImpl(Dialog), partialConfig);
```

### 支持的图标库

您可以使用任何CSS图标库：

```javascript
// FontAwesome 图标
const fontAwesomeConfig = {
  iconClassMap: {
    'info': 'fa-solid fa-circle-info',
    'error': 'fa-solid fa-circle-xmark'
  }
};

// Bootstrap Icons
const bootstrapConfig = {
  iconClassMap: {
    'info': 'bi bi-info-circle-fill',
    'error': 'bi bi-x-circle-fill'
  }
};

// Material Icons
const materialConfig = {
  iconClassMap: {
    'info': 'material-icons',
    'error': 'material-icons'
  }
};
```

### 向后兼容

不提供配置时，完全保持原有行为：

```javascript
// 原有方式，使用默认图标
alert.setImpl(new QuasarAlertImpl(Dialog));
```

### 运行时配置更新

您也可以在运行时更新配置：

```javascript
// 获取当前实现并更新配置
const impl = alert.getImpl();
impl.configure({
  iconClassMap: {
    'info': 'new-info-icon',
    'error': 'new-error-icon'
  }
});
```

## 使用方法

### 基本用法

首先，在您的应用中导入并设置相应的实现：

```javascript
import { notify, loading, confirm, alert } from '@qubit-ltd/common-ui';
import {
  QuasarNotifyImpl,
  QuasarLoadingImpl,
  QuasarConfirmImpl,
  QuasarAlertImpl
} from '@qubit-ltd/common-ui-quasar';
import { Notify, Loading, Dialog } from 'quasar';

// 设置实现
notify.setImpl(new QuasarNotifyImpl(Notify));
loading.setImpl(new QuasarLoadingImpl(Loading));
confirm.setImpl(new QuasarConfirmImpl(Dialog));
alert.setImpl(new QuasarAlertImpl(Dialog));
```

### 通知示例

```javascript
// 显示一条信息通知
notify.info('这是一条信息');

// 显示成功通知
notify.success('操作成功完成');

// 显示警告通知
notify.warn('请注意', {
  position: 'top-right',
  duration: 5000,
  closeable: true
});

// 显示错误通知
notify.error('发生错误', {
  icon: 'error',
  showDetail: true,
  detailLabel: '查看详情',
  detailAction: () => console.log('查看详情')
});
```

### 加载指示器示例

```javascript
// 显示加载指示器
loading.show();

// 显示带消息的加载指示器
loading.show('数据加载中...');

// 隐藏加载指示器
loading.hide();
```

### 确认对话框示例

```javascript
// 简单确认对话框
confirm.show('确认删除?', '您确定要删除这个项目吗?')
  .then(() => {
    // 用户点击了确认
    console.log('用户确认了操作');
  })
  .catch(() => {
    // 用户点击了取消
    console.log('用户取消了操作');
  });

// 自定义确认对话框
confirm.show(
  '保存更改',
  '是否保存所做的更改?',
  {
    ok: '保存',
    cancel: '不保存',
    icon: 'save'
  }
).then(() => {
  // 处理保存逻辑
});
```

### 提示对话框示例

```javascript
// 显示简单提示框
alert.show('操作完成', '您的操作已成功完成');

// 带回调的提示框
alert.show('注意', '会话即将过期', {
  ok: '知道了',
  callback: () => console.log('用户已知晓')
});
```

## API文档

本项目使用JSDoc生成详细的API文档，可通过以下命令在本地构建：

```bash
yarn doc
```

生成的文档将位于 `doc` 目录中。

## 目录结构

```
src/
├── impl/                  # 实现工具函数
│   ├── get-html-icon.js   # HTML图标生成
│   ├── get-quasar-color.js # Quasar颜色映射
│   └── get-quasar-icon.js # Quasar图标映射
├── index.js               # 入口文件
├── get-quasar-icon-set.js # 图标集处理
├── quasar-alert-impl.js   # 提示框实现
├── quasar-confirm-impl.js # 确认对话框实现
├── quasar-loading-impl.js # 加载指示器实现
└── quasar-notify-impl.js  # 通知系统实现
```

## 开发指南

### 环境设置

克隆仓库后，安装依赖：

```bash
yarn install
```

### 构建

```bash
# 开发环境构建
yarn build:dev

# 生产环境构建
yarn build

# 构建所有内容（文档和库）
yarn build:all
```

### 测试

本项目使用Jest进行单元测试：

```bash
# 运行所有测试
yarn test

# 带覆盖率报告
yarn test --coverage
```

### 代码规范

本项目使用ESLint进行代码质量检查：

```bash
yarn lint
```

## 贡献

欢迎对本项目做出贡献！如果您发现任何问题或有改进建议，请随时在 [GitHub 仓库][GitHub repository] 提交 issue 或 pull request。

## 许可证

[@qubit-ltd/common-ui-quasar] 基于 Apache 2.0 许可证发布。
详细信息请查看 [LICENSE](LICENSE) 文件。

[@qubit-ltd/common-ui-quasar]: https://npmjs.com/package/@qubit-ltd/common-ui-quasar
[@qubit-ltd/common-ui]: https://npmjs.com/package/@qubit-ltd/common-ui
[GitHub repository]: https://github.com/qubit-ltd/js-common-ui-quasar