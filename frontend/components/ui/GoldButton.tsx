'use client';

import React from 'react';
import { Button, ButtonProps } from './Button';

export type GoldButtonProps = ButtonProps;

export function GoldButton({
  variant = 'primary',
  size = 'md',
  ...props
}: GoldButtonProps) {
  return <Button variant={variant} size={size} {...props} />;
}
