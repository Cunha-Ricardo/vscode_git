
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ProfileType } from "@/data/mockData";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: ProfileType | null;
  onSave: (profile: ProfileType) => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ 
  isOpen, 
  onClose, 
  profile, 
  onSave 
}) => {
  const [name, setName] = useState("");
  const [permissions, setPermissions] = useState<string[]>([]);
  
  // Set initial values when editing an existing profile
  useEffect(() => {
    if (profile) {
      setName(profile.name);
      setPermissions(profile.permissions);
    } else {
      setName("");
      setPermissions([]);
    }
  }, [profile, isOpen]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      return; // Simple validation
    }
    
    const updatedProfile: ProfileType = {
      id: profile?.id || 0,
      name,
      count: profile?.count || 0,
      permissions
    };
    
    onSave(updatedProfile);
  };
  
  const permissionOptions = [
    { id: "downloads", label: "Downloads" },
    { id: "ratings", label: "Avaliações" },
    { id: "errors", label: "Erros" },
    { id: "feedbacks", label: "Feedbacks" },
    { id: "features", label: "Novas Funcionalidades" }
  ];
  
  const togglePermission = (permission: string) => {
    if (permissions.includes(permission)) {
      setPermissions(permissions.filter(p => p !== permission));
    } else {
      setPermissions([...permissions, permission]);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {profile ? "Editar Perfil" : "Novo Perfil"}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nome do perfil"
              required
            />
          </div>
          
          <div className="space-y-3">
            <Label>Permissões</Label>
            {permissionOptions.map((option) => (
              <div key={option.id} className="flex items-center space-x-2">
                <Checkbox
                  id={option.id}
                  checked={permissions.includes(option.id)}
                  onCheckedChange={() => togglePermission(option.id)}
                />
                <Label htmlFor={option.id} className="font-normal cursor-pointer">
                  {option.label}
                </Label>
              </div>
            ))}
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-primary">
              Salvar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileModal;
