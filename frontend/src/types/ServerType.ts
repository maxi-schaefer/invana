export default interface ServerType {
    id: number; // TODO: Change to string if using UUIDs
    name: string;
    hostname: string;
    ip: string;
    environment: string;
    os: string;
    status: "online" | "offline" | "maintenance";
    services: number;
    lastCheck: string;
}