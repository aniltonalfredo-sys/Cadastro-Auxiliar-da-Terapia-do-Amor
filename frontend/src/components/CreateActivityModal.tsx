import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";
import { Separator } from "./ui/separator";
import { ScrollArea } from "./ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { toast } from "sonner";
import { Calendar, MapPin, Users, Heart, CheckCircle, Search } from "lucide-react";
import type { Auxiliary } from "./AuxiliariesTable";

export interface Activity {
  id: string;
  name: string;
  date: string;
  location: string;
  participantIds: string[];
  createdAt: string;
}

interface CreateActivityModalProps {
  open: boolean;
  onClose: () => void;
  auxiliaries: Auxiliary[];
  onSaveActivity: (activity: Activity) => void;
}

export function CreateActivityModal({ open, onClose, auxiliaries, onSaveActivity }: CreateActivityModalProps) {
  const [activityName, setActivityName] = useState("");
  const [activityDate, setActivityDate] = useState("");
  const [activityLocation, setActivityLocation] = useState("");
  const [selectedAuxiliaries, setSelectedAuxiliaries] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState("");

  const handleToggleAuxiliary = (id: string) => {
    const newSelected = new Set(selectedAuxiliaries);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedAuxiliaries(newSelected);
  };

  const handleSelectAll = () => {
    const filtered = getFilteredAuxiliaries();
    const allIds = new Set(filtered.map(aux => aux.id));
    setSelectedAuxiliaries(allIds);
  };

  const handleDeselectAll = () => {
    setSelectedAuxiliaries(new Set());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!activityName || !activityDate) {
      toast.error("Por favor, preencha o nome e a data da atividade.");
      return;
    }

    if (selectedAuxiliaries.size === 0) {
      toast.error("Por favor, selecione pelo menos um auxiliar.");
      return;
    }

    const newActivity: Activity = {
      id: Date.now().toString(),
      name: activityName,
      date: activityDate,
      location: activityLocation,
      participantIds: Array.from(selectedAuxiliaries),
      createdAt: new Date().toISOString(),
    };

    onSaveActivity(newActivity);
    toast.success(`Atividade "${activityName}" criada com ${selectedAuxiliaries.size} participante(s)!`);
    handleClose();
  };

  const handleClose = () => {
    setActivityName("");
    setActivityDate("");
    setActivityLocation("");
    setSelectedAuxiliaries(new Set());
    setSearchTerm("");
    onClose();
  };

  const getFilteredAuxiliaries = () => {
    if (!searchTerm) return auxiliaries;
    const searchLower = searchTerm.toLowerCase();
    return auxiliaries.filter(aux => 
      aux.nome.toLowerCase().includes(searchLower) ||
      aux.igreja.toLowerCase().includes(searchLower) ||
      aux.telefone.includes(searchLower)
    );
  };

  const filteredAuxiliaries = getFilteredAuxiliaries();

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col p-0 gap-0 bg-white border-purple-200 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-4 shrink-0">
          <DialogTitle className="text-purple-900 flex items-center gap-2">
            <Heart className="w-5 h-5 text-purple-400 fill-purple-200" />
            Criar Nova Atividade
          </DialogTitle>
          <DialogDescription className="text-purple-600">
            💕 Organize atividades e selecione os auxiliares participantes.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden min-h-0">
          <ScrollArea className="flex-1 px-6 min-h-0">
            <div className="space-y-6 pb-4 pr-2">
              {/* Activity Info */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="activityName">Nome da Atividade *</Label>
                  <Input
                    id="activityName"
                    placeholder="Ex: Retiro Espiritual, Encontro de Casais..."
                    required
                    value={activityName}
                    onChange={(e) => setActivityName(e.target.value)}
                    className="bg-purple-50/50 border border-purple-100"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2 min-w-0">
                    <Label htmlFor="activityDate">Data *</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-purple-400 pointer-events-none" />
                      <Input
                        id="activityDate"
                        type="date"
                        required
                        value={activityDate}
                        onChange={(e) => setActivityDate(e.target.value)}
                        className="pl-10 bg-purple-50/50 border border-purple-100"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 min-w-0">
                    <Label htmlFor="activityLocation">Local</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-purple-400 pointer-events-none" />
                      <Input
                        id="activityLocation"
                        placeholder="Local"
                        value={activityLocation}
                        onChange={(e) => setActivityLocation(e.target.value)}
                        className="pl-10 bg-purple-50/50 border border-purple-100"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Participants Selection */}
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Users className="w-5 h-5 text-purple-600 shrink-0" />
                    <h3 className="text-purple-900">Participantes</h3>
                    <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100 shrink-0">
                      {selectedAuxiliaries.size}
                    </Badge>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleSelectAll}
                      className="border-purple-200 text-purple-700 hover:bg-purple-50 text-xs px-2"
                    >
                      Todos
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleDeselectAll}
                      className="border-purple-200 text-purple-700 hover:bg-purple-50 text-xs px-2"
                    >
                      Limpar
                    </Button>
                  </div>
                </div>

                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  <Input
                    type="text"
                    placeholder="Buscar auxiliar..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-purple-50/50 border border-purple-100"
                  />
                </div>

                {/* Auxiliaries List */}
                <ScrollArea className="h-[280px] border border-purple-100 rounded-lg bg-purple-50/30 p-3">
                  <div className="space-y-2 pr-3">
                    {filteredAuxiliaries.length === 0 ? (
                      <p className="text-center text-purple-600 py-8 text-sm">
                        Nenhum auxiliar encontrado.
                      </p>
                    ) : (
                      filteredAuxiliaries.map((auxiliary) => {
                        const isSelected = selectedAuxiliaries.has(auxiliary.id);
                        return (
                          <div
                            key={auxiliary.id}
                            className={`flex items-center gap-2 p-2.5 rounded-lg border transition-all ${
                              isSelected
                                ? "bg-purple-100 border-purple-300"
                                : "bg-white border-purple-200 hover:bg-purple-50"
                            }`}
                          >
                            <Checkbox
                              checked={isSelected}
                              onCheckedChange={() => handleToggleAuxiliary(auxiliary.id)}
                              className="shrink-0"
                            />
                          
                            <Avatar className="w-9 h-9 shrink-0">
                              <AvatarImage src={auxiliary.foto} alt={auxiliary.nome} />
                              <AvatarFallback className="text-xs">
                                {auxiliary.nome
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")
                                  .substring(0, 2)}
                              </AvatarFallback>
                            </Avatar>

                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-purple-900 truncate">{auxiliary.nome}</p>
                              <div className="flex items-center gap-1.5 text-xs text-purple-600">
                                <span className="truncate max-w-[120px]">{auxiliary.igreja}</span>
                                <span>•</span>
                                <span className="shrink-0">{auxiliary.regiao}</span>
                              </div>
                            </div>

                            <div className="flex gap-1 shrink-0">
                              {auxiliary.obreiro && (
                                <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100 text-[10px] px-1.5 py-0">
                                  Obreiro
                                </Badge>
                              )}
                              {auxiliary.batizado && (
                                <Badge className="bg-pink-100 text-pink-800 hover:bg-pink-100 text-[10px] px-1.5 py-0">
                                  Batizado
                                </Badge>
                              )}
                            </div>

                            {isSelected && (
                              <CheckCircle className="w-4 h-4 text-purple-600 fill-purple-600 shrink-0" />
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                </ScrollArea>
              </div>
            </div>
          </ScrollArea>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 px-6 py-4 border-t border-purple-100 bg-white shrink-0">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="border-purple-200 text-purple-700 hover:bg-purple-50"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-[#9333EA] to-[#A855F7] hover:from-[#7E22CE] hover:to-[#9333EA] shadow-md shadow-purple-200"
            >
              💕 Criar Atividade
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
