'use client';
import React from 'react';
import { SessionProvider } from 'next-auth/react';
import { Appbar } from '@/components/AppBar';

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <SessionProvider>
        <Appbar />
      {children}
    </SessionProvider>
  );
};