////////////////////////////////////////////////////////////////////////////////
//
//    Copyright (c) 2022 - 2024.
//    Haixing Hu, Qubit Co. Ltd.
//
//    All rights reserved.
//
////////////////////////////////////////////////////////////////////////////////
import {
  getCssColor,
  getFontAwesomeIcon,
  getBootstrapIcon,
  getMaterialSymbolIcon,
} from '@qubit-ltd/common-ui';
import getIconSetName from '../get-quasar-icon-set';

/**
 * 获取不同类型对话框对应的图标，以 HTML 代码形式表示。
 *
 * @param {string} type
 *     对话框类型。
 * @param {string|null} customIconClass
 *     可选的自定义图标CSS类名，如果提供则直接使用，否则使用默认逻辑。
 * @return {string}
 *     对应的图标，以 HTML 代码形式表示。
 */
function getHtmlIcon(type, customIconClass = null) {
  const color = getCssColor(type);
  // 如果提供了自定义图标CSS类，直接使用
  if (customIconClass) {
    return `<i class="${customIconClass}" style="font-size: 1.5em; color: ${color};"></i>`;
  }
  // 否则使用原有的自动选择逻辑
  const iconSet = getIconSetName();
  const baseMaterialStyle = "font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 48";
  switch (iconSet) {
    case 'fontawesome':
      return `<i class="${getFontAwesomeIcon(type)}" style="font-size: 1.5em; color: ${color};"></i>`;
    case 'bootstrap':
      return `<i class="${getBootstrapIcon(type)}" style="font-size: 1.5em; color: ${color};"></i>`;
    case 'material':
    default:
      return `<i class="material-symbols-rounded" style="${baseMaterialStyle}; font-size: 1.5em; color: ${color};">${getMaterialSymbolIcon(type)}</i>`;
  }
}

export default getHtmlIcon;
