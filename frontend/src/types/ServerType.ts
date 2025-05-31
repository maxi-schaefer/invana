export default interface ServerType {
    id: string;
    name: string;
    hostname: string;
    ip: string;
    environment: string;
    os: string;
    status: "CONNECTED" | "DISCONNECTED" | "UNAUTHORIZED" | "PENDING";
    services: number;
    lastSeen: string;
}