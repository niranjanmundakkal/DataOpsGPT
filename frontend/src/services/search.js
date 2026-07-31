import api from "./api";

export const searchDoc = async (query) => {
    const response = await api.post("/search", {
        query,
    });
    return response.data;
};
