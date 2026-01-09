import { useState } from "react";
import PasteEditor from "../../components/paste-editor/paste-editor";
import type PasteModel from "../../entity/paste_model";
import PatseModelDetail from "../../components/paste-model-detail/paste-model-detail";
import { downloadUrlWithPassword } from "../../api";

export default function NewPaste() {

    const [pasteModel, setPasteModel] = useState<PasteModel | undefined>();

    const onCreated = (model: PasteModel) => {
        setPasteModel(model);
    }

    return (
        <div>
            {pasteModel ? (
                <PatseModelDetail pasteModel={pasteModel} onDownloadFile={filename => {
                    downloadUrlWithPassword(pasteModel.paste?.name || "", pasteModel.paste?.password || "", filename)
                }}></PatseModelDetail>
            ) : (
                <PasteEditor onChange={onCreated}></PasteEditor>
            )}
        </div>
    );
}