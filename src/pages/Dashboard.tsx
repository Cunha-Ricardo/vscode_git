
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { BarChart, Download, Star, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { statistics, feedbacks, features } from "@/data/mockData";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const Dashboard = () => {
  const { isAuthenticated, userProfile } = useAuth();
  const navigate = useNavigate();

  // Protected route - redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  const hasPermission = (permission: string) => {
    return userProfile?.permissions.includes(permission) || false;
  };

  const StatCard = ({ title, value, icon, color, children }: any) => (
    <Card className="card-hover">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-gray-500">{title}</CardTitle>
        <div className={`rounded-full p-2 ${color}`}>
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{value}</div>
        {children}
      </CardContent>
    </Card>
  );

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Estatísticas" />
        
        <main className="flex-1 overflow-auto p-6">
          <div className="animate-fade-in">
            {/* KPI Cards */}
            {(hasPermission("downloads") || hasPermission("ratings") || hasPermission("errors")) && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {hasPermission("downloads") && (
                  <StatCard 
                    title="Downloads" 
                    value={statistics.downloads.total} 
                    icon={<Download className="h-4 w-4 text-white" />}
                    color="bg-stat-download text-white"
                  >
                    <div className="flex justify-between mt-2 text-sm text-gray-500">
                      <div className="flex items-center">
                        <span className="inline-block h-3 w-3 rounded-full bg-green-500 mr-1"></span>
                        <span>{statistics.downloads.android}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="inline-block h-3 w-3 rounded-full bg-black mr-1"></span>
                        <span>{statistics.downloads.ios}</span>
                      </div>
                    </div>
                  </StatCard>
                )}
                
                {hasPermission("ratings") && (
                  <StatCard 
                    title="Avaliações" 
                    value={`${statistics.ratings.average}/5`} 
                    icon={<Star className="h-4 w-4 text-white" />}
                    color="bg-stat-rating text-white"
                  >
                    <div className="flex justify-between mt-2 text-sm text-gray-500">
                      <div className="flex items-center">
                        <span className="inline-block h-3 w-3 rounded-full bg-green-500 mr-1"></span>
                        <span>{statistics.ratings.android}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="inline-block h-3 w-3 rounded-full bg-black mr-1"></span>
                        <span>{statistics.ratings.ios}</span>
                      </div>
                    </div>
                  </StatCard>
                )}
                
                {hasPermission("errors") && (
                  <StatCard 
                    title="Erros" 
                    value={statistics.errors.total}
                    icon={<XCircle className="h-4 w-4 text-white" />}
                    color="bg-stat-error text-white"
                  >
                    <div className="flex justify-between mt-2 text-sm text-gray-500">
                      <div className="flex space-x-4">
                        <div className="flex items-center">
                          <span className="inline-block h-3 w-3 rounded-full bg-green-500 mr-1"></span>
                          <span>{statistics.errors.android}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="inline-block h-3 w-3 rounded-full bg-black mr-1"></span>
                          <span>{statistics.errors.ios}</span>
                        </div>
                      </div>
                      <div className="text-green-500">{statistics.errors.change}</div>
                    </div>
                  </StatCard>
                )}
              </div>
            )}
            
            {/* Feedbacks Section */}
            {hasPermission("feedbacks") && (
              <Card className="mb-8 card-hover">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Feedbacks</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                          <th className="px-6 py-3">Avaliação</th>
                          <th className="px-6 py-3">Data</th>
                          <th className="px-6 py-3">Avaliação</th>
                          <th className="px-6 py-3">Melhorias</th>
                          <th className="px-6 py-3">Plataforma</th>
                        </tr>
                      </thead>
                      <tbody>
                        {feedbacks.map((feedback) => (
                          <tr key={feedback.id} className="bg-white border-b hover:bg-gray-50">
                            <td className="px-6 py-4 font-normal text-gray-900">
                              <div className="line-clamp-2 max-w-md">{feedback.text}</div>
                            </td>
                            <td className="px-6 py-4">{feedback.date}</td>
                            <td className="px-6 py-4">{feedback.rating}</td>
                            <td className="px-6 py-4">{feedback.improvements}</td>
                            <td className="px-6 py-4">
                              <Badge variant={feedback.platform === 'Android' ? 'default' : 'secondary'}>
                                {feedback.platform}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Features Section */}
            {hasPermission("features") && (
              <Card className="card-hover">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Novas Funcionalidades</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {features.map((feature) => (
                      <div key={feature.id} className="space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">{feature.name}</span>
                          <span className="text-sm font-medium text-green-600">{feature.usage}%</span>
                        </div>
                        <Progress value={feature.usage} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
