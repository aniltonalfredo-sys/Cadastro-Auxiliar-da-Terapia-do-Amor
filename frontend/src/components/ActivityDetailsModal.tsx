import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import { Calendar, MapPin, Users, Heart, Phone, Printer, Church, MapPin as MapPinIcon } from "lucide-react";
import type { Activity } from "../types/activity";

interface ActivityDetailsModalProps {
  open: boolean;
  onClose: () => void;
  activity: Activity | null;
  onPrintParticipants: () => void;
}

export function ActivityDetailsModal({
  open,
  onClose,
  activity,
  onPrintParticipants,
}: ActivityDetailsModalProps) {
  if (!activity) return null;

  // Usar os participantes que já vêm da actividade (do backend)
  const participants = activity.participants || [];

  // Estatísticas
  const obreirosCount = participants.filter(p => p.obreiro).length;
  const batizadosCount = participants.filter(p => p.batizado).length;
  const activityDate = new Date(activity.date);
  const isPast = activityDate < new Date();

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col bg-white border-purple-200 overflow-hidden">
        <DialogHeader className="shrink-0 pb-4">
          <DialogTitle className="text-purple-900 flex items-center gap-2 text-xl">
            <Heart className="w-6 h-6 text-purple-400 fill-purple-200" />
            Detalhes da Actividade
          </DialogTitle>
          <DialogDescription className="text-purple-600 text-base">
            {isPast ? "📅 Actividade realizada" : "📅 Actividade futura"} • {participants.length} participante(s)
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col flex-1 overflow-hidden gap-4">
          {/* Activity Info - Card Fixo */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-200 shrink-0">
            <div className="flex items-start justify-between mb-3">
              <h2 className="text-lg font-bold text-purple-900 leading-tight">{activity.name}</h2>
              {isPast && (
                <Badge variant="secondary" className="bg-gray-100 text-gray-700 text-xs">
                  Realizada
                </Badge>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Data */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center shrink-0">
                  <Calendar className="w-4 h-4 text-purple-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-purple-600">Data</p>
                  <p className="text-sm text-purple-900 font-medium truncate">
                    {activityDate.toLocaleDateString("pt-BR", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>

              {/* Local */}
              {activity.location && (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4 text-purple-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-purple-600">Local</p>
                    <p className="text-sm text-purple-900 font-medium truncate">{activity.location}</p>
                  </div>
                </div>
              )}

              {/* Participantes */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center shrink-0">
                  <Users className="w-4 h-4 text-purple-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-purple-600">Participantes</p>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-purple-900 font-medium">
                      {participants.length}
                    </span>
                    {obreirosCount > 0 && (
                      <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 text-xs px-1.5 py-0">
                        {obreirosCount} obr.
                      </Badge>
                    )}
                    {batizadosCount > 0 && (
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-100 text-xs px-1.5 py-0">
                        {batizadosCount} bat.
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Descrição (se houver) */}
              {activity.description && (
                <div className="md:col-span-2 flex items-start gap-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center shrink-0 mt-1">
                    <Heart className="w-4 h-4 text-purple-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-purple-600">Descrição</p>
                    <p className="text-sm text-purple-900 font-medium line-clamp-2">
                      {activity.description}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Participants List - Área Rolável */}
          <div className="flex flex-col flex-1 min-h-0">
            <div className="flex items-center justify-between mb-3 shrink-0">
              <h3 className="text-purple-900 flex items-center gap-2 font-medium">
                <Users className="w-5 h-5 text-purple-600" />
                Lista de Participantes
                <Badge variant="secondary" className="ml-2">
                  {participants.length}
                </Badge>
              </h3>
              
              {participants.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onPrintParticipants}
                  className="border-purple-200 text-purple-700 hover:bg-purple-50 h-8"
                >
                  <Printer className="w-3 h-3 mr-1" />
                  Imprimir
                </Button>
              )}
            </div>

            {participants.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-purple-200 rounded-lg bg-purple-50/30">
                <Users className="w-12 h-12 text-purple-300 mb-3" />
                <p className="text-purple-600 font-medium">Nenhum participante</p>
                <p className="text-sm text-purple-400 mt-1 text-center px-4">
                  Esta actividade ainda não tem participantes
                </p>
              </div>
            ) : (
              <ScrollArea className="flex-1 border border-purple-100 rounded-lg bg-purple-50/30">
                <div className="p-3 space-y-2">
                  {participants.map((participant) => (
                    <div
                      key={participant.id}
                      className="flex items-center gap-3 p-3 bg-white rounded-lg border border-purple-200 hover:shadow-sm transition-all"
                    >
                      <Avatar className="w-10 h-10 shrink-0">
                        <AvatarImage src={participant.foto} alt={participant.nome} />
                        <AvatarFallback className="bg-purple-100 text-purple-800 font-medium text-xs">
                          {participant.nome
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .substring(0, 2)
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-purple-900 text-sm truncate">
                          {participant.nome}
                        </p>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-purple-600 mt-1">
                          <div className="flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            <span className="truncate">{participant.telefone}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Church className="w-3 h-3" />
                            <span className="truncate max-w-[100px]">{participant.igreja}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPinIcon className="w-3 h-3" />
                            <span>{participant.regiao}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-1 shrink-0">
                        {participant.obreiro && (
                          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 text-xs px-2 py-0 h-5">
                            Obreiro
                          </Badge>
                        )}
                        {participant.batizado && (
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-100 text-xs px-2 py-0 h-5">
                            Batizado
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </div>

          {/* Action Buttons - Fixo no final */}
          <div className="flex justify-between items-center pt-3 border-t border-purple-100 shrink-0">
            <div className="text-xs text-purple-500">
              Criada em {new Date(activity.createdAt).toLocaleDateString("pt-BR")}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={onClose}
                className="border-purple-200 text-purple-700 hover:bg-purple-50 h-9"
              >
                Fechar
              </Button>
              {participants.length > 0 && (
                <Button
                  onClick={onPrintParticipants}
                  className="bg-gradient-to-r from-[#9333EA] to-[#A855F7] hover:from-[#7E22CE] hover:to-[#9333EA] shadow-md shadow-purple-200 h-9"
                >
                  <Printer className="w-4 h-4 mr-2" />
                  Imprimir Lista
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}