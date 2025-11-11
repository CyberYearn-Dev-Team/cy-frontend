"use client";

import { Suspense } from 'react';
import EmailVerificationClient from './EmailVerificationClient';
import { Skeleton } from '@/components/ui/skeleton';

export default function EmailVerificationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="w-full max-w-md p-8 space-y-4">
          <Skeleton className="h-12 w-12 mx-auto rounded-full" />
          <Skeleton className="h-8 w-64 mx-auto" />
          <Skeleton className="h-4 w-80 mx-auto" />
          <Skeleton className="h-10 w-full mt-4" />
        </div>
      </div>
    }>
      <EmailVerificationClient />
    </Suspense>
  );
}
