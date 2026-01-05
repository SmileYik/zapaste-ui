import PasteSummary from "../../entity/paste_summary";
import { MdElevation } from "../material";
import PaginationListHandler from "../pagination-list/pagination-list-handler";
import styles from './PasteSummaryPage.module.css';


export default class PasteSummaryPageHandler extends PaginationListHandler<PasteSummary> {
    override elementRender = (item: PasteSummary, index: number) => {
        return (
            <div className={styles["paste-summary-item"]}>
                <MdElevation></MdElevation>
                {item.name || "Unknown"}
            </div>
        );
    };

    override elementKey = (item: PasteSummary, index: number) => {
        return item.id?.toString() || item.name || index.toString();
    };
}