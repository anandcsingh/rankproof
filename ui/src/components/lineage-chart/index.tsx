import React, { useRef, useEffect } from 'react';

import classnames from 'classnames';
import { ITree, IGetTree, IOptions } from './types';

import { defaultOptions, baseCls } from './config';
import { init } from './chart';

export interface IProps {
  className?: string;
  height?: string | number;
  style?: React.CSSProperties;
  data: ITree;
  getChildren?: IGetTree;
}

export function buildReactOrgChart(options: IOptions) {
  return (props) => {
    const { className, style, height = 400, data, getChildren } = props;
    const ref = useRef<any>();
    useEffect(() => {
      init(
        ref.current,
        data,
        Object.assign({}, options, {
          getTree: getChildren
        })
      );
    }, []);

    return (
      <div className={classnames(baseCls, className)} style={style}>
        <svg 
          xmlnsXlink="http://www.w3.org/1999/xlink" 
          xmlns='http://www.w3.org/2000/svg' 
          ref={ref} 
          width="100%" 
          height={height} 
        />
      </div>
    );
  };
}

const ReactOrgChart = buildReactOrgChart(defaultOptions);

export default ReactOrgChart;
