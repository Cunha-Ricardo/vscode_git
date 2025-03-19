
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserType, ProfileType } from "@/data/mockData";

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserType | null;
  profiles: ProfileType[];
  onSave: (user: UserType) => void;
}

const UserModal: React.FC<UserModalProps> = ({ 
  isOpen, 
  onClose, 
  user, 
  profiles,
  onSave 
}) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profile, setProfile] = useState("");
  const [status, setStatus] = useState<"ATIVO" | "INATIVO">("ATIVO");
  
  // Set initial values when editing an existing user
  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setPassword(user.password);
      setProfile(user.profile);
      setStatus(user.status);
    } else {
      setName("");
      setEmail("");
      setPassword("");
      setProfile("");
      setStatus("ATIVO");
    }
  }, [user, isOpen]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !email.trim() || !password.trim() || !profile) {
      return; // Simple validation
    }
    
    const updatedUser: UserType = {
      id: user?.id || 0,
      name,
      email,
      password,
      profile,
      status
    };
    
    onSave(updatedUser);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {user ? "Editar Usuário" : "Novo Usuário"}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nome do usuário"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@exemplo.com"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={user ? "••••••••" : "Senha"}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="profile">Perfil</Label>
            <Select 
              value={profile} 
              onValueChange={setProfile}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um perfil" />
              </SelectTrigger>
              <SelectContent>
                {profiles.map((p) => (
                  <SelectItem key={p.id} value={p.name}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Status</Label>
            <RadioGroup value={status} onValueChange={(value) => setStatus(value as "ATIVO" | "INATIVO")}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="ATIVO" id="status-active" />
                <Label htmlFor="status-active" className="font-normal cursor-pointer">
                  Ativo
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="INATIVO" id="status-inactive" />
                <Label htmlFor="status-inactive" className="font-normal cursor-pointer">
                  Inativo
                </Label>
              </div>
            </RadioGroup>
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

export default UserModal;
