export type AgentSettings = {
    id: number;
    token: string;
    tlsRequired: boolean;
    collectionInterval: number;
    retryAttempts: number;
    timeout: number;
    detailedLogging: boolean;
    serverUrl: string;
    serverPort: number;
    customHeadersJson: string;
  };
  