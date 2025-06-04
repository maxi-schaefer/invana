import { useState, type ChangeEvent } from 'react'
import { Input } from './input'
import { Button } from './button'
import { Eye, EyeOff } from 'lucide-react'

export default function PasswordInput({ password, onChange, id, name, placeholder }: { password: string, onChange: (e: ChangeEvent<HTMLInputElement>) => void, id?: string, name?: string, placeholder?: string }) {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="relative">
            <Input
                id={id}
                name={name}
                type={showPassword ? "text" : "password"}
                placeholder={placeholder ? placeholder : "•••••••••••••"}
                value={password}
                onChange={onChange}
                required
                className="h-11 pr-10"
            />
            <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
            >
                {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                )}
            </Button>
        </div>
    )
}
