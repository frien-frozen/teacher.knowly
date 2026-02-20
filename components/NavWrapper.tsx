'use client';

import { usePathname } from 'next/navigation';

const HIDDEN_ON = ['/apply', '/login'];

export default function NavWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const hide = HIDDEN_ON.some(p => pathname === p || pathname.startsWith(p + '/'));
    if (hide) return null;
    return <>{children}</>;
}
