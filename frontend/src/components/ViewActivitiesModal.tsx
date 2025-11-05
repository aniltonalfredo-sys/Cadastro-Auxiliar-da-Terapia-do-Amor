import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";
import { Badge } from "./ui/badge";
import { Calendar, MapPin, Users, Heart, Search, Eye, Printer, Trash2 } from "lucide-react";
import type { Activity } from "../types/activity";

// export interface ActivityParticipant {
//   id: string;
//   nome: string;
//   email?: string;
//   telefone: string;
//   foto?: string;
//   igreja: string;
//   regiao: string;
//   obreiro: boolean;
//   batizado: boolean;
// }

// export interface Activity {
//   id: string;
//   name: string;
//   date: string;
//   location?: string;
//   description?: string;
//   participants: ActivityParticipant[];
//   participantIds: string[];
//   createdAt: string;
//   updatedAt: string;
// }

interface ViewActivitiesModalProps {
  open: boolean;
  onClose: () => void;
  activities: Activity[];
  onViewDetails: (activity: Activity) => void;
  onPrintParticipants: (activity: Activity) => void;
  onDeleteActivity: (activity: Activity) => void;
}

export function ViewActivitiesModal({
  open,
  onClose,
  activities,
  onViewDetails,
  onPrintParticipants,
  onDeleteActivity,
}: ViewActivitiesModalProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredActivities = activities.filter((activity) =>
    activity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (activity.location && activity.location.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const sortedActivities = [...filteredActivities].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  // Calcular estatísticas
  const totalParticipants = activities.reduce((sum, activity) => 
    sum + activity.participants.length, 0
  );
  
  const upcomingActivities = activities.filter(activity => 
    new Date(activity.date) >= new Date()
  ).length;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden bg-white border-purple-200">
        <DialogHeader>
          <DialogTitle className="text-purple-900 flex items-center gap-2">
            <Heart className="w-5 h-5 text-purple-400 fill-purple-200" />
            Actividades Criadas
          </DialogTitle>
          <DialogDescription className="text-purple-600">
            💕 Visualize e gerencie todas as actividades cadastradas.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Buscar actividade por nome ou local..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-purple-50/50 border border-purple-100 focus:border-purple-300"
            />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border border-purple-200">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Calendar className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-medium text-purple-900">Total</span>
              </div>
              <div className="text-2xl font-bold text-purple-700">{activities.length}</div>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Users className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-medium text-purple-900">Participações</span>
              </div>
              <div className="text-2xl font-bold text-purple-700">{totalParticipants}</div>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Heart className="w-4 h-4 text-purple-600 fill-purple-600" />
                <span className="text-sm font-medium text-purple-900">Futuras</span>
              </div>
              <div className="text-2xl font-bold text-purple-700">{upcomingActivities}</div>
            </div>
          </div>

          {/* Activities List */}
          <ScrollArea className="h-[400px] pr-4">
            {sortedActivities.length === 0 ? (
              <div className="text-center py-12">
                <Heart className="w-12 h-12 text-purple-300 mx-auto mb-3" />
                <p className="text-purple-600 font-medium">
                  {searchTerm ? "Nenhuma actividade encontrada." : "Nenhuma actividade criada ainda."}
                </p>
                <p className="text-sm text-purple-400 mt-1">
                  {!searchTerm && "Crie sua primeira actividade clicando em 'Criar Actividade'."}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {sortedActivities.map((activity) => {
                  const activityDate = new Date(activity.date);
                  const isPast = activityDate < new Date();
                  
                  return (
                    <div
                      key={activity.id}
                      className={`border rounded-lg p-4 transition-all ${
                        isPast 
                          ? "border-gray-200 bg-gradient-to-br from-gray-50 to-white" 
                          : "border-purple-200 bg-gradient-to-br from-white to-purple-50/30 hover:shadow-md"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start gap-3 mb-2">
                            <div className={`p-2 rounded-lg ${
                              isPast ? "bg-gray-100" : "bg-purple-100"
                            }`}>
                              <Heart className={`w-4 h-4 ${
                                isPast ? "text-gray-400" : "text-purple-400 fill-purple-400"
                              }`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className={`font-medium mb-1 ${
                                isPast ? "text-gray-700" : "text-purple-900"
                              }`}>
                                {activity.name}
                              </h3>
                              
                              <div className="space-y-1 text-sm">
                                <div className={`flex items-center gap-2 ${
                                  isPast ? "text-gray-500" : "text-purple-700"
                                }`}>
                                  <Calendar className="w-3 h-3" />
                                  <span>
                                    {activityDate.toLocaleDateString("pt-BR", {
                                      weekday: 'long',
                                      year: 'numeric',
                                      month: 'long',
                                      day: 'numeric'
                                    })}
                                  </span>
                                  {isPast && (
                                    <Badge variant="secondary" className="text-xs">
                                      Realizada
                                    </Badge>
                                  )}
                                </div>
                                
                                {activity.location && (
                                  <div className={`flex items-center gap-2 ${
                                    isPast ? "text-gray-500" : "text-purple-700"
                                  }`}>
                                    <MapPin className="w-3 h-3" />
                                    <span className="truncate">{activity.location}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center gap-2 mt-3">
                            <Badge className={
                              isPast 
                                ? "bg-gray-100 text-gray-800 hover:bg-gray-100" 
                                : "bg-purple-100 text-purple-800 hover:bg-purple-100"
                            }>
                              <Users className="w-3 h-3 mr-1" />
                              {activity.participants.length} participante(s)
                            </Badge>
                            
                            {/* Mostrar badges dos participantes especiais */}
                            {activity.participants.some(p => p.obreiro) && (
                              <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-xs">
                                Obreiros
                              </Badge>
                            )}
                            
                            {activity.participants.some(p => p.batizado) && (
                              <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                                Baptizados
                              </Badge>
                            )}
                          </div>
                        </div>

                        <div className="flex gap-1 shrink-0">
                          <Button
                            variant="ghost"
                            size="icon"
                            className={`h-8 w-8 hover:bg-purple-50 ${
                              isPast ? "text-gray-500" : "text-purple-600"
                            }`}
                            onClick={() => onViewDetails(activity)}
                            title="Ver detalhes"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-blue-600 hover:bg-blue-50"
                            onClick={() => onPrintParticipants(activity)}
                            title="Imprimir lista de participantes"
                          >
                            <Printer className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-rose-600 hover:bg-rose-50"
                            onClick={() => onDeleteActivity(activity)}
                            title="Excluir atividade"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </ScrollArea>

          {/* Footer */}
          <div className="flex justify-between items-center pt-4 border-t border-purple-100">
            <div className="text-sm text-purple-500">
              {sortedActivities.length > 0 && (
                <>
                  Mostrando {sortedActivities.length} de {activities.length} actividades
                </>
              )}
            </div>
            <Button
              variant="outline"
              onClick={onClose}
              className="border-purple-200 text-purple-700 hover:bg-purple-50"
            >
              Fechar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}