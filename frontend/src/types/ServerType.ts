export default interface ServerType {
    id: string;
    name: string;
    hostname: string;
    ip: string;
    environment: string;
    os: string;
    status: "connected" | "disconnected" | "unauthorized" | "PENDING";
    services: number;
    lastSeen: string;
}