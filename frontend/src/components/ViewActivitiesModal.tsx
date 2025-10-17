import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";
import { Badge } from "./ui/badge";
import { Calendar, MapPin, Users, Heart, Search, Eye, Printer, Trash2 } from "lucide-react";

export interface Activity {
  id: string;
  name: string;
  date: string;
  location: string;
  participantIds: string[];
  createdAt: string;
}

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
    activity.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedActivities = [...filteredActivities].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden bg-white border-purple-200">
        <DialogHeader>
          <DialogTitle className="text-purple-900 flex items-center gap-2">
            <Heart className="w-5 h-5 text-purple-400 fill-purple-200" />
            Atividades Criadas
          </DialogTitle>
          <DialogDescription className="text-purple-600">
            💕 Visualize e gerencie todas as atividades cadastradas.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Buscar atividade..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-purple-50/50 border border-purple-100"
            />
          </div>

          {/* Stats */}
          <div className="flex gap-4 p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border border-purple-200">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-purple-600" />
              <span className="text-sm text-purple-900">
                <span className="font-medium">{activities.length}</span> atividade(s)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-purple-600" />
              <span className="text-sm text-purple-900">
                <span className="font-medium">
                  {activities.reduce((sum, act) => sum + act.participantIds.length, 0)}
                </span>{" "}
                participação(ões)
              </span>
            </div>
          </div>

          {/* Activities List */}
          <ScrollArea className="h-[400px]">
            {sortedActivities.length === 0 ? (
              <div className="text-center py-12">
                <Heart className="w-12 h-12 text-purple-300 mx-auto mb-3" />
                <p className="text-purple-600">
                  {searchTerm ? "Nenhuma atividade encontrada." : "Nenhuma atividade criada ainda."}
                </p>
                <p className="text-sm text-purple-400 mt-1">
                  {!searchTerm && "Crie sua primeira atividade clicando em 'Criar Atividade'."}
                </p>
              </div>
            ) : (
              <div className="space-y-3 pr-4">
                {sortedActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className="border border-purple-200 rounded-lg p-4 bg-gradient-to-br from-white to-purple-50/30 hover:shadow-md transition-all"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="text-purple-900 mb-2 flex items-center gap-2">
                          <Heart className="w-4 h-4 text-purple-400 fill-purple-400" />
                          {activity.name}
                        </h3>
                        
                        <div className="space-y-1 mb-3">
                          <div className="flex items-center gap-2 text-sm text-purple-700">
                            <Calendar className="w-3 h-3" />
                            <span>{new Date(activity.date).toLocaleDateString("pt-BR")}</span>
                          </div>
                          {activity.location && (
                            <div className="flex items-center gap-2 text-sm text-purple-700">
                              <MapPin className="w-3 h-3" />
                              <span>{activity.location}</span>
                            </div>
                          )}
                        </div>

                        <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">
                          <Users className="w-3 h-3 mr-1" />
                          {activity.participantIds.length} participante(s)
                        </Badge>
                      </div>

                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-purple-600 hover:bg-purple-50"
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
                          title="Imprimir lista"
                        >
                          <Printer className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-rose-600 hover:bg-rose-50"
                          onClick={() => onDeleteActivity(activity)}
                          title="Excluir"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>

          {/* Action Buttons */}
          <div className="flex justify-end pt-4 border-t border-purple-100">
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
