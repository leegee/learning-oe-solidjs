import packageJson from '../../package.json';
const homepage = packageJson.homepage || "/";

export const useAppPath = () => {
    return homepage ? (new URL(homepage)).pathname.replace(/\/?$/, '') : '/';
};
