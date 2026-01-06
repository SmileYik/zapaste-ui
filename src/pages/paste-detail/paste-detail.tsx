import { solarizedLight as codeStyle } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { MdDivider, MdElevation, MdFilledTextField, MdOutlinedButton, MdOutlinedTextField } from "../../components/Material";
import type PasteModel from "../../entity/paste_model";
import styles from "./paste-detail.module.css"
import { LightAsync as SyntaxHighlighter } from 'react-syntax-highlighter';
import hljs from 'highlight.js';

export default function PatseDetail({
    pasteModel = {
        "paste": {
          "id": 14,
          "name": "waryid-goldcrest",
          "content": "string",
          "attachements": "8",
          "private": false,
          "has_password": false,
          "read_count": 8,
          "latest_read_at": 1767168862,
          "create_at": 1767149274,
          "profiles": "{}"
        },
        "files": [
          {
            "id": 8,
            "hash": "C83F15B0CAFC9CBBEC1AFB903D185F9FC6349B85F5963AD1055381CF00BDC2479D88D9BB5B9CFDFB410F0769E4AD4D57F53E392BE60478DB8D609E2496DEF25C",
            "filename": "引用里的视频.7z",
            "filesize": 5047348,
            "mimetype": "application/x-compressed"
          }
        ]
    } as PasteModel
}: PatseDetailProps) {

    const paste = pasteModel.paste || {};
    paste.content = `
.sticky-panel {
    position: sticky;
    top: 10px;
    z-index: 100;
}

.panel {
    position: relative;
    background-color: var(--md-sys-color-surface, #ffffff);
    border-radius: 25px;
    padding: 0px;

    width: 50%;
    height: 50px;
    margin: 20px auto;

    display: flex;
    justify-content: center;
    flex-direction: row;

    user-select: none;
    transition: all 200ms ease-in-out;
    --md-elevation-level: 2;
}

.is-sticky {
    --md-elevation-level: 4;
    transform: translateY(8px);
}

.panel-button {
    min-width: 0;
    padding: 0;
    margin: 0;
}

@media (max-width: 768px) {
    .panel {
        width: 100%;
        --md-elevation-level: 1; 
    }
}

.animated-button {
    animation: slide-in-fade 0.4s ease-out forwards;
    opacity: 0;
}

@keyframes slide-in-fade {
    from {
        opacity: 0;
        transform: translateY(-20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.attach-tab {
    overflow: hidden;
    transition: 
        flex-grow 400ms cubic-bezier(0.4, 0, 0.2, 1),
        opacity 300ms ease,
        transform 300ms ease;
    flex-basis: 0;
    min-width: 0;
}

.attach-active {
    flex-grow: 2;
    opacity: 1;
    transform: scale(1);
}

.attach-hidden {
    flex-grow: 0;
    opacity: 0;
    pointer-events: none;
    margin: 0;
}
`
    const files = pasteModel.files;

    const content = paste.content || "";
    const highliteResult = hljs.highlightAuto(content);
    const language = paste.content_type || highliteResult.language || "text"
    return (
        <div>
            <div className={styles["panel"]}>
                <MdElevation></MdElevation>
                <div className={styles["panel-header"]}>
                    <div className={styles["header-title"]}>
                        <span>{paste.name}</span>
                    </div>
                    <MdDivider/>
                </div>
                <div className={styles["panel-body"]}>
                    <div className={styles["content-body"]}>
                        <SyntaxHighlighter
                            language={language}
                            style={codeStyle}
                            showLineNumbers
                            customStyle={{
                                "borderRadius": "24px",
                                "minHeight": "350px",
                                "padding": "20px",
                                "margin": "16px"
                            }}
                            useInlineStyles
                        >
                            {content}
                        </SyntaxHighlighter>
                    </div>
                </div>
                <div>

                </div>
            </div>
        </div>
    )
}

interface PatseDetailProps {
    pasteModel?: PasteModel
}