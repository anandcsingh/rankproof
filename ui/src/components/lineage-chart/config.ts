import { IOptions } from './types';

export const defaultOptions: IOptions = {
  animationDuration: 300,
  backgroundColor: '#ffffff',
  nodeSpacing: 30,
  nodeHeight: 90,
  nodeWidth: 195,
  borderColor: '#4285f4',
  borderRadius: 4,
  lineHeight: 120,
  lineOffsetY: 8,
  lineColor: '#dddddd',
  getTree: (node) => Promise.resolve([])
};

export const baseCls = 'react-org-chart';
export const nodeCls = baseCls + '-node';
export const nodeNameCls = baseCls + '-name';
export const nodeLeadersCls = baseCls + '-leaders';
export const nodeMembersCls = baseCls + '-members';
export const nodeLinkCls = baseCls + '-link';
