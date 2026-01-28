'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Compass, Plus, MessageCircle, User } from 'lucide-react';
import styles from './Sidebar.module.css';

export default function Sidebar() {
    const pathname = usePathname();

    const isActive = (path: string) => pathname === path;

    return (
        <nav className={styles.sidebar}>
            <Link href="/" className={`${styles.navItem} ${isActive('/') ? styles.active : ''}`}>
                <Home className={styles.icon} />
                <span>Home</span>
            </Link>

            <Link href="/discover" className={`${styles.navItem} ${isActive('/discover') ? styles.active : ''}`}>
                <Compass className={styles.icon} />
                <span>Discover</span>
            </Link>

            {/* Custom "TikTok style" Add Button */}
            <Link href="/create" className={styles.navItem}>
                <div className={styles.uploadContainer}>
                    <div className={styles.uploadBackground}></div>
                    <div className={styles.uploadButton}>
                        <Plus className={styles.plusIcon} />
                    </div>
                </div>
            </Link>

            <Link href="/inbox" className={`${styles.navItem} ${isActive('/inbox') ? styles.active : ''}`}>
                <MessageCircle className={styles.icon} />
                <span>Inbox</span>
            </Link>

            <Link href="/profile" className={`${styles.navItem} ${isActive('/profile') ? styles.active : ''}`}>
                <User className={styles.icon} />
                <span>Profile</span>
            </Link>
        </nav>
    );
}
