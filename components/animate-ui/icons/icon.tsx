'use client';

import * as React from 'react';
import { useAnimation, type Variants } from 'framer-motion';
import { useIsMobile } from '@/hooks/useIsMobile';

interface AnimateIconContextType {
  controls: ReturnType<typeof useAnimation>;
  isHovered: boolean;
}

const AnimateIconContext = React.createContext<AnimateIconContextType | null>(null);

export function useAnimateIconContext() {
  const context = React.useContext(AnimateIconContext);
  if (!context) {
    throw new Error('useAnimateIconContext must be used within an IconWrapper');
  }
  return context;
}

export interface IconProps<T extends string = string> {
  size?: number;
  variant?: T;
  className?: string;
}

interface IconWrapperProps<T extends string = string> extends IconProps<T> {
  icon: React.ComponentType<IconProps<T>>;
  onHoverStart?: () => void;
  onHoverEnd?: () => void;
  isHovered?: boolean;
}

export function IconWrapper<T extends string = string>({
  icon: Icon,
  onHoverStart,
  onHoverEnd,
  isHovered: externalIsHovered,
  ...props
}: IconWrapperProps<T>) {
  const controls = useAnimation();
  const [internalIsHovered, setInternalIsHovered] = React.useState(false);
  const isMobile = useIsMobile();

  const isHovered = externalIsHovered !== undefined ? externalIsHovered : internalIsHovered;

  React.useEffect(() => {
    if (isHovered) {
      controls.start('animate');
    } else {
      controls.start('initial');
    }
  }, [isHovered, controls]);

  const handleHoverStart = () => {
    // Skip hover interaction on mobile/tablet
    if (isMobile) return;
    setInternalIsHovered(true);
    onHoverStart?.();
  };

  const handleHoverEnd = () => {
    // Skip hover interaction on mobile/tablet
    if (isMobile) return;
    setInternalIsHovered(false);
    onHoverEnd?.();
  };

  return (
    <AnimateIconContext.Provider value={{ controls, isHovered }}>
      <span
        onMouseEnter={handleHoverStart}
        onMouseLeave={handleHoverEnd}
        style={{ display: 'inline-flex' }}
      >
        <Icon {...props} />
      </span>
    </AnimateIconContext.Provider>
  );
}

export function getVariants<T extends Record<string, Record<string, Variants>>>(
  animations: T,
  variant: keyof T = 'default' as keyof T
): Record<string, Variants> {
  return animations[variant] || animations.default;
}
