import React, { memo, useRef, useEffect, useState } from 'react';

import { PageData } from 'containers/FlowPage/data';
import { CreativeItem } from 'utils/types/strapi/CreativeItem';

import { Wrapper } from './styled/Wrapper';
import { RendererWrapper } from './styled/RendererWrapper';
import { Cover } from './styled/Cover';
import { FlowPageContentComp } from './styled/FlowPageContentComp';
import { FlowPageContentWrapper } from './styled/FlowPageContentWrapper';

interface FlowAppProps {
  pageData: PageData;
}

export interface FlowItem {
  refEl: HTMLDivElement;
  flowItem: CreativeItem;
}

export type UpdateFlowItemsArray = (FlowItem) => void;

export const FlowApp = memo<FlowAppProps>(props => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasWrapperRef = useRef<HTMLDivElement>(null);
  const scrollWrapper = useRef<HTMLDivElement>(null);

  const flowItemsArray = useRef<FlowItem[]>([]);

  const refsToOffset = useRef<HTMLDivElement[]>([]);
  const stickyRef = useRef<HTMLDivElement>(null);

  const updateStickyRef = item => {
    stickyRef.current = item;
  };

  const updateFlowItemsArray = itemObj => {
    flowItemsArray.current = flowItemsArray.current.concat(itemObj);
  };

  const updateRefsToOffset = itemObj => {
    refsToOffset.current = refsToOffset.current.concat(itemObj);
  };

  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const { app } = require('./functions/app');
    const { destroy, init } = app({
      canvasRefEl: canvasRef.current,
      canvasWrapperRefEl: canvasWrapperRef.current,
      scrollWrapperRefEl: scrollWrapper.current,
      setIsReady,
      flowItemsArray: flowItemsArray.current,
      refsToOffset: refsToOffset.current,
      stickyRef: stickyRef.current,
    });

    init();

    return () => {
      destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Wrapper>
        <Cover animate={isReady ? 'animate' : 'initial'} />
        <FlowPageContentWrapper ref={scrollWrapper}>
          <FlowPageContentComp
            updateStickyRef={updateStickyRef}
            updateRefsToOffset={updateRefsToOffset}
            updateFlowItemsArray={updateFlowItemsArray}
            pageData={props.pageData}
          />
        </FlowPageContentWrapper>

        <RendererWrapper ref={canvasWrapperRef}>
          <canvas ref={canvasRef} />
        </RendererWrapper>
      </Wrapper>
    </>
  );
});

FlowApp.displayName = 'FlowApp';
