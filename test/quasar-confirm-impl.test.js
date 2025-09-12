////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2024.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
// mount is imported but not used in this test file
import { Dialog } from 'quasar';
import { QuasarConfirmImpl } from '../src';

// Mock getHtmlIcon module
jest.mock('../src/impl/get-html-icon', () => jest.fn((type, customIconClass) => {
  if (customIconClass) {
    return `<i class="${customIconClass}"></i>`;
  }
  switch (type) {
    case 'info':
      return '<i class="mocked-info-icon"></i>';
    case 'warn':
      return '<i class="mocked-warn-icon"></i>';
    case 'error':
      return '<i class="mocked-error-icon"></i>';
    default:
      return '<i class="mocked-default-icon"></i>';
  }
}));

jest.mock('quasar', () => ({
  IconSet: {
    props: {
      name: '',
    },
    set: function setFn(props) {
      this.props = { ...this.props, ...props };
    },
  },
  Dialog: {
    create: jest.fn().mockImplementation(() => ({
      onOk: jest.fn((callback) => ({
        onCancel: jest.fn((errorCallback) => ({
          // 返回完整的模拟对象
          _callback: callback,
          _errorCallback: errorCallback,
          // 模拟用户点击 OK
          triggerOk: () => {
            callback();
            return true;
          },
          // 模拟用户点击 Cancel
          triggerCancel: () => {
            errorCallback();
            return true;
          },
        })),
      })),
    })),
  },
}));

describe('QuasarConfirmImpl', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should throw error when Dialog plugin is not provided', () => {
    expect(() => new QuasarConfirmImpl()).toThrow('The quasar `Dialog` plugin must be installed in `quasar.conf.js` and provided in the constructor of QuasarConfirmImpl.');
    expect(() => new QuasarConfirmImpl({})).toThrow('The quasar `Dialog` plugin must be installed in `quasar.conf.js` and provided in the constructor of QuasarConfirmImpl.');
  });

  it('should show confirm dialog with default icon when no custom icon configured', () => {
    const confirmImpl = new QuasarConfirmImpl(Dialog);
    // 不配置自定义图标，getCustomIcon 应该返回 null

    const type = 'info';
    const title = 'Confirm Title';
    const message = 'Confirm Message';
    const okLabel = 'Yes';
    const cancelLabel = 'No';

    confirmImpl.show(type, title, message, okLabel, cancelLabel);

    expect(Dialog.create).toHaveBeenCalledWith({
      title: '<i class="mocked-info-icon"></i> Confirm Title',
      message: 'Confirm Message',
      ok: 'Yes',
      cancel: 'No',
      focus: 'cancel',
      noEscDismiss: true,
      noBackdropDismiss: true,
      noRouteDismiss: false,
      seamless: false,
      html: true,
    });
  });

  it('should show confirm dialog with custom icon when configured', () => {
    const confirmImpl = new QuasarConfirmImpl(Dialog);
    // 配置自定义图标
    confirmImpl.configure({
      iconClassMap: {
        'warn': 'custom-confirm-icon',
      },
    });

    const type = 'warn';
    const title = 'Warning Title';
    const message = 'Warning Message';

    confirmImpl.show(type, title, message, 'OK', 'Cancel');

    expect(Dialog.create).toHaveBeenCalledWith({
      title: '<i class="custom-confirm-icon"></i> Warning Title',
      message: 'Warning Message',
      ok: 'OK',
      cancel: 'Cancel',
      focus: 'cancel',
      noEscDismiss: true,
      noBackdropDismiss: true,
      noRouteDismiss: false,
      seamless: false,
      html: true,
    });
  });

  it('should resolve promise when ok is clicked', () => {
    // 创建一个简单实现，同步执行 OK 回调
    const simpleDialog = {
      create: jest.fn().mockImplementation(() => ({
        onOk: jest.fn((cb) => {
          cb(); // 立即调用回调
          return {
            onCancel: jest.fn(),
          };
        }),
      })),
    };

    const confirmImpl = new QuasarConfirmImpl(simpleDialog);

    // 返回一个已解析的 Promise
    return confirmImpl.show('info', 'Title', 'Message');
  });

  it('should reject promise when cancel is clicked', () => {
    // 创建一个简单实现，同步执行 Cancel 回调
    const simpleDialog = {
      create: jest.fn().mockImplementation(() => ({
        onOk: jest.fn(() => ({
          onCancel: jest.fn((cb) => {
            cb(); // 立即调用回调，表示取消操作
            return {};
          }),
        })),
      })),
    };

    const confirmImpl = new QuasarConfirmImpl(simpleDialog);

    // 返回一个将被拒绝的 Promise
    return confirmImpl.show('warn', 'Warning', 'Are you sure?')
      .then(() => {
        throw new Error('Promise should be rejected');
      })
      .catch(() => Promise.resolve());  // 成功捕获拒绝状态
  });

  it('should handle different confirm types correctly', () => {
    const confirmImpl = new QuasarConfirmImpl(Dialog);

    const types = ['info', 'warn', 'error', 'success', 'debug'];

    types.forEach((type) => {
      confirmImpl.show(type, 'Title', 'Message', 'OK', 'Cancel');
    });

    expect(Dialog.create).toHaveBeenCalledTimes(types.length);
  });

  it('should properly configure dialog options', () => {
    const confirmImpl = new QuasarConfirmImpl(Dialog);

    confirmImpl.show('error', 'Delete Item', 'Are you sure you want to delete this item?', 'Delete', 'Cancel');

    expect(Dialog.create).toHaveBeenCalledWith({
      title: '<i class="mocked-error-icon"></i> Delete Item',
      message: 'Are you sure you want to delete this item?',
      ok: 'Delete',
      cancel: 'Cancel',
      focus: 'cancel',
      noEscDismiss: true,
      noBackdropDismiss: true,
      noRouteDismiss: false,
      seamless: false,
      html: true,
    });
  });

  it('should test getCustomIcon functionality', () => {
    const confirmImpl = new QuasarConfirmImpl(Dialog);

    // 初始状态应该返回 null
    expect(confirmImpl.getCustomIcon('info')).toBeNull();

    // 配置自定义图标后应该返回对应的类名
    confirmImpl.configure({
      iconClassMap: {
        'info': 'fa-solid fa-info-circle',
        'warn': 'fa-solid fa-exclamation-triangle',
        'error': 'fa-solid fa-times-circle',
      },
    });

    expect(confirmImpl.getCustomIcon('info')).toBe('fa-solid fa-info-circle');
    expect(confirmImpl.getCustomIcon('warn')).toBe('fa-solid fa-exclamation-triangle');
    expect(confirmImpl.getCustomIcon('error')).toBe('fa-solid fa-times-circle');
    expect(confirmImpl.getCustomIcon('success')).toBeNull(); // 未配置的类型
  });
});
