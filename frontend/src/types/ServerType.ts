export default interface ServerType {
    id: string;
    name: string;
    hostname: string;
    ip: string;
    environment: string;
    os: string;
    status: "online" | "offline" | "maintenance";
    services: number;
    lastSeen: string;
}