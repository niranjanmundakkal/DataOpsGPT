import api from "./api";

export const getDashboardData = async () => {
    const response = await api.get("/dashboard/");
    return response.data;
};

export const getPipelines = async () => {
    const response = await api.get("/api/v1/pipelines");
    return response.data;
};
