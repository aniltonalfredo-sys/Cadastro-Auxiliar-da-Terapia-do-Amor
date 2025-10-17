import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import { Calendar, MapPin, Users, Heart, Phone, Printer } from "lucide-react";
import type { Activity } from "./ViewActivitiesModal";
import type { Auxiliary } from "./AuxiliariesTable";

interface ActivityDetailsModalProps {
  open: boolean;
  onClose: () => void;
  activity: Activity | null;
  auxiliaries: Auxiliary[];
  onPrintParticipants: () => void;
}

export function ActivityDetailsModal({
  open,
  onClose,
  activity,
  auxiliaries,
  onPrintParticipants,
}: ActivityDetailsModalProps) {
  if (!activity) return null;

  const participants = auxiliaries.filter((aux) =>
    activity.participantIds.includes(aux.id)
  );

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden bg-white border-purple-200">
        <DialogHeader>
          <DialogTitle className="text-purple-900 flex items-center gap-2">
            <Heart className="w-5 h-5 text-purple-400 fill-purple-200" />
            Detalhes da Atividade
          </DialogTitle>
          <DialogDescription className="text-purple-600">
            Visualize todas as informações da atividade e seus participantes.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Activity Info */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-6 border border-purple-200">
            <h2 className="text-purple-900 mb-4">{activity.name}</h2>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-purple-600">Data</p>
                  <p className="text-purple-900">
                    {new Date(activity.date).toLocaleDateString("pt-BR", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>

              {activity.location && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-purple-600">Local</p>
                    <p className="text-purple-900">{activity.location}</p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-purple-600">Participantes</p>
                  <p className="text-purple-900">{participants.length} auxiliar(es)</p>
                </div>
              </div>
            </div>
          </div>

          {/* Participants List */}
          <div>
            <h3 className="text-purple-900 mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-600" />
              Lista de Participantes
            </h3>

            <ScrollArea className="h-[300px] border border-purple-100 rounded-lg bg-purple-50/30 p-4">
              <div className="space-y-3">
                {participants.map((participant) => (
                  <div
                    key={participant.id}
                    className="flex items-center gap-3 p-3 bg-white rounded-lg border border-purple-200"
                  >
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={participant.foto} alt={participant.nome} />
                      <AvatarFallback>
                        {participant.nome
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .substring(0, 2)}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                      <p className="font-medium text-purple-900">{participant.nome}</p>
                      <div className="flex items-center gap-2 text-sm text-purple-600">
                        <Phone className="w-3 h-3" />
                        <span>{participant.telefone}</span>
                      </div>
                      <p className="text-sm text-purple-600">
                        {participant.igreja} • {participant.regiao}
                      </p>
                    </div>

                    <div className="flex gap-1">
                      {participant.obreiro && (
                        <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100 text-xs">
                          Obreiro
                        </Badge>
                      )}
                      {participant.batizado && (
                        <Badge className="bg-pink-100 text-pink-800 hover:bg-pink-100 text-xs">
                          Batizado
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 pt-4 border-t border-purple-100">
            <Button
              variant="outline"
              onClick={onClose}
              className="border-purple-200 text-purple-700 hover:bg-purple-50"
            >
              Fechar
            </Button>
            <Button
              onClick={onPrintParticipants}
              className="bg-gradient-to-r from-[#9333EA] to-[#A855F7] hover:from-[#7E22CE] hover:to-[#9333EA] shadow-md shadow-purple-200"
            >
              <Printer className="w-4 h-4 mr-2" />
              Imprimir Lista
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
