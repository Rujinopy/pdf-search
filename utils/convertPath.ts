//take \ and replace with /
export const convertPath = (path: string) => {
    return path.replace(/\\/g, '/');
};
