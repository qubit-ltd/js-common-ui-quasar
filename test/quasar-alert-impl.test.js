////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2024.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
// mount is imported but not used in this test file
import { Dialog, IconSet } from 'quasar';
import { QuasarAlertImpl } from '../src';

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
      onOk: jest.fn((callback) => {
        callback();
        return {};
      }),
    })),
  },
}));

describe('QuasarAlertImpl', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should throw error when Dialog plugin is not provided', () => {
    expect(() => new QuasarAlertImpl()).toThrow('The quasar `Dialog` plugin must be installed in `quasar.conf.js` and provided in the constructor of QuasarAlertImpl.');
    expect(() => new QuasarAlertImpl({})).toThrow('The quasar `Dialog` plugin must be installed in `quasar.conf.js` and provided in the constructor of QuasarAlertImpl.');
  });

  it('should show an alert dialog with default icon when no custom icon configured', () => {
    IconSet.set({ name: 'fontawesome-v6' }, true);
    const alertImpl = new QuasarAlertImpl(Dialog);
    // 不配置自定义图标，getCustomIcon 应该返回 null

    const title = 'Alert Title';
    const message = 'alert - message';

    alertImpl.show('info', title, message);

    expect(Dialog.create).toHaveBeenCalledWith({
      title: '<i class="mocked-info-icon"></i> Alert Title',
      message: 'alert - message',
      noEscDismiss: true,
      noBackdropDismiss: true,
      noRouteDismiss: false,
      seamless: false,
      html: true,
    });
  });

  it('should show an alert dialog with custom icon when configured', () => {
    IconSet.set({ name: 'material-icons' }, true);
    const alertImpl = new QuasarAlertImpl(Dialog);
    // 配置自定义图标
    alertImpl.configure({
      iconClassMap: {
        'error': 'custom-alert-icon',
      },
    });

    const title = 'Alert Title';
    const message = 'alert - message';

    alertImpl.show('error', title, message);

    expect(Dialog.create).toHaveBeenCalledWith({
      title: '<i class="custom-alert-icon"></i> Alert Title',
      message: 'alert - message',
      noEscDismiss: true,
      noBackdropDismiss: true,
      noRouteDismiss: false,
      seamless: false,
      html: true,
    });
  });

  it('should return a promise that resolves when dialog is closed', async () => {
    const alertImpl = new QuasarAlertImpl(Dialog);

    const promise = alertImpl.show('warn', 'Warning', 'This is a warning');

    expect(promise).toBeInstanceOf(Promise);
    await expect(promise).resolves.toBeUndefined();
  });

  it('should handle different alert types correctly', () => {
    const alertImpl = new QuasarAlertImpl(Dialog);

    const types = ['info', 'warn', 'error', 'success', 'debug'];

    types.forEach((type) => {
      alertImpl.show(type, 'Title', 'Message');
    });

    expect(Dialog.create).toHaveBeenCalledTimes(types.length);
  });

  it('should properly configure dialog options', () => {
    const alertImpl = new QuasarAlertImpl(Dialog);

    alertImpl.show('info', 'Test Title', 'Test Message');

    expect(Dialog.create).toHaveBeenCalledWith({
      title: '<i class="mocked-info-icon"></i> Test Title',
      message: 'Test Message',
      noEscDismiss: true,
      noBackdropDismiss: true,
      noRouteDismiss: false,
      seamless: false,
      html: true,
    });
  });

  it('should test getCustomIcon functionality', () => {
    const alertImpl = new QuasarAlertImpl(Dialog);

    // 初始状态应该返回 null
    expect(alertImpl.getCustomIcon('info')).toBeNull();

    // 配置自定义图标后应该返回对应的类名
    alertImpl.configure({
      iconClassMap: {
        'info': 'fa-solid fa-info-circle',
        'error': 'fa-solid fa-times-circle',
      },
    });

    expect(alertImpl.getCustomIcon('info')).toBe('fa-solid fa-info-circle');
    expect(alertImpl.getCustomIcon('error')).toBe('fa-solid fa-times-circle');
    expect(alertImpl.getCustomIcon('warn')).toBeNull(); // 未配置的类型
  });
});
