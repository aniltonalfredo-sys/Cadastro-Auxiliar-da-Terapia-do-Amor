import { useState, useRef } from "react";
import { Upload, X, User } from "lucide-react";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

interface PhotoUploadProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  placeholder?: string;
}

export function PhotoUpload({ label, value, onChange, placeholder = "Foto tipo passe" }: PhotoUploadProps) {
  const [preview, setPreview] = useState<string>(value);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert("Por favor, selecione apenas arquivos de imagem.");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("A imagem deve ter no máximo 5MB.");
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreview(result);
        onChange(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemove = () => {
    setPreview("");
    onChange("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-2">
      <label className="block">{label}</label>
      
      <div className="flex items-center gap-4">
        {/* Photo Preview */}
        <div className="relative">
          <Avatar className="w-24 h-24 border-2 border-gray-200">
            {preview ? (
              <AvatarImage src={preview} alt="Preview" className="object-cover" />
            ) : (
              <AvatarFallback className="bg-[#F7F8FA]">
                <User className="w-10 h-10 text-gray-400" />
              </AvatarFallback>
            )}
          </Avatar>
          
          {preview && (
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute -top-2 -right-2 w-6 h-6 rounded-full"
              onClick={handleRemove}
            >
              <X className="w-3 h-3" />
            </Button>
          )}
        </div>

        {/* Upload Button */}
        <div className="flex-1">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          
          <Button
            type="button"
            variant="outline"
            onClick={handleClick}
            className="w-full"
          >
            <Upload className="w-4 h-4 mr-2" />
            {preview ? "Alterar Foto" : "Carregar Foto"}
          </Button>
          
          <p className="text-xs text-gray-500 mt-2">
            {placeholder} • JPG, PNG • Máx 5MB
          </p>
        </div>
      </div>
    </div>
  );
}
