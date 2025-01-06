export interface Config {
    port: number;
    jwtSecret: string;
    relayUrl: string;
    relayUrls: string[];
    baseUrl: string;
    nodeEnv: string;
    logLevel: string;
    retryAttempts: number;
    retryDelay: number;
    isTest?: boolean;
    isProduction?: boolean;
}
export declare const loadEnvironment: () => Promise<void>;
export declare const getConfig: () => Config;
export declare const resetConfig: () => void;
//# sourceMappingURL=environment.d.ts.map