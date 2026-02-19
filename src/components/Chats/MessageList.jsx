import React, { useEffect, useMemo, useRef, useState } from 'react';
import MessageBubble from './MessageBubble';
import { resolveMessageGrouping } from './MessageGroupResolver';

const EST_BASE = 38;
const EST_LINE = 18;

const estimateHeight = (text) => {
  if (!text) return EST_BASE;
  const lines = Math.ceil(text.length / 28);
  return Math.max(EST_BASE, Math.min(420, EST_BASE + lines * EST_LINE));
};

const MessageList = ({ messages, highlightRanges = [], containerWidth }) => {
  const containerRef = useRef(null);
  const measureRootRef = useRef(null);
  const heightCacheRef = useRef(new Map());
  const pendingQueueRef = useRef([]);
  const [scrollTop, setScrollTop] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(600);
  const [version, setVersion] = useState(0);

  const grouping = useMemo(() => resolveMessageGrouping(messages), [messages]);

  const totalHeights = useMemo(() => {
    const cache = heightCacheRef.current;
    const heights = messages.map((msg) => cache.get(msg.id) ?? estimateHeight(msg.text));
    const offsets = [];
    let acc = 0;
    heights.forEach((h) => {
      offsets.push(acc);
      acc += h;
    });
    return { heights, offsets, total: acc };
  }, [messages, version]);

  useEffect(() => {
    if (!containerRef.current) return undefined;
    const onScroll = () => setScrollTop(containerRef.current.scrollTop);
    const onResize = () => setViewportHeight(containerRef.current.clientHeight);
    onResize();
    containerRef.current.addEventListener('scroll', onScroll);
    window.addEventListener('resize', onResize);
    return () => {
      containerRef.current?.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  useEffect(() => {
    const queue = pendingQueueRef.current;
    if (!queue.length) return undefined;
    let raf = null;

    const processQueue = () => {
      const batch = queue.splice(0, 20);
      if (!measureRootRef.current) return;
      batch.forEach((msg) => {
        const node = document.createElement('div');
        node.className = 'msg-measure';
        measureRootRef.current.appendChild(node);
        const temp = document.createElement('div');
        node.appendChild(temp);
        temp.innerHTML = msg.text || '';
        const height = node.offsetHeight;
        heightCacheRef.current.set(msg.id, height);
        measureRootRef.current.removeChild(node);
      });
      setVersion((v) => v + 1);
      if (queue.length) {
        raf = requestAnimationFrame(processQueue);
      }
    };

    raf = requestAnimationFrame(processQueue);
    return () => {
      if (raf) cancelAnimationFrame(raf);
    };
  }, [messages, containerWidth]);

  let startIndex = 0;
  for (let i = 0; i < totalHeights.offsets.length; i += 1) {
    if (totalHeights.offsets[i] + totalHeights.heights[i] >= scrollTop) {
      startIndex = Math.max(0, i - 5);
      break;
    }
  }
  const endIndex = Math.min(
    messages.length,
    startIndex + Math.ceil(viewportHeight / EST_BASE) + 10
  );

  const visible = messages.slice(startIndex, endIndex);

  useEffect(() => {
    const cache = heightCacheRef.current;
    const queue = pendingQueueRef.current;
    visible.forEach((msg) => {
      if (!cache.has(msg.id)) {
        queue.push(msg);
      }
    });
  }, [visible]);

  return (
    <div className="msg-list" ref={containerRef}>
      <div className="msg-spacer" style={{ height: totalHeights.total }} />
      <div className="msg-window" style={{ transform: `translateY(${totalHeights.offsets[startIndex] || 0}px)` }}>
      {visible.map((msg) => (
        <MessageBubble
          key={msg.id}
          message={msg}
          meta={grouping.get(msg.id)}
          senderName={msg.senderName}
          highlightRanges={highlightRanges}
        />
      ))}
      </div>
      <div className="msg-measure-root" ref={measureRootRef} />
    </div>
  );
};

export default MessageList;
