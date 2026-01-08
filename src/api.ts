import PageList, { type PaginationParams } from "./entity/page_list";
import type Paste from "./entity/paste";
import PasteModel from "./entity/paste_model";
import PasteSummary from "./entity/paste_summary"
import Result from "./entity/result"

const baseUrl = import.meta.env.VITE_BASE_URL;

const getHeader = () => {
    const header = new Headers();
    const ac = auth.getAuth();
    if (ac?.type === "basic" && ac.auth) {
        header.append("authorization", ac.auth);
    }
    return header;
}

const getJsonHeader = () => {
    const header = getHeader();
    header.append("Content-Type", "application/json");
    return header;
}

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
    try {
        const params = new URLSearchParams({
            page_no: query.page_no.toString(),
            page_size: query.page_size.toString()
        });
        const response = await fetch(`${baseUrl}/paste?${params}`, { headers: getHeader() });
    
        const json = await response.json();
        const result = Result.fromJSON<PageList<PasteSummary>>(json, (data) => {
            return new PageList(data);
        });
    
        if (result.code !== 200) {
            throw new Error(result.message || "Unknown Error")
        }
        return result.data || new PageList();
    } catch (e: any) {
        if (e.message === "Failed to fetch") {
            throw new Error("401 Unauthorized");
        }
        throw e;
    }
};

export const createNewPasteWithoutFile = async (
    paste: Paste
): Promise<PasteModel> => {
    try {
        const response = await fetch(`${baseUrl}/paste`, {
            method: "POST",
            headers: getJsonHeader(),
            body: JSON.stringify(paste)
        });
    
        return await response2PasteModel(response);
    } catch (e: any) {
        if (e.message === "Failed to fetch") {
            throw new Error("401 Unauthorized");
        }
        throw e;
    }
};

export const createNewPasteWithFile = async (
    body: FormData
): Promise<PasteModel> => {
    try {
        const response = await fetch(`${baseUrl}/paste`, {
            method: "POST",
            body: body,
            headers: getHeader()
        });
        return await response2PasteModel(response);
    } catch (e: any) {
        if (e.message === "Failed to fetch") {
            throw new Error("401 Unauthorized");
        }
        throw e;
    }
};

export const getUnlockedPaste = async (
    name: string
): Promise<PasteModel> => {
    try{
        const response = await fetch(`${baseUrl}/paste/${name}`, { headers: getHeader() });
        return await response2PasteModel(response);
    } catch (e: any) {
        if (e.message === "Failed to fetch") {
            throw new Error("401 Unauthorized");
        }
        throw e;
    }
}

export const getLockedPaste = async (
    name: string,
    password: string
): Promise<PasteModel> => {
    try {
        const response = await fetch(`${baseUrl}/paste/${name}`, {
            method: "POST",
            headers: getJsonHeader(),
            body: JSON.stringify({
                password: password
            })
        });
    
        return await response2PasteModel(response);
    } catch (e: any) {
        if (e.message === "Failed to fetch") {
            throw new Error("401 Unauthorized");
        }
        throw e;
    }
}

export const updatePasteWithoutFile = async (
    paste: Paste
): Promise<PasteModel> => {
    try {
        if (paste.name === undefined || paste.name === "") {
            throw new Error("name cannot be empty");
        }
        const response = await fetch(`${baseUrl}/paste/${paste.name}`, {
            method: "PUT",
            headers: getJsonHeader(),
            body: JSON.stringify(paste)
        });
    
        return await response2PasteModel(response);
    } catch (e: any) {
        if (e.message === "Failed to fetch") {
            throw new Error("401 Unauthorized");
        }
        throw e;
    }
};

export const updatePasteWithFile = async (
    paste: Paste,
    body: FormData
): Promise<PasteModel> => {
    try {
        if (paste.name === undefined || paste.name === "") {
            throw new Error("name cannot be empty");
        }
        const response = await fetch(`${baseUrl}/paste/${paste.name}`, {
            method: "PUT",
            body: body,
            headers: getHeader()
        });
    
        return await response2PasteModel(response);
    } catch (e: any) {
        if (e.message === "Failed to fetch") {
            throw new Error("401 Unauthorized");
        }
        throw e;
    }
};

export const deleteUnlockedPaste = async (
    name: string
): Promise<Boolean> => {
    try {
        const response = await fetch(`${baseUrl}/paste/${name}`, {
            method: "DELETE",
            headers: getHeader(),
        });
    
        const json = await response.json();
        const result = Result.fromJSON<PasteModel>(json, (data) => {
            return new PasteModel(data);
        });
    
        if (result.code !== 200) {
            throw new Error(result.message || "Unknown Error")
        }
        return true;
    } catch (e: any) {
        if (e.message === "Failed to fetch") {
            throw new Error("401 Unauthorized");
        }
        throw e;
    }
}

export const deleteLockedPaste = async (
    name: string,
    password: string
): Promise<Boolean> => {
    try {
        const response = await fetch(`${baseUrl}/paste/${name}/delete`, {
            method: "POST",
            headers: getJsonHeader(),
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
    } catch (e: any) {
        if (e.message === "Failed to fetch") {
            throw new Error("401 Unauthorized");
        }
        throw e;
    }
}

export function downloadUrl(pasteName: string, filename: string) {
    return `${baseUrl}/paste/${pasteName}/file/name/${filename}`;
}

export const auth = {
    storeAuth(config: AuthConfig | null) {
        if (config === null) {
            localStorage.removeItem("auth");
        } else {
            localStorage.setItem("auth", JSON.stringify(config));
        }
    },

    getAuth() {
        const json = localStorage.getItem("auth");
        if (json) {
            return JSON.parse(json) as AuthConfig;
        }
        return null;
    }
};

export interface AuthConfig {
    type?: string,
    auth?: string
};