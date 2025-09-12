////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2024.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import { AlertImpl } from '@qubit-ltd/common-ui';
import getHtmlIcon from './impl/get-html-icon';

/**
 * 基于Quasar框架实现的{@link AlertImpl}。
 *
 * @author 胡海星
 */
class QuasarAlertImpl extends AlertImpl {
  /**
   * 创建一个新的{@link QuasarAlertImpl}。
   *
   * 注意我们不能直接在这个类库中从`quasar`导入`Dialog`，因为这样导入的`Dialog`对象
   * 是个未被安装的插件。只有在最终的`quasar`项目中，`quasar-cli`才会根据配置自动安装
   * `Dialog`插件并将所有从`quasar`中导入的`Dialog`对象修改为已经安装的插件。
   *
   * @param Dialog
   *     一个Quasar对话框组件。必须是最终项目从Quasar框架导入的对话框组件。
   */
  constructor(Dialog) {
    super();
    if (!Dialog || !Dialog.create) {
      throw new Error('The quasar `Dialog` plugin must be installed in `quasar.conf.js` and provided in the constructor of QuasarAlertImpl.');
    }
    this.Dialog = Dialog;
  }

  /**
   * 显示一个弹出式对话框。
   *
   * @param {string} type
   *     对话框的类型，可取值为：`'info'`, `'success'`, `'warning'`, `'error'`, `'debug'`。
   * @param {string} title
   *     对话框的标题。
   * @param {string} message
   *     对话框中的文字内容。
   * @return {Promise<void>}
   *     一个`Promise`对象，当用户点击对话框的`OK`按键后，可以接着`then`继续下一步操作。
   */
  show(type, title, message) {
    // 获取自定义图标配置，如果没有配置则使用默认逻辑
    const customIconClass = this.getCustomIcon(type);
    const icon = getHtmlIcon(type, customIconClass);
    return new Promise((resolve) => {
      this.Dialog.create({
        title: `${icon} ${title}`,
        message,
        noEscDismiss: true,
        noBackdropDismiss: true,
        noRouteDismiss: false,
        seamless: false,
        html: true,
      }).onOk(resolve);
    });
  }
}

export default QuasarAlertImpl;
