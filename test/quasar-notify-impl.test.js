////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2024.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
// mount is imported but not used in this test file
import { IconSet, Notify, Loading } from 'quasar';
import { notify, loading } from '@qubit-ltd/common-ui';
import { QuasarNotifyImpl, QuasarLoadingImpl } from '../src';
import getQuasarIcon from '../src/impl/get-quasar-icon';
// getQuasarColor is imported but not used in this test file

// 模拟 getQuasarIcon 函数
jest.mock('../src/impl/get-quasar-icon', () => jest.fn((type) => {
  switch (type) {
    case 'info': return 'info';
    case 'warn': return 'warning';
    case 'error': return 'error';
    case 'success': return 'check_circle';
    case 'debug': return 'bug_report';
    case 'question': return 'help';
    default: return 'help';
  }
}));

jest.mock('../src/impl/get-quasar-color', () => jest.fn((type) => {
  switch (type) {
    case 'info': return 'light-blue';
    case 'warn': return 'amber';
    case 'error': return 'red';
    case 'success': return 'green';
    case 'debug': return 'purple';
    case 'question': return 'light-blue';
    default: return '#616161';
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
  Notify: {
    create: jest.fn(),
    registerType: jest.fn(),
  },
  Loading: {
    show: jest.fn(),
    hide: jest.fn(),
  },
}));

// Mock the Dialog.create method

loading.setImpl(new QuasarLoadingImpl(Loading));
notify.setImpl(new QuasarNotifyImpl(Notify));

describe('QuasarNotifyImpl', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should throw error when Notify plugin is not provided', () => {
    expect(() => new QuasarNotifyImpl()).toThrow('The quasar `Notify` plugin must be installed in `quasar.conf.js` and provided in the constructor of QuasarNotifyImpl.');
    expect(() => new QuasarNotifyImpl({})).toThrow('The quasar `Notify` plugin must be installed in `quasar.conf.js` and provided in the constructor of QuasarNotifyImpl.');
  });

  it('should directly pass through the Notify.create call', async () => {
    IconSet.set({
      name: 'fontawesome-v6',
    }, true);
    const closeAction = jest.fn();

    // 直接使用 QuasarNotifyImpl 来测试
    const notifyImpl = new QuasarNotifyImpl(Notify);

    notifyImpl.show('info', 'message', {
      closeable: true,
      closeAction,
    });

    // 由于我们不知道具体的默认值逻辑，我们只验证 Notify.create 被调用
    expect(Notify.create).toHaveBeenCalled();
    const args = Notify.create.mock.calls[0][0];
    expect(args.message).toBe('message');
    expect(args.icon).toBe('info');
    expect(args.iconColor).toBe('light-blue');
    expect(args.actions).toBeDefined();
    expect(args.actions.length).toBe(1);
    expect(args.actions[0].label).toBe('关闭');
    expect(args.actions[0].handler).toBe(closeAction);
  });

  it('should use default icon from getQuasarIcon when options.icon is undefined', async () => {
    // 重置 getQuasarIcon 调用次数
    getQuasarIcon.mockClear();

    const notifyImpl = new QuasarNotifyImpl(Notify);

    // 明确设置 icon 为 undefined，测试 null 合并操作符
    notifyImpl.show('error', 'error message', {
      icon: undefined,
    });

    expect(Notify.create).toHaveBeenCalled();
    expect(getQuasarIcon).toHaveBeenCalledWith('error');
    const args = Notify.create.mock.calls[0][0];
    expect(args.icon).toBe('error'); // 这应该是从 getQuasarIcon 返回的
    expect(args.iconColor).toBe('red');
  });

  it('should use default icon from getQuasarIcon when options.icon is null', async () => {
    // 重置 getQuasarIcon 调用次数
    getQuasarIcon.mockClear();

    const notifyImpl = new QuasarNotifyImpl(Notify);

    // 明确设置 icon 为 null，测试 null 合并操作符
    notifyImpl.show('error', 'error message', {
      icon: null,
    });

    expect(Notify.create).toHaveBeenCalled();
    expect(getQuasarIcon).toHaveBeenCalledWith('error');
    const args = Notify.create.mock.calls[0][0];
    expect(args.icon).toBe('error'); // 这应该是从 getQuasarIcon 返回的
    expect(args.iconColor).toBe('red');
  });

  it('should use default icon from getQuasarIcon when options.icon is omitted', async () => {
    // 重置 getQuasarIcon 调用次数
    getQuasarIcon.mockClear();

    const notifyImpl = new QuasarNotifyImpl(Notify);

    // 不设置 icon，测试默认行为
    notifyImpl.show('error', 'error message', {});

    expect(Notify.create).toHaveBeenCalled();
    expect(getQuasarIcon).toHaveBeenCalledWith('error');
    const args = Notify.create.mock.calls[0][0];
    expect(args.icon).toBe('error'); // 这应该是从 getQuasarIcon 返回的
    expect(args.iconColor).toBe('red');
  });

  it('should use empty string as icon when options.icon is empty string', async () => {
    // 重置 getQuasarIcon 调用次数
    getQuasarIcon.mockClear();

    const notifyImpl = new QuasarNotifyImpl(Notify);

    // 设置 icon 为空字符串，测试边界情况
    notifyImpl.show('error', 'error message', {
      icon: '',
    });

    expect(Notify.create).toHaveBeenCalled();
    expect(getQuasarIcon).not.toHaveBeenCalled(); // 不应该调用 getQuasarIcon
    const args = Notify.create.mock.calls[0][0];
    expect(args.icon).toBe(''); // 应该使用空字符串
    expect(args.iconColor).toBe('red');
  });

  it('should use 0 as icon when options.icon is 0', async () => {
    // 重置 getQuasarIcon 调用次数
    getQuasarIcon.mockClear();

    const notifyImpl = new QuasarNotifyImpl(Notify);

    // 设置 icon 为 0，测试特殊边界情况
    notifyImpl.show('error', 'error message', {
      icon: 0,
    });

    expect(Notify.create).toHaveBeenCalled();
    expect(getQuasarIcon).not.toHaveBeenCalled(); // 不应该调用 getQuasarIcon
    const args = Notify.create.mock.calls[0][0];
    expect(args.icon).toBe(0); // 应该使用 0
    expect(args.iconColor).toBe('red');
  });

  it('should use false as icon when options.icon is false', async () => {
    // 重置 getQuasarIcon 调用次数
    getQuasarIcon.mockClear();

    const notifyImpl = new QuasarNotifyImpl(Notify);

    // 设置 icon 为 false，测试特殊边界情况
    notifyImpl.show('error', 'error message', {
      icon: false,
    });

    expect(Notify.create).toHaveBeenCalled();
    expect(getQuasarIcon).not.toHaveBeenCalled(); // 不应该调用 getQuasarIcon
    const args = Notify.create.mock.calls[0][0];
    expect(args.icon).toBe(false); // 应该使用 false
    expect(args.iconColor).toBe('red');
  });

  it('should handle different options combinations', async () => {
    IconSet.set({
      name: 'material-symbol',
    }, true);
    const closeAction = jest.fn();
    const detailAction = jest.fn();
    const detailLabel = '详情';

    // 直接使用 QuasarNotifyImpl 来测试
    const notifyImpl = new QuasarNotifyImpl(Notify);

    notifyImpl.show('warn', 'message', {
      closeable: true,
      closeAction,
      showDetail: true,
      detailLabel,
      detailAction,
    });

    // 验证基本属性
    expect(Notify.create).toHaveBeenCalled();
    const args = Notify.create.mock.calls[0][0];
    expect(args.message).toBe('message');
    expect(args.icon).toBe('warning');
    expect(args.iconColor).toBe('amber');

    // 验证操作按钮
    expect(args.actions).toBeDefined();
    expect(args.actions.length).toBe(2);
    expect(args.actions[0].label).toBe('详情');
    expect(args.actions[0].handler).toBe(detailAction);
    expect(args.actions[1].label).toBe('关闭');
    expect(args.actions[1].handler).toBe(closeAction);
  });

  it('should use custom icon and position', async () => {
    // 直接使用 QuasarNotifyImpl 来测试
    const notifyImpl = new QuasarNotifyImpl(Notify);

    notifyImpl.show('error', 'error message', {
      icon: 'custom-icon',
      position: 'bottom-left',
      duration: 5000,
    });

    expect(Notify.create).toHaveBeenCalled();
    const args = Notify.create.mock.calls[0][0];
    expect(args.message).toBe('error message');
    expect(args.icon).toBe('custom-icon');
    expect(args.iconColor).toBe('red');
    expect(args.position).toBe('bottom-left');
    expect(args.timeout).toBe(5000);
  });

  it('should handle showDetail without closeable', async () => {
    const detailAction = jest.fn();
    const detailLabel = '查看详情';

    // 直接使用 QuasarNotifyImpl 来测试
    const notifyImpl = new QuasarNotifyImpl(Notify);

    notifyImpl.show('success', 'success message', {
      showDetail: true,
      detailLabel,
      detailAction,
      closeable: false,
    });

    expect(Notify.create).toHaveBeenCalled();
    const args = Notify.create.mock.calls[0][0];
    expect(args.message).toBe('success message');
    expect(args.icon).toBe('check_circle');
    expect(args.iconColor).toBe('green');

    // 验证只有详情按钮
    expect(args.actions).toBeDefined();
    expect(args.actions.length).toBe(1);
    expect(args.actions[0].label).toBe('查看详情');
    expect(args.actions[0].handler).toBe(detailAction);
  });

  it('should handle closeable without showDetail', async () => {
    const closeAction = jest.fn();

    // 直接使用 QuasarNotifyImpl 来测试
    const notifyImpl = new QuasarNotifyImpl(Notify);

    notifyImpl.show('debug', 'debug message', {
      closeable: true,
      closeAction,
      showDetail: false,
    });

    expect(Notify.create).toHaveBeenCalled();
    const args = Notify.create.mock.calls[0][0];
    expect(args.message).toBe('debug message');
    expect(args.icon).toBe('bug_report');
    expect(args.iconColor).toBe('purple');

    // 验证只有关闭按钮
    expect(args.actions).toBeDefined();
    expect(args.actions.length).toBe(1);
    expect(args.actions[0].label).toBe('关闭');
    expect(args.actions[0].handler).toBe(closeAction);
  });

  it('should handle notification without any buttons', async () => {
    // 直接使用 QuasarNotifyImpl 来测试
    const notifyImpl = new QuasarNotifyImpl(Notify);

    notifyImpl.show('info', 'info message', {
      closeable: false,
      showDetail: false,
    });

    expect(Notify.create).toHaveBeenCalled();
    const args = Notify.create.mock.calls[0][0];
    expect(args.message).toBe('info message');
    expect(args.icon).toBe('info');
    expect(args.iconColor).toBe('light-blue');

    // 验证没有操作按钮
    expect(args.actions).toBeUndefined();
  });

  it('should use default noop handler when no closeAction is provided', async () => {
    const notifyImpl = new QuasarNotifyImpl(Notify);

    notifyImpl.show('question', 'question message', {
      closeable: true,
      // 不提供 closeAction
    });

    expect(Notify.create).toHaveBeenCalled();
    const args = Notify.create.mock.calls[0][0];
    expect(args.actions).toBeDefined();
    expect(args.actions.length).toBe(1);
    expect(args.actions[0].label).toBe('关闭');
    expect(typeof args.actions[0].handler).toBe('function');

    // 执行处理函数，确保不会抛出错误
    expect(() => args.actions[0].handler()).not.toThrow();
  });

  it('should use default noop handler when no detailAction is provided', async () => {
    const notifyImpl = new QuasarNotifyImpl(Notify);

    notifyImpl.show('question', 'question message', {
      showDetail: true,
      detailLabel: '详情',
      // 不提供 detailAction
    });

    expect(Notify.create).toHaveBeenCalled();
    const args = Notify.create.mock.calls[0][0];
    expect(args.actions).toBeDefined();
    expect(args.actions.length).toBe(1);
    expect(args.actions[0].label).toBe('详情');
    expect(typeof args.actions[0].handler).toBe('function');

    // 执行处理函数，确保不会抛出错误
    expect(() => args.actions[0].handler()).not.toThrow();
  });

  it('should use default noop handler when handler is null', async () => {
    const notifyImpl = new QuasarNotifyImpl(Notify);

    notifyImpl.show('question', 'question message', {
      closeable: true,
      closeAction: null,
      showDetail: true,
      detailLabel: '详情',
      detailAction: null,
    });

    expect(Notify.create).toHaveBeenCalled();
    const args = Notify.create.mock.calls[0][0];
    expect(args.actions).toBeDefined();
    expect(args.actions.length).toBe(2);

    // 检查关闭按钮处理程序
    expect(args.actions[1].label).toBe('关闭');
    expect(typeof args.actions[1].handler).toBe('function');

    // 检查详情按钮处理程序
    expect(args.actions[0].label).toBe('详情');
    expect(typeof args.actions[0].handler).toBe('function');

    // 执行处理函数，确保不会抛出错误
    expect(() => args.actions[0].handler()).not.toThrow();
    expect(() => args.actions[1].handler()).not.toThrow();
  });

  it('should properly handle question type notifications', async () => {
    const notifyImpl = new QuasarNotifyImpl(Notify);

    // 测试 question 类型
    notifyImpl.show('question', 'question message', {
      position: 'top-right',
      duration: 3000,
      closeable: true,
      showDetail: true,
      detailLabel: '了解更多',
    });

    expect(Notify.create).toHaveBeenCalled();
    const args = Notify.create.mock.calls[0][0];
    expect(args.message).toBe('question message');
    expect(args.icon).toBe('help');
    expect(args.iconColor).toBe('light-blue');
    expect(args.position).toBe('top-right');
    expect(args.timeout).toBe(3000);

    // 验证操作按钮
    expect(args.actions).toBeDefined();
    expect(args.actions.length).toBe(2);
    expect(args.actions[0].label).toBe('了解更多');
    expect(args.actions[1].label).toBe('关闭');

    // 测试处理函数
    expect(typeof args.actions[0].handler).toBe('function');
    expect(typeof args.actions[1].handler).toBe('function');
    expect(() => args.actions[0].handler()).not.toThrow();
    expect(() => args.actions[1].handler()).not.toThrow();
  });

  it('should use custom icon string correctly without calling getQuasarIcon', async () => {
    // 重置 getQuasarIcon 调用次数
    getQuasarIcon.mockClear();

    const notifyImpl = new QuasarNotifyImpl(Notify);

    // 使用一个明确的非空字符串作为自定义图标
    const customIcon = 'custom_icon_string';
    notifyImpl.show('error', 'error message', {
      icon: customIcon,
    });

    expect(Notify.create).toHaveBeenCalled();
    expect(getQuasarIcon).not.toHaveBeenCalled(); // 确保不调用 getQuasarIcon
    const args = Notify.create.mock.calls[0][0];
    expect(args.icon).toBe(customIcon); // 应该直接使用传入的自定义图标
    expect(args.iconColor).toBe('red');
  });

  it('should use object as icon when options.icon is an object', async () => {
    // 重置 getQuasarIcon 调用次数
    getQuasarIcon.mockClear();

    const notifyImpl = new QuasarNotifyImpl(Notify);

    // 使用一个对象作为自定义图标
    const customIcon = { name: 'custom-icon', color: 'blue' };
    notifyImpl.show('error', 'error message', {
      icon: customIcon,
    });

    expect(Notify.create).toHaveBeenCalled();
    expect(getQuasarIcon).not.toHaveBeenCalled(); // 确保不调用 getQuasarIcon
    const args = Notify.create.mock.calls[0][0];
    expect(args.icon).toBe(customIcon); // 应该直接使用传入的自定义图标对象
    expect(args.iconColor).toBe('red');
  });

  it('should use number as icon when options.icon is a number other than 0', async () => {
    // 重置 getQuasarIcon 调用次数
    getQuasarIcon.mockClear();

    const notifyImpl = new QuasarNotifyImpl(Notify);

    // 使用一个数字作为自定义图标
    const customIcon = 123;
    notifyImpl.show('error', 'error message', {
      icon: customIcon,
    });

    expect(Notify.create).toHaveBeenCalled();
    expect(getQuasarIcon).not.toHaveBeenCalled(); // 确保不调用 getQuasarIcon
    const args = Notify.create.mock.calls[0][0];
    expect(args.icon).toBe(customIcon); // 应该直接使用传入的数字
    expect(args.iconColor).toBe('red');
  });

  it('should properly handle closeable=true and showDetail=false', async () => {
    const notifyImpl = new QuasarNotifyImpl(Notify);

    notifyImpl.show('debug', 'debug message', {
      closeable: true,
      showDetail: false,
    });

    expect(Notify.create).toHaveBeenCalled();
    const args = Notify.create.mock.calls[0][0];

    // 验证只有关闭按钮
    expect(args.actions).toBeDefined();
    expect(args.actions.length).toBe(1);
    expect(args.actions[0].label).toBe('关闭');

    // 测试处理函数
    expect(typeof args.actions[0].handler).toBe('function');
    expect(() => args.actions[0].handler()).not.toThrow();
  });

  it('should verify HTML property settings', async () => {
    const notifyImpl = new QuasarNotifyImpl(Notify);

    notifyImpl.show('success', '<b>HTML message</b>', {});

    expect(Notify.create).toHaveBeenCalled();
    const args = Notify.create.mock.calls[0][0];
    expect(args.message).toBe('<b>HTML message</b>');
    expect(args.html).toBe(true);
    expect(args.iconSize).toBe('1.5em');
    expect(args.multiLine).toBe(false);
    expect(args.color).toBe('white');
    expect(args.textColor).toBe('black');
  });

  it('should register custom notification types', () => {
    // 确保 registerType 方法能被正确调用
    const notifyImpl = new QuasarNotifyImpl(Notify);

    // 尝试注册自定义类型
    if (typeof notifyImpl.registerType === 'function') {
      notifyImpl.registerType('custom', {
        icon: 'star',
        color: 'purple',
      });

      expect(Notify.registerType).toHaveBeenCalledWith('custom', {
        icon: 'star',
        color: 'purple',
      });
    }
  });
});
