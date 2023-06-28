export interface ITreeNode {
  id: string;
  name: string;
  leaders?: Array<{
    name: string;
    avatar: string;
  }>;
  members?: Array<{
    name: string;
    avatar: string;
  }>;
  hasChildren?: boolean
  children?: ITreeNodes;
  _children?: ITreeNodes;
  depth?: number;
  x0?: number;
  y0?: number;
  x?: number;
  y?: number;
}

export type ITreeNodes = Array<ITreeNode>;

export type ITree = ITreeNode;

export type IGetTree = (node: ITreeNode) => Promise<ITreeNodes>;

export interface IOptions {
  animationDuration: number;
  nodeSpacing: number;
  backgroundColor: string;
  nodeWidth: number;
  nodeHeight: number;
  borderColor: string;
  borderRadius: number;
  lineHeight: number;
  lineOffsetY: number;
  lineColor: string;
  getTree: IGetTree;
}

export interface IRenderData {
  sourceNode?: any;
  tree: any;
  treeData: ITree;
  nodes?: Array<any>;
  links?: Array<any>;
}
