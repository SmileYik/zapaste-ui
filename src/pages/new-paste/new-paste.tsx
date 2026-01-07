import { useState } from "react";
import PasteEditor from "../../components/paste-editor/paste-editor";
import type PasteModel from "../../entity/paste_model";
import PatseModelDetail from "../../components/paste-model-detail/paste-model-detail";

export default function NewPaste() {

    const [pasteModel, setPasteModel] = useState<PasteModel | undefined>();

    const onCreated = (model: PasteModel) => {
        setPasteModel(model);
    }

    return (
        <div>
            {pasteModel ? (
                <PatseModelDetail pasteModel={pasteModel}></PatseModelDetail>
            ) : (
                <PasteEditor onChange={onCreated}></PasteEditor>
            )}
        </div>
    );
}