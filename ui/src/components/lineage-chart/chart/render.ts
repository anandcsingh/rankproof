import * as d3 from 'd3';
import { IOptions, IRenderData, ITreeNode } from '../types';
import {
  nodeCls,
  nodeNameCls,
  nodeLinkCls,
  nodeLeadersCls,
  nodeMembersCls
} from '../config';

import { collapseNode, expandNode } from './utils';

export default function render(
  svg,
  renderData: IRenderData,
  options: IOptions
) {
  const { tree, treeData, sourceNode } = renderData;
  const {
    animationDuration,
    lineHeight,
    lineColor,
    lineOffsetY,
    nodeWidth,
    nodeHeight,
    backgroundColor,
    borderColor,
    borderRadius,
    getTree
  } = options;

  const nodes = tree.nodes(treeData).reverse();
  const links = tree.links(nodes);

  nodes.forEach((d) => {
    d.y = d.depth * lineHeight;
    d.x0 = d.x;
    d.y0 = d.y;
  });

  renderData.nodes = nodes;
  renderData.links = links;

  const parentNode = sourceNode || treeData;

  // 渲染节点
  const node = svg
    .selectAll(`g.${nodeCls}`)
    .data(nodes.filter((d) => d.id), (d) => d.id);

  const nodeEnter = node
    .enter()
    .insert('g')
    .attr('class', nodeCls)
    .attr('transform', `translate(${parentNode.x0}, ${parentNode.y0})`);

  // 外框
  nodeEnter
    .append('rect')
    .attr('width', nodeWidth)
    .attr('height', nodeHeight)
    .attr('fill', backgroundColor)
    .attr('stroke', borderColor)
    .attr('rx', borderRadius)
    .attr('ry', borderRadius);

  const hasLeaders = (d) => (d.leaders || []).length > 0;

  // 左半边
  nodeEnter
    .append('rect')
    .attr('width', 65)
    .attr('height', nodeHeight)
    .attr('fill', (d) => (hasLeaders(d) ? borderColor : '#ebedf0'))
    .attr('opacity', (d) => (hasLeaders(d) ? 0.1 : 0.7))
    .attr('rx', borderRadius)
    .attr('ry', borderRadius);

  // 领导头像
  nodeEnter
    .append('image')
    .attr('xlink:href', (d) => (hasLeaders(d) ? d.leaders[0].avatar : ''))
    .attr('x', 15)
    .attr('y', 15)
    .attr('width', 35)
    .attr('height', 35)
    .attr('clip-path', 'url(#clip-avatar)');

  // 领导名称
  nodeEnter
    .append('text')
    .attr('class', nodeNameCls)
    .attr('x', 65 / 2)
    .attr('y', (d) => (hasLeaders(d) ? 58 + 6 : nodeHeight / 2))
    .attr('font-size', (d) => (hasLeaders(d) ? 12 : 56))
    .attr('fill', (d) => (hasLeaders(d) ? borderColor : '#c0c4cc'))
    .attr('text-anchor', 'middle')
    .attr('dominant-baseline', 'middle')
    .text((d) => ((d.leaders || []).length > 0 ? d.leaders[0].name : '?'));

  // 部门名称
  nodeEnter
    .append('text')
    .attr('class', nodeNameCls)
    .attr('text-anchor', 'start')
    .attr('x', 65 + 10)
    .attr('y', 12 + 15)
    .attr('font-size', 12)
    .attr('fill', '#333333')
    .text((d) => d.name);

  // 领导个数
  nodeEnter
    .append('text')
    .attr('class', nodeLeadersCls)
    .attr('text-anchor', 'start')
    .attr('x', 65 + 10)
    .attr('y', 12 + 60)
    .attr('font-size', 12)
    .attr('fill', '#999999')
    .text((d) => `领导:${(d.leaders || []).length}`);

  // 员工个数
  nodeEnter
    .append('text')
    .attr('class', nodeMembersCls)
    .attr('text-anchor', 'start')
    .attr('x', 65 + 65)
    .attr('y', 12 + 60)
    .attr('font-size', 12)
    .attr('fill', '#999999')
    .text((d) => `员工:${(d.members || []).length}`);

  node
    .transition()
    .duration(animationDuration)
    .attr('transform', (d) => `translate(${d.x}, ${d.y})`);
  node
    .exit()
    .transition()
    .duration(animationDuration)
    .attr('transform', (d) => `translate(${parentNode.x}, ${parentNode.y})`)
    .remove();

  // 渲染连线
  svg.select(`path.${nodeLinkCls}`).data(links, (d) => d.target.id);
  const link = svg
    .selectAll(`path.${nodeLinkCls}`)
    .data(links.filter((link) => link.source.id), (d) => d.target.id);
  const linear = d3.svg
    .line()
    .x((d) => d.x)
    .y((d) => d.y)
    .interpolate('linear');
  link
    .enter()
    .insert('path', 'g')
    .attr('class', nodeLinkCls)
    .attr('fill', 'none')
    .attr('stroke', lineColor)
    .attr('stroke-width', 1)
    .attr('d', (d) =>
      linear([
        {
          x: d.source.x0 + nodeWidth / 2,
          y: d.source.y0 + nodeHeight + 2
        },
        {
          x: d.source.x0 + nodeWidth / 2,
          y: d.source.y0 + nodeHeight + 2
        },
        {
          x: d.source.x0 + nodeWidth / 2,
          y: d.source.y0 + nodeHeight + 2
        },
        {
          x: d.source.x0 + nodeWidth / 2,
          y: d.source.y0 + nodeHeight + 2
        }
      ])
    );

  link.transition().duration(animationDuration).attr('d', (d) =>
    linear([
      {
        x: d.source.x + nodeWidth / 2,
        y: d.source.y + nodeHeight
      },
      {
        x: d.source.x + nodeWidth / 2,
        y: d.target.y - lineOffsetY
      },
      {
        x: d.target.x + nodeWidth / 2,
        y: d.target.y - lineOffsetY
      },
      {
        x: d.target.x + nodeWidth / 2,
        y: d.target.y
      }
    ])
  );

  link.exit().transition().duration(animationDuration).attr('d', (d) =>
    linear([
      {
        x: sourceNode.x + nodeWidth / 2,
        y: sourceNode.y + nodeHeight + 2
      },
      {
        x: sourceNode.x + nodeWidth / 2,
        y: sourceNode.y + nodeHeight + 2
      },
      {
        x: sourceNode.x + nodeWidth / 2,
        y: sourceNode.y + nodeHeight + 2
      },
      {
        x: sourceNode.x + nodeWidth / 2,
        y: sourceNode.y + nodeHeight + 2
      }
    ])
  );

  const toggler = nodeEnter
    .append('g')
    .attr('transform', `translate(${nodeWidth / 2}, ${nodeHeight + 5 + 7})`)
    .on('click', async (d: ITreeNode) => {
      renderData.sourceNode = d;

      if (!d.children && !d._children) {
        try {
          const children = await getTree(d);
          d.children = children;
        } catch (e) {
          d.children = [];
        }
      } else {
        if (d.children) {
          collapseNode(d);
        } else {
          expandNode(d);
        }
      }

      render(svg, renderData, options);
    });

  toggler
    .append('circle')
    .attr(
      'display',
      (d) => (d.hasChildren ? 'inherit' : 'none')
    )
    .attr('cx', 0)
    .attr('cy', 0)
    .attr('r', 7)
    .attr('cursor', 'pointer')
    .attr('fill', '#ffffff')
    .attr('stroke', lineColor)
    .attr('stroke-width', 1)
    .on('mouseenter', function() {
      d3
        // @ts-ignore
        .select(this)
        .transition()
        .duration(animationDuration)
        .attr('stroke', borderColor);
    })
    .on('mouseout', function() {
      d3
        // @ts-ignore
        .select(this)
        .transition()
        .duration(animationDuration)
        .attr('stroke', lineColor);
    });
}
