import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Checkbox } from "./ui/checkbox";
import { PhotoUpload } from "./PhotoUpload";
import { PhoneInput } from "./PhoneInput";
import { Separator } from "./ui/separator";
import { toast } from "sonner@2.0.3";
import { Users, MapPin, AlertCircle, Heart } from "lucide-react";
import type { Auxiliary } from "./AuxiliariesTable";

interface NewAuxiliaryModalProps {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
  existingAuxiliaries: Auxiliary[];
}

export function NewAuxiliaryModal({ open, onClose, onSave, existingAuxiliaries }: NewAuxiliaryModalProps) {
  const [estadoCivil, setEstadoCivil] = useState<string>("");
  const [foto, setFoto] = useState<string>("");
  const [fotoConjuge, setFotoConjuge] = useState<string>("");
  
  // Form fields for validation
  const [nome, setNome] = useState<string>("");
  const [telefone, setTelefone] = useState<string>("");
  const [telefoneConjuge, setTelefoneConjuge] = useState<string>("");
  
  // Validation states
  const [nomeError, setNomeError] = useState<string>("");
  const [telefoneError, setTelefoneError] = useState<string>("");
  const [telefoneConjugeError, setTelefoneConjugeError] = useState<string>("");

  // Real-time validation for name
  useEffect(() => {
    if (nome.trim().length === 0) {
      setNomeError("");
      return;
    }

    const isDuplicate = existingAuxiliaries.some(
      (aux) => aux.nome.toLowerCase() === nome.toLowerCase().trim()
    );

    if (isDuplicate) {
      setNomeError("Este nome já está cadastrado no sistema.");
    } else {
      setNomeError("");
    }
  }, [nome, existingAuxiliaries]);

  // Real-time validation for phone
  useEffect(() => {
    if (telefone.trim().length === 0) {
      setTelefoneError("");
      return;
    }

    const cleanPhone = telefone.replace(/\D/g, "");
    // Telefone angolano: 244 + 9 dígitos = 12 dígitos
    if (cleanPhone.length < 12) {
      setTelefoneError("");
      return;
    }

    const isDuplicate = existingAuxiliaries.some(
      (aux) => aux.telefone.replace(/\D/g, "") === cleanPhone
    );

    if (isDuplicate) {
      setTelefoneError("Este telefone já está cadastrado no sistema.");
    } else {
      setTelefoneError("");
    }
  }, [telefone, existingAuxiliaries]);

  // Real-time validation for spouse phone
  useEffect(() => {
    if (telefoneConjuge.trim().length === 0) {
      setTelefoneConjugeError("");
      return;
    }

    const cleanPhone = telefoneConjuge.replace(/\D/g, "");
    // Telefone angolano: 244 + 9 dígitos = 12 dígitos
    if (cleanPhone.length < 12) {
      setTelefoneConjugeError("");
      return;
    }

    // Check against all auxiliaries
    const isDuplicate = existingAuxiliaries.some((aux) => {
      const auxPhone = aux.telefone.replace(/\D/g, "");
      const spousePhone = aux.conjuge?.telefone.replace(/\D/g, "");
      return auxPhone === cleanPhone || spousePhone === cleanPhone;
    });

    // Check against main phone
    const sameAsMain = telefone.replace(/\D/g, "") === cleanPhone;

    if (isDuplicate) {
      setTelefoneConjugeError("Este telefone já está cadastrado no sistema.");
    } else if (sameAsMain) {
      setTelefoneConjugeError("O telefone do cônjuge não pode ser igual ao do auxiliar.");
    } else {
      setTelefoneConjugeError("");
    }
  }, [telefoneConjuge, telefone, existingAuxiliaries]);

  const handleEstadoCivilChange = (value: string) => {
    setEstadoCivil(value);
    if (value === "solteiro") {
      setFotoConjuge("");
      setTelefoneConjuge("");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate main photo
    if (!foto) {
      toast.error("Por favor, carregue a foto do auxiliar.");
      return;
    }

    // Check for validation errors
    if (nomeError) {
      toast.error("Corrija os erros no formulário antes de continuar.");
      return;
    }

    if (telefoneError) {
      toast.error("Corrija os erros no formulário antes de continuar.");
      return;
    }

    // Validate spouse photo if not single
    if (showSpouseFields && !fotoConjuge) {
      toast.error("Por favor, carregue a foto do cônjuge/parceiro.");
      return;
    }

    if (showSpouseFields && telefoneConjugeError) {
      toast.error("Corrija os erros no formulário antes de continuar.");
      return;
    }

    toast.success("Auxiliar cadastrado com sucesso!");
    onSave();
    handleClose();
  };

  const handleClose = () => {
    // Reset form
    setEstadoCivil("");
    setFoto("");
    setFotoConjuge("");
    setNome("");
    setTelefone("");
    setTelefoneConjuge("");
    setNomeError("");
    setTelefoneError("");
    setTelefoneConjugeError("");
    onClose();
  };

  const showSpouseFields = estadoCivil !== "" && estadoCivil !== "solteiro";

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto bg-white border-purple-200">
        <DialogHeader>
          <DialogTitle className="text-purple-900 flex items-center gap-2">
            <Heart className="w-5 h-5 text-purple-400 fill-purple-200" />
            Novo Auxiliar
          </DialogTitle>
          <DialogDescription className="text-purple-600">
            💕 Preencha os dados para cadastrar um novo auxiliar no sistema.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div>
            <h3 className="mb-4">Dados Pessoais do Auxiliar</h3>
            
            {/* Photo Upload */}
            <div className="mb-6">
              <PhotoUpload
                label="Foto do Auxiliar *"
                value={foto}
                onChange={setFoto}
                placeholder="Foto 3x4 ou tipo passe de rosto"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="nome">Nome Completo *</Label>
                <Input
                  id="nome"
                  placeholder="Digite o nome completo"
                  required
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className={`bg-[#F7F8FA] border-0 ${nomeError ? "border-2 border-red-500" : ""}`}
                />
                {nomeError && (
                  <div className="flex items-center gap-2 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    <span>{nomeError}</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="telefone">Telefone/WhatsApp *</Label>
                <PhoneInput
                  id="telefone"
                  required
                  value={telefone}
                  onChange={(e) => setTelefone(e.target.value)}
                  className={`bg-purple-50/50 border border-purple-100 ${telefoneError ? "border-2 border-red-500" : ""}`}
                />
                {telefoneError && (
                  <div className="flex items-center gap-2 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    <span>{telefoneError}</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@exemplo.com"
                  className="bg-[#F7F8FA] border-0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="estadoCivil">Estado Civil *</Label>
                <Select required value={estadoCivil} onValueChange={handleEstadoCivilChange}>
                  <SelectTrigger id="estadoCivil" className="bg-[#F7F8FA] border-0">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="solteiro">Solteiro(a)</SelectItem>
                    <SelectItem value="casado">Casado(a)</SelectItem>
                    <SelectItem value="uniao-estavel">União Estável</SelectItem>
                    <SelectItem value="divorciado">Divorciado(a)</SelectItem>
                    <SelectItem value="viuvo">Viúvo(a)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dataNascimento">Data de Nascimento</Label>
                <Input
                  id="dataNascimento"
                  type="date"
                  className="bg-[#F7F8FA] border-0"
                />
              </div>

              <div className="space-y-3 md:col-span-2">
                <Label>Status Eclesiástico</Label>
                <div className="flex gap-6">
                  <div className="flex items-center gap-2">
                    <Checkbox id="obreiro" />
                    <Label htmlFor="obreiro" className="cursor-pointer">
                      É Obreiro
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox id="batizado" />
                    <Label htmlFor="batizado" className="cursor-pointer">
                      É Batizado
                    </Label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Residential Address */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-5 h-5 text-[#9333EA]" />
              <h3 className="text-purple-900">🏡 Endereço Residencial</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="provinciaResidencial">Província *</Label>
                <Select required>
                  <SelectTrigger id="provinciaResidencial" className="bg-[#F7F8FA] border-0">
                    <SelectValue placeholder="Selecione a província" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="luanda">Luanda</SelectItem>
                    <SelectItem value="benguela">Benguela</SelectItem>
                    <SelectItem value="huambo">Huambo</SelectItem>
                    <SelectItem value="huila">Huíla</SelectItem>
                    <SelectItem value="cabinda">Cabinda</SelectItem>
                    <SelectItem value="cuando-cubango">Cuando Cubango</SelectItem>
                    <SelectItem value="cuanza-norte">Cuanza Norte</SelectItem>
                    <SelectItem value="cuanza-sul">Cuanza Sul</SelectItem>
                    <SelectItem value="cunene">Cunene</SelectItem>
                    <SelectItem value="lunda-norte">Lunda Norte</SelectItem>
                    <SelectItem value="lunda-sul">Lunda Sul</SelectItem>
                    <SelectItem value="malanje">Malanje</SelectItem>
                    <SelectItem value="moxico">Moxico</SelectItem>
                    <SelectItem value="namibe">Namibe</SelectItem>
                    <SelectItem value="uige">Uíge</SelectItem>
                    <SelectItem value="zaire">Zaire</SelectItem>
                    <SelectItem value="bie">Bié</SelectItem>
                    <SelectItem value="bengo">Bengo</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="municipioResidencial">Município *</Label>
                <Input
                  id="municipioResidencial"
                  placeholder="Nome do município"
                  required
                  className="bg-[#F7F8FA] border-0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bairroResidencial">Bairro *</Label>
                <Input
                  id="bairroResidencial"
                  placeholder="Nome do bairro"
                  required
                  className="bg-[#F7F8FA] border-0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ruaResidencial">Rua *</Label>
                <Input
                  id="ruaResidencial"
                  placeholder="Nome da rua"
                  required
                  className="bg-[#F7F8FA] border-0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="numeroCasaResidencial">Número da Casa *</Label>
                <Input
                  id="numeroCasaResidencial"
                  placeholder="Nº"
                  required
                  className="bg-[#F7F8FA] border-0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="referenciaResidencial">Ponto de Referência</Label>
                <Input
                  id="referenciaResidencial"
                  placeholder="Ex: Próximo ao mercado"
                  className="bg-[#F7F8FA] border-0"
                />
              </div>
            </div>
          </div>

          {/* Spouse/Partner Information - Conditional */}
          {showSpouseFields && (
            <>
              <Separator />
              
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200">
                <div className="flex items-center gap-2 mb-4">
                  <Users className="w-5 h-5 text-[#9333EA]" />
                  <h3 className="text-[#9333EA] flex items-center gap-2">
                    💑 Dados do Cônjuge/Parceiro(a)
                  </h3>
                </div>

                {/* Spouse Photo Upload */}
                <div className="mb-6">
                  <PhotoUpload
                    label="Foto do Cônjuge/Parceiro(a) *"
                    value={fotoConjuge}
                    onChange={setFotoConjuge}
                    placeholder="Foto 3x4 ou tipo passe de rosto"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="nomeConjuge">Nome Completo do Cônjuge *</Label>
                    <Input
                      id="nomeConjuge"
                      placeholder="Digite o nome completo do cônjuge"
                      required={showSpouseFields}
                      className="bg-white border-0"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="telefoneConjuge">Telefone/WhatsApp do Cônjuge *</Label>
                    <PhoneInput
                      id="telefoneConjuge"
                      required={showSpouseFields}
                      value={telefoneConjuge}
                      onChange={(e) => setTelefoneConjuge(e.target.value)}
                      className={`bg-white border border-purple-100 ${telefoneConjugeError ? "border-2 border-red-500" : ""}`}
                    />
                    {telefoneConjugeError && (
                      <div className="flex items-center gap-2 text-red-600 text-sm">
                        <AlertCircle className="w-4 h-4" />
                        <span>{telefoneConjugeError}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="emailConjuge">E-mail do Cônjuge</Label>
                    <Input
                      id="emailConjuge"
                      type="email"
                      placeholder="email@exemplo.com"
                      className="bg-white border-0"
                    />
                  </div>

                  <div className="space-y-3 md:col-span-2">
                    <Label>Status Eclesiástico do Cônjuge</Label>
                    <div className="flex gap-6">
                      <div className="flex items-center gap-2">
                        <Checkbox id="obreiroConjuge" />
                        <Label htmlFor="obreiroConjuge" className="cursor-pointer">
                          É Obreiro
                        </Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Checkbox id="batizadoConjuge" />
                        <Label htmlFor="batizadoConjuge" className="cursor-pointer">
                          É Batizado
                        </Label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          <Separator />

          {/* Church Information */}
          <div>
            <h3 className="mb-4">Informações Eclesiásticas</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="space-y-2">
                <Label htmlFor="igreja">Igreja *</Label>
                <Select required>
                  <SelectTrigger id="igreja" className="bg-[#F7F8FA] border-0">
                    <SelectValue placeholder="Selecione a igreja" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="central">Igreja Central</SelectItem>
                    <SelectItem value="nova-esperanca">Igreja Nova Esperança</SelectItem>
                    <SelectItem value="fe-viva">Igreja Fé Viva</SelectItem>
                    <SelectItem value="luz-divina">Igreja Luz Divina</SelectItem>
                    <SelectItem value="amor-perfeito">Igreja Amor Perfeito</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="regiao">Região *</Label>
                <Select required>
                  <SelectTrigger id="regiao" className="bg-[#F7F8FA] border-0">
                    <SelectValue placeholder="Selecione a região" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="norte">Norte</SelectItem>
                    <SelectItem value="sul">Sul</SelectItem>
                    <SelectItem value="leste">Leste</SelectItem>
                    <SelectItem value="oeste">Oeste</SelectItem>
                    <SelectItem value="centro">Centro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Church Address */}
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-5 h-5 text-[#9333EA]" />
              <h4 className="text-purple-900">⛪ Endereço da Igreja</h4>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="provinciaIgreja">Província *</Label>
                <Select required>
                  <SelectTrigger id="provinciaIgreja" className="bg-[#F7F8FA] border-0">
                    <SelectValue placeholder="Selecione a província" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="luanda">Luanda</SelectItem>
                    <SelectItem value="benguela">Benguela</SelectItem>
                    <SelectItem value="huambo">Huambo</SelectItem>
                    <SelectItem value="huila">Huíla</SelectItem>
                    <SelectItem value="cabinda">Cabinda</SelectItem>
                    <SelectItem value="cuando-cubango">Cuando Cubango</SelectItem>
                    <SelectItem value="cuanza-norte">Cuanza Norte</SelectItem>
                    <SelectItem value="cuanza-sul">Cuanza Sul</SelectItem>
                    <SelectItem value="cunene">Cunene</SelectItem>
                    <SelectItem value="lunda-norte">Lunda Norte</SelectItem>
                    <SelectItem value="lunda-sul">Lunda Sul</SelectItem>
                    <SelectItem value="malanje">Malanje</SelectItem>
                    <SelectItem value="moxico">Moxico</SelectItem>
                    <SelectItem value="namibe">Namibe</SelectItem>
                    <SelectItem value="uige">Uíge</SelectItem>
                    <SelectItem value="zaire">Zaire</SelectItem>
                    <SelectItem value="bie">Bié</SelectItem>
                    <SelectItem value="bengo">Bengo</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="municipioIgreja">Município *</Label>
                <Input
                  id="municipioIgreja"
                  placeholder="Nome do município"
                  required
                  className="bg-[#F7F8FA] border-0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bairroIgreja">Bairro *</Label>
                <Input
                  id="bairroIgreja"
                  placeholder="Nome do bairro"
                  required
                  className="bg-[#F7F8FA] border-0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ruaIgreja">Rua *</Label>
                <Input
                  id="ruaIgreja"
                  placeholder="Nome da rua"
                  required
                  className="bg-[#F7F8FA] border-0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="numeroCasaIgreja">Número *</Label>
                <Input
                  id="numeroCasaIgreja"
                  placeholder="Nº"
                  required
                  className="bg-[#F7F8FA] border-0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="referenciaIgreja">Ponto de Referência</Label>
                <Input
                  id="referenciaIgreja"
                  placeholder="Ex: Próximo à praça principal"
                  className="bg-[#F7F8FA] border-0"
                />
              </div>
            </div>
          </div>

          {/* Relationship Information */}
          {showSpouseFields && (
            <>
              <Separator />
              <div>
                <h3 className="mb-4">Informações do Relacionamento</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dataUniao">Data da União/Casamento</Label>
                    <Input
                      id="dataUniao"
                      type="date"
                      className="bg-[#F7F8FA] border-0"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tempoRelacionamento">Tempo de Relacionamento</Label>
                    <Input
                      id="tempoRelacionamento"
                      placeholder="Ex: 2 anos e 3 meses"
                      className="bg-[#F7F8FA] border-0"
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 pt-4 border-t border-purple-100">
            <Button type="button" variant="outline" onClick={handleClose} className="border-purple-200 text-purple-700 hover:bg-purple-50">
              Cancelar
            </Button>
            <Button 
              type="submit" 
              className="bg-gradient-to-r from-[#9333EA] to-[#A855F7] hover:from-[#7E22CE] hover:to-[#9333EA] shadow-md shadow-purple-200"
              disabled={!!nomeError || !!telefoneError || !!telefoneConjugeError}
            >
              💕 Cadastrar Auxiliar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
