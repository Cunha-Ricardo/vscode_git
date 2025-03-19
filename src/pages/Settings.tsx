
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash } from "lucide-react";
import ProfileModal from "@/components/modals/ProfileModal";
import UserModal from "@/components/modals/UserModal";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { profiles as initialProfiles, users as initialUsers, ProfileType, UserType } from "@/data/mockData";
import { toast } from "sonner";

const Settings = () => {
  const { isAuthenticated, user, logout, updateUsers, updateProfiles } = useAuth();
  const navigate = useNavigate();
  const isAdmin = user?.profile === "Admin";
  const isHR = user?.profile === "Recursos Humanos";

  const [profiles, setProfiles] = useState<ProfileType[]>([]);
  const [users, setUsers] = useState<UserType[]>([]);
  
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const [currentProfile, setCurrentProfile] = useState<ProfileType | null>(null);
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [itemToDelete, setItemToDelete] = useState<{ type: 'profile' | 'user', id: number } | null>(null);

  // Load data from localStorage on mount
  useEffect(() => {
    const storedProfiles = localStorage.getItem("profiles");
    const storedUsers = localStorage.getItem("users");
    
    if (storedProfiles) {
      setProfiles(JSON.parse(storedProfiles));
    } else {
      setProfiles(initialProfiles);
      localStorage.setItem("profiles", JSON.stringify(initialProfiles));
    }
    
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers));
    } else {
      setUsers(initialUsers);
      localStorage.setItem("users", JSON.stringify(initialUsers));
    }
  }, []);

  // Protected route - redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  // Profile handlers
  const handleAddProfile = () => {
    setCurrentProfile(null);
    setIsProfileModalOpen(true);
  };

  const handleEditProfile = (profile: ProfileType) => {
    setCurrentProfile(profile);
    setIsProfileModalOpen(true);
  };

  const handleDeleteProfile = (id: number) => {
    setItemToDelete({ type: 'profile', id });
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteItem = () => {
    if (!itemToDelete) return;
    
    if (itemToDelete.type === 'profile') {
      // Check if profile is in use
      const profileInUse = users.some(u => {
        const profile = profiles.find(p => p.id === itemToDelete.id);
        return profile && u.profile === profile.name;
      });
      
      if (profileInUse) {
        toast.error("Não é possível excluir um perfil que está em uso");
      } else {
        const updatedProfiles = profiles.filter(p => p.id !== itemToDelete.id);
        setProfiles(updatedProfiles);
        updateProfiles(updatedProfiles);
        toast.success("Perfil excluído com sucesso");
      }
    } else {
      const updatedUsers = users.filter(u => u.id !== itemToDelete.id);
      setUsers(updatedUsers);
      updateUsers(updatedUsers);
      toast.success("Usuário excluído com sucesso");
    }
    
    setIsDeleteDialogOpen(false);
    setItemToDelete(null);
  };

  const saveProfile = (profile: ProfileType) => {
    let updatedProfiles: ProfileType[];
    
    if (profile.id) {
      // Edit existing profile
      updatedProfiles = profiles.map(p => p.id === profile.id ? profile : p);
      toast.success("Perfil atualizado com sucesso");
    } else {
      // Add new profile
      const newProfile = {
        ...profile,
        id: Math.max(0, ...profiles.map(p => p.id)) + 1,
        count: 0
      };
      updatedProfiles = [...profiles, newProfile];
      toast.success("Perfil criado com sucesso");
    }
    
    setProfiles(updatedProfiles);
    updateProfiles(updatedProfiles);
    setIsProfileModalOpen(false);
  };

  // User handlers
  const handleAddUser = () => {
    setCurrentUser(null);
    setIsUserModalOpen(true);
  };

  const handleEditUser = (userData: UserType) => {
    setCurrentUser(userData);
    setIsUserModalOpen(true);
  };

  const handleDeleteUser = (id: number) => {
    setItemToDelete({ type: 'user', id });
    setIsDeleteDialogOpen(true);
  };

  const saveUser = (userData: UserType) => {
    let updatedUsers: UserType[];
    
    if (userData.id) {
      // Edit existing user
      updatedUsers = users.map(u => u.id === userData.id ? userData : u);
      toast.success("Usuário atualizado com sucesso");
      
      // If current user is editing their own profile, logout to apply changes
      if (user && userData.id === user.id && (userData.status === "INATIVO" || userData.profile !== user.profile)) {
        updateUsers(updatedUsers);
        logout();
        navigate("/login");
        toast.info("Suas informações foram alteradas. Por favor, faça login novamente.");
        return;
      }
    } else {
      // Add new user
      const newUser = {
        ...userData,
        id: Math.max(0, ...users.map(u => u.id)) + 1
      };
      updatedUsers = [...users, newUser];
      toast.success("Usuário criado com sucesso");
      
      // Update profile count
      const profileName = userData.profile;
      const updatedProfiles = profiles.map(p => 
        p.name === profileName ? { ...p, count: p.count + 1 } : p
      );
      setProfiles(updatedProfiles);
      updateProfiles(updatedProfiles);
    }
    
    setUsers(updatedUsers);
    updateUsers(updatedUsers);
    setIsUserModalOpen(false);
  };

  // Check if user has permission to add/edit profiles or users
  const hasPermission = isAdmin || isHR;

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Configurações" />
        
        <main className="flex-1 overflow-auto p-6">
          <div className="animate-fade-in">
            <Tabs defaultValue="profiles" className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="profiles">Perfis</TabsTrigger>
                <TabsTrigger value="users">Usuários</TabsTrigger>
              </TabsList>
              
              <TabsContent value="profiles" className="space-y-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Perfis</CardTitle>
                    {hasPermission && (
                      <Button onClick={handleAddProfile} size="sm" className="gap-1">
                        <Plus className="h-4 w-4" />
                      </Button>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                          <tr>
                            <th className="px-6 py-3">Nome</th>
                            <th className="px-6 py-3">Quantidade De Usuários</th>
                            <th className="px-6 py-3">Permissões</th>
                            <th className="px-6 py-3">Ações</th>
                          </tr>
                        </thead>
                        <tbody>
                          {profiles.map((profile) => (
                            <tr key={profile.id} className="bg-white border-b hover:bg-gray-50">
                              <td className="px-6 py-4 font-medium text-gray-900">{profile.name}</td>
                              <td className="px-6 py-4">{profile.count}</td>
                              <td className="px-6 py-4">
                                <div className="flex flex-wrap gap-1">
                                  {profile.name === "Admin" ? (
                                    <Badge>Tudo</Badge>
                                  ) : (
                                    profile.permissions.map((permission) => (
                                      <Badge key={permission} variant="secondary" className="capitalize">
                                        {permission === "downloads" && "Downloads"}
                                        {permission === "ratings" && "Avaliações"}
                                        {permission === "errors" && "Erros"}
                                        {permission === "feedbacks" && "Feedbacks"}
                                        {permission === "features" && "Novas Funcionalidades"}
                                      </Badge>
                                    ))
                                  )}
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                {hasPermission && (
                                  <div className="flex space-x-2">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleEditProfile(profile)}
                                    >
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                    {profile.name !== "Admin" && (
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleDeleteProfile(profile.id)}
                                      >
                                        <Trash className="h-4 w-4" />
                                      </Button>
                                    )}
                                  </div>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="users" className="space-y-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Usuários</CardTitle>
                    {hasPermission && (
                      <Button onClick={handleAddUser} size="sm" className="gap-1">
                        <Plus className="h-4 w-4" />
                      </Button>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                          <tr>
                            <th className="px-6 py-3">Nome</th>
                            <th className="px-6 py-3">Email</th>
                            <th className="px-6 py-3">Perfil</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3">Ações</th>
                          </tr>
                        </thead>
                        <tbody>
                          {users.map((userData) => (
                            <tr key={userData.id} className="bg-white border-b hover:bg-gray-50">
                              <td className="px-6 py-4 font-medium text-gray-900">{userData.name}</td>
                              <td className="px-6 py-4">{userData.email}</td>
                              <td className="px-6 py-4">{userData.profile}</td>
                              <td className="px-6 py-4">
                                <Badge variant={userData.status === "ATIVO" ? "default" : "destructive"} className="status-badge">
                                  {userData.status}
                                </Badge>
                              </td>
                              <td className="px-6 py-4">
                                {hasPermission && (
                                  <div className="flex space-x-2">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleEditUser(userData)}
                                    >
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleDeleteUser(userData.id)}
                                    >
                                      <Trash className="h-4 w-4" />
                                    </Button>
                                  </div>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>

      {/* Profile Modal */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        profile={currentProfile}
        onSave={saveProfile}
      />

      {/* User Modal */}
      <UserModal
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        user={currentUser}
        profiles={profiles}
        onSave={saveUser}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmação</AlertDialogTitle>
            <AlertDialogDescription>
              {itemToDelete?.type === 'profile'
                ? "Tem certeza que deseja excluir este perfil? Esta ação não pode ser desfeita."
                : "Tem certeza que deseja excluir este usuário? Esta ação não pode ser desfeita."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteItem}>Confirmar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Settings;
