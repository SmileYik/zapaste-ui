import { useCallback } from "react";
import { fetchPublicPastes } from "../../api";
import PaginationList from "../../components/pagination-list";
import PasteSummaryPageHandler from "../../components/paste-summary-page/PasteSummaryPage";
import { generatePath, useNavigate } from "react-router";
import type PasteSummary from "../../entity/paste_summary";
import FloatPanel from "../../components/float-panel/float-panel";

export default function PasteList() {
    const navigate = useNavigate();
    const viewPaste = useCallback((item: PasteSummary) => {
        if (item.name) {
            const url = generatePath("/paste/view/:name", { name: item.name })
            navigate(url)
        }
    }, [])

    return (
        <FloatPanel>
            <PaginationList requestFn={fetchPublicPastes} handler={new PasteSummaryPageHandler()} onClick={viewPaste}></PaginationList>
        </FloatPanel>
    );
}