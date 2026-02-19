'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

export const useLangRouter = () => {
    const router = useRouter();
    const searchParams = useSearchParams();

    // SIMPLE SOURCE OF TRUTH: The URL.
    // If ?lang=en is present, it's 'en'. Otherwise default to 'uz'.
    const lang = searchParams.get('lang') === 'en' ? 'en' : 'uz';

    const push = useCallback((path: string) => {
        if (!path) return;

        const separator = path.includes('?') ? '&' : '?';

        if (path.includes('lang=')) {
            router.push(path);
        } else {
            router.push(`${path}${separator}lang=${lang}`);
        }
    }, [router, lang]);

    return { push, lang };
};
