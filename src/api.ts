import PageList, { type PaginationParams } from "./entity/page_list";
import type Paste from "./entity/paste";
import PasteModel from "./entity/paste_model";
import PasteSummary from "./entity/paste_summary"
import Result from "./entity/result"

const baseUrl = "http://localhost:3000/api"

const response2PasteModel = async (response: Response): Promise<PasteModel> => {
    const json = await response.json();
    const result = Result.fromJSON<PasteModel>(json, (data) => {
        return new PasteModel(data);
    });

    if (result.code !== 200) {
        throw new Error(result.message || "Unknown Error")
    }
    return result.data || new PasteModel();
}

export const fetchPublicPastes = async (
    query: PaginationParams
): Promise<PageList<PasteSummary>> => {
    const params = new URLSearchParams({
        page_no: query.page_no.toString(),
        page_size: query.page_size.toString()
    });
    const response = await fetch(`${baseUrl}/paste?${params}`);

    const json = await response.json();
    const result = Result.fromJSON<PageList<PasteSummary>>(json, (data) => {
        return new PageList(data);
    });

    if (result.code !== 200) {
        throw new Error(result.message || "Unknown Error")
    }
    return result.data || new PageList();
};

export const createNewPasteWithoutFile = async (
    paste: Paste
): Promise<PasteModel> => {
    const response = await fetch(`${baseUrl}/paste`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(paste)
    });

    return await response2PasteModel(response);
};

export const createNewPasteWithFile = async (
    body: FormData
): Promise<PasteModel> => {
    const response = await fetch(`${baseUrl}/paste`, {
        method: "POST",
        body: body
    });

    return await response2PasteModel(response);
};

export const getUnlockedPaste = async (
    name: string
): Promise<PasteModel> => {
    const response = await fetch(`${baseUrl}/paste/${name}`);

    return await response2PasteModel(response);
}

export const getLockedPaste = async (
    name: string,
    password: string
): Promise<PasteModel> => {
    const response = await fetch(`${baseUrl}/paste/${name}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            password: password
        })
    });

    return await response2PasteModel(response);
}

export const updatePasteWithoutFile = async (
    paste: Paste
): Promise<PasteModel> => {
    if (paste.name === undefined || paste.name === "") {
        throw new Error("name cannot be empty");
    }
    const response = await fetch(`${baseUrl}/paste/${paste.name}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(paste)
    });

    return await response2PasteModel(response);
};

export const updatePasteWithFile = async (
    paste: Paste,
    body: FormData
): Promise<PasteModel> => {
    if (paste.name === undefined || paste.name === "") {
        throw new Error("name cannot be empty");
    }
    const response = await fetch(`${baseUrl}/paste/${paste.name}`, {
        method: "PUT",
        body: body
    });

    return await response2PasteModel(response);
};

export const deleteUnlockedPaste = async (
    name: string
): Promise<Boolean> => {
    const response = await fetch(`${baseUrl}/paste/${name}`, {
        method: "DELETE"
    });

    const json = await response.json();
    const result = Result.fromJSON<PasteModel>(json, (data) => {
        return new PasteModel(data);
    });

    if (result.code !== 200) {
        throw new Error(result.message || "Unknown Error")
    }
    return true;
}

export const deleteLockedPaste = async (
    name: string,
    password: string
): Promise<Boolean> => {
    const response = await fetch(`${baseUrl}/paste/${name}/delete`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            password: password
        })
    });

    const json = await response.json();
    const result = Result.fromJSON<PasteModel>(json, (data) => {
        return new PasteModel(data);
    });

    if (result.code !== 200) {
        throw new Error(result.message || "Unknown Error")
    }
    return true;
}

export function downloadUrl(pasteName: string, filename: string) {
    return `${baseUrl}/paste/${pasteName}/file/name/${filename}`;
}