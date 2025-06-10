export interface VersionHistory {
  agent: {
    id: string;
    name: string;
    hostname: string;
    createdAt: string; // ISO 8601 timestamp
    environment: string;
    ip: string;
    lastSeen: string; // ISO 8601 timestamp
    os: string;
    services: number;
    status: string;
    version: string;
  };
  changeType: string;
  currentVersion: string;
  id: string;
  previousVersion: string | null;
  service: string;
  status: string;
  timestamp: string; // ISO 8601 timestamp
}
