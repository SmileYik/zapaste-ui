import PasteSummary from "../../entity/paste_summary";
import { calendar_today, lock, lock_open_right, visibility } from "../Icons";
import { MdElevation, MdIcon } from "../Material";
import PaginationListHandler from "../pagination-list/PaginationListHandler";
import styles from './PasteSummaryPage.module.css';


export default class PasteSummaryPageHandler extends PaginationListHandler<PasteSummary> {

    override skeletonRender = (item: PasteSummary, index: number) => {
        return (
            <div className={styles["paste-summary-item"]} style={{}}>
                <MdElevation></MdElevation>
                <div className={`${styles["skeleton-title"]} ${styles["skeleton"]}`}>
                </div>

                <div className={`${styles["skeleton-divider"]} ${styles["skeleton"]}`}></div>

                <div className={`${styles["skeleton-body"]} ${styles["skeleton"]}`}>
                </div>

                <div className={`${styles["skeleton-text"]} ${styles["skeleton"]}`}>
                    <div className={`${styles["info-item"]} ${styles["skeleton"]}`} style={{
                        position: "absolute",
                        left: "16px"
                    }}></div>
                    <div className={`${styles["info-item"]} ${styles["skeleton"]}`} style={{
                        position: "absolute",
                        right: "16px"
                    }}></div>
                </div>
            </div>
        );
    }

    override elementRender = (item: PasteSummary, _: number) => {
        const dateStr = new Date((item.create_at || 0) * 1000).toLocaleDateString();

        return (
            <div className={styles["paste-summary-item"]} style={{}}>
                <MdElevation></MdElevation>
                <div className={styles["card-header"]}>
                    <span className={styles["card-title"]}>{item.name}</span>
                    <MdIcon style={{ fontSize: '16px', color: 'var(--md-sys-color-outline)' }}>
                        {item.has_password ? lock : lock_open_right}
                    </MdIcon>
                </div>

                <div className={styles["divider"]}></div>

                <div className={styles["card-body"]}>
                    {item.read_only ? 
                        <span className={`${styles["tag"]} ${styles["tag-read-only"]}`}>只读</span> :
                        <span className={`${styles["tag"]} ${styles["tag-editable"]}`}>可写</span>
                    }
                    {item.expiration_at || 0 === 0 ?
                        <span className={`${styles["tag"]} ${styles["tag-permanet"]}`}>永久</span> :
                        <span className={`${styles["tag"]} ${styles["tag-expire"]}`}>限时</span>
                    }
                </div>

                <div className={styles["card-foot"]}>
                    <div className={styles["info-item"]} style={{
                        position: "absolute",
                        left: "16px",
                    }}>
                        <MdIcon>{visibility}</MdIcon>
                        <span>{item.read_count || 0} 次阅读</span>
                    </div>
                    <div className={styles["info-item"]} style={{
                        position: "absolute",
                        right: "16px"
                    }}>
                        <span>{dateStr}</span>
                        <MdIcon>{calendar_today}</MdIcon>
                    </div>
                </div>
            </div>
        );
    };

    override elementKey = (item: PasteSummary, index: number) => {
        return item.id?.toString() || item.name || index.toString();
    };
}