import styles from './TopBar.module.css';

export default function TopBar() {
    return (
        <div className={styles.topbar}>
            <div className={styles.tabs}>
                <span className={styles.tab}>Following</span>
                <span className={`${styles.tab} ${styles.active}`}>For You</span>
            </div>
        </div>
    );
}
