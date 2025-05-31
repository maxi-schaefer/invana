import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function ServerUrlInput({ settings, setSettings }: any) {
    const [error, setError] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const isValid = value.startsWith("http://") || value.startsWith("https://");

        if (!isValid) {
            setError("URL must start with http:// or https://");
        } else {
            setError("");
        }

        setSettings({ ...settings, serverUrl: value });
    };

    return (
        <div className="space-y-2">
            <Label htmlFor="server-url">Ivana Server URL</Label>
            <Input
                id="server-url"
                defaultValue={settings?.serverUrl}
                onChange={handleChange}
                className={error ? "border-red-500" : ""}
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
    );
}
