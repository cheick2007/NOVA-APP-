import styles from './ActionButtons.module.css';

export default function ActionButtons() {
    return (
        <div className={styles.container}>
            {/* Avatar */}
            <div className={styles.avatarContainer}>
                <div className={styles.avatar}></div>
                <div className={styles.plus}>+</div>
            </div>

            {/* Like */}
            <div className={styles.action}>
                <div className={styles.icon}>❤️</div>
                <span className={styles.count}>1.2K</span>
            </div>

            {/* Comment */}
            <div className={styles.action}>
                <div className={styles.icon}>💬</div>
                <span className={styles.count}>234</span>
            </div>

            {/* Share */}
            <div className={styles.action}>
                <div className={styles.icon}>↪️</div>
                <span className={styles.count}>56</span>
            </div>
        </div>
    );
}
