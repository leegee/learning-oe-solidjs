import { createContext, useContext, JSX } from 'solid-js';
import { type Config } from '../lib/config';

interface IConfigContext {
    config: Config;
    isLoading: boolean;
}

interface IConfigProviderProps {
    config: Config;
    children: JSX.Element;
}

const ConfigContext = createContext<IConfigContext | undefined>(undefined);

export const ConfigProvider = (props: IConfigProviderProps) => {
    return (
        <ConfigContext.Provider value={{ config: props.config, isLoading: false }}>
            {props.children}
        </ConfigContext.Provider>
    );
};

export const useConfigContext = () => {
    const context = useContext(ConfigContext);
    if (!context) {
        throw new Error('useConfigContext must be used within ConfigProvider');
    }
    return context;
};
