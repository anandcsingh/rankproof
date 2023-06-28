import { ITreeNode } from '../types';

export function collapseNode(node: ITreeNode) {
  // Check if this node has children
  node._children = node.children;
  node.children = undefined;
}

export function expandNode(node: ITreeNode) {
  node.children = node._children;
}
