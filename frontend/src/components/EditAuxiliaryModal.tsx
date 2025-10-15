import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Checkbox } from "./ui/checkbox";
import { PhotoUpload } from "./PhotoUpload";
import { PhoneInput } from "./PhoneInput";
import { Separator } from "./ui/separator";
import { toast } from "sonner";
import { Users, MapPin, AlertCircle, Heart } from "lucide-react";
import type { Auxiliary } from "./AuxiliariesTable";

interface EditAuxiliaryModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (updatedAux: Auxiliary) => void; // ✅ agora aceita o auxiliar atualizado
  existingAuxiliaries: Auxiliary[];
  auxiliary: Auxiliary | null;
}

export function EditAuxiliaryModal({
  open,
  onClose,
  onSave,
  existingAuxiliaries,
  auxiliary,
}: EditAuxiliaryModalProps) {
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [estadoCivil, setEstadoCivil] = useState("");
  const [foto, setFoto] = useState("");
  const [obreiro, setObreiro] = useState(false);
  const [batizado, setBatizado] = useState(false);

  // Conjuge
  const [fotoConjuge, setFotoConjuge] = useState("");
  const [nomeConjuge, setNomeConjuge] = useState("");
  const [telefoneConjuge, setTelefoneConjuge] = useState("");
  const [obreiroConjuge, setObreiroConjuge] = useState(false);
  const [batizadoConjuge, setBatizadoConjuge] = useState(false);

  // Erros
  const [nomeError, setNomeError] = useState("");
  const [telefoneError, setTelefoneError] = useState("");
  const [telefoneConjugeError, setTelefoneConjugeError] = useState("");

  const showSpouseFields = estadoCivil !== "" && estadoCivil !== "solteiro";

  // 🧩 Carregar dados do auxiliar selecionado
  useEffect(() => {
    if (auxiliary && open) {
      setNome(auxiliary.nome);
      setTelefone(auxiliary.telefone);
      setFoto(auxiliary.foto);
      setEstadoCivil(
        auxiliary.estadoCivil === "Solteiro(a)"
          ? "solteiro"
          : auxiliary.estadoCivil === "Casado(a)"
          ? "casado"
          : auxiliary.estadoCivil === "União Estável"
          ? "uniao-estavel"
          : auxiliary.estadoCivil === "Divorciado(a)"
          ? "divorciado"
          : auxiliary.estadoCivil === "Viúvo(a)"
          ? "viuvo"
          : ""
      );
      setObreiro(auxiliary.obreiro);
      setBatizado(auxiliary.batizado);

      if (auxiliary.conjuge) {
        setNomeConjuge(auxiliary.conjuge.nome || "");
        setTelefoneConjuge(auxiliary.conjuge.telefone || "");
        setFotoConjuge(auxiliary.conjuge.foto || "");
        setObreiroConjuge(auxiliary.conjuge.obreiro || false);
        setBatizadoConjuge(auxiliary.conjuge.batizado || false);
      }
    }
  }, [auxiliary, open]);

  // 🧩 Validar nome duplicado
  useEffect(() => {
    if (!nome.trim()) return setNomeError("");
    const isDuplicate = existingAuxiliaries.some(
      (a) => a.id !== auxiliary?.id && a.nome.toLowerCase() === nome.toLowerCase().trim()
    );
    setNomeError(isDuplicate ? "Este nome já está cadastrado no sistema." : "");
  }, [nome, existingAuxiliaries, auxiliary]);

  // 🧩 Validar telefone duplicado
  useEffect(() => {
    if (!telefone.trim()) return setTelefoneError("");
    const clean = telefone.replace(/\D/g, "");
    if (clean.length < 9) return setTelefoneError("");
    const duplicate = existingAuxiliaries.some(
      (a) => a.id !== auxiliary?.id && a.telefone.replace(/\D/g, "") === clean
    );
    setTelefoneError(duplicate ? "Este telefone já está cadastrado no sistema." : "");
  }, [telefone, existingAuxiliaries, auxiliary]);

  // 🧩 Validar telefone do cônjuge
  useEffect(() => {
    if (!telefoneConjuge.trim()) return setTelefoneConjugeError("");
    const clean = telefoneConjuge.replace(/\D/g, "");
    const mainClean = telefone.replace(/\D/g, "");
    if (clean.length < 9) return setTelefoneConjugeError("");
    const duplicate = existingAuxiliaries.some((a) => {
      if (a.id === auxiliary?.id) return false;
      const main = a.telefone.replace(/\D/g, "");
      const spouse = a.conjuge?.telefone?.replace(/\D/g, "");
      return main === clean || spouse === clean;
    });
    if (duplicate) return setTelefoneConjugeError("Este telefone já está cadastrado no sistema.");
    if (clean === mainClean) return setTelefoneConjugeError("O telefone do cônjuge não pode ser igual ao do auxiliar.");
    setTelefoneConjugeError("");
  }, [telefoneConjuge, telefone, existingAuxiliaries, auxiliary]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!foto) return toast.error("Por favor, carregue a foto do auxiliar.");
    if (nomeError || telefoneError || telefoneConjugeError)
      return toast.error("Corrija os erros no formulário antes de continuar.");

    const updatedAuxiliary: Auxiliary = {
      ...auxiliary!,
      nome,
      telefone,
      estadoCivil,
      foto,
      obreiro,
      batizado,
      conjuge: showSpouseFields
        ? {
            ...auxiliary?.conjuge,
            nome: nomeConjuge,
            telefone: telefoneConjuge,
            foto: fotoConjuge,
            obreiro: obreiroConjuge,
            batizado: batizadoConjuge,
          }
        : undefined,
    };

    onSave(updatedAuxiliary);
    toast.success("Auxiliar atualizado com sucesso!");
    handleClose();
  };

  const handleClose = () => {
    onClose();
    // opcional: reset de estados
  };

  if (!auxiliary) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto bg-white border-purple-200">
        <DialogHeader>
          <DialogTitle className="text-purple-900 flex items-center gap-2">
            <Heart className="w-5 h-5 text-purple-400 fill-purple-200" />
            Editar Auxiliar
          </DialogTitle>
          <DialogDescription className="text-purple-600">
            💕 Atualize os dados do auxiliar no sistema.
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
                  className={`bg-purple-50/50 border border-purple-100 ${nomeError ? "border-2 border-red-500" : ""}`}
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
                  defaultValue={auxiliary.nome.toLowerCase().replace(/\s+/g, ".")}
                  className="bg-purple-50/50 border border-purple-100"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="estadoCivil">Estado Civil *</Label>
                <Select required value={estadoCivil}>
                  <SelectTrigger id="estadoCivil" className="bg-purple-50/50 border border-purple-100">
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
                  className="bg-purple-50/50 border border-purple-100"
                />
              </div>

              <div className="space-y-3 md:col-span-2">
                <Label>Informações Eclesiástico</Label>
                <div className="flex gap-6">
                  <div className="flex items-center gap-2">
                    <Checkbox id="obreiro" defaultValue={auxiliary.obreiro}  />
                    <Label htmlFor="obreiro" className="cursor-pointer">
                      É Obreiro
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox id="batizado" defaultValue={auxiliary.batizado} />
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
                <Select required defaultValue={auxiliary.enderecoResidencial.provincia.toLowerCase()} >
                  <SelectTrigger id="provinciaResidencial" className="bg-purple-50/50 border border-purple-100">
                    <SelectValue placeholder="Selecione a província" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="luanda">Luanda</SelectItem>
                    <SelectItem value="benguela">Benguela</SelectItem>
                    <SelectItem value="huambo">Huambo</SelectItem>
                    <SelectItem value="huila">Huíla</SelectItem>
                    <SelectItem value="cabinda">Cabinda</SelectItem>
                    <SelectItem value="namibe">Namibe</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="municipioResidencial">Município *</Label>
                <Input
                  id="municipioResidencial"
                  placeholder="Nome do município"
                  required
                  defaultValue={auxiliary.enderecoResidencial.municipio}
                  className="bg-purple-50/50 border border-purple-100"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bairroResidencial">Bairro *</Label>
                <Input
                  id="bairroResidencial"
                  placeholder="Nome do bairro"
                  required
                  defaultValue={auxiliary.enderecoResidencial.bairro}
                  className="bg-purple-50/50 border border-purple-100"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ruaResidencial">Rua *</Label>
                <Input
                  id="ruaResidencial"
                  placeholder="Nome da rua"
                  required
                  defaultValue={auxiliary.enderecoResidencial.rua}
                  className="bg-purple-50/50 border border-purple-100"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="numeroCasaResidencial">Número da Casa *</Label>
                <Input
                  id="numeroCasaResidencial"
                  placeholder="Nº"
                  required
                  defaultValue={auxiliary.enderecoResidencial.numeroCasa}
                  className="bg-purple-50/50 border border-purple-100"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="referenciaResidencial">Ponto de Referência</Label>
                <Input
                  id="referenciaResidencial"
                  placeholder="Ex: Próximo ao mercado"
                  defaultValue={auxiliary.enderecoResidencial.pontoReferencia}
                  className="bg-purple-50/50 border border-purple-100"
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
                      defaultValue={auxiliary.conjuge?.nome}
                      className="bg-white border border-purple-100"
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
                      className="bg-white border border-purple-100"
                    />
                  </div>

                  <div className="space-y-3 md:col-span-2">
                    <Label>Status Eclesiástico do Cônjuge</Label>
                    <div className="flex gap-6">
                      <div className="flex items-center gap-2">
                        <Checkbox id="obreiroConjuge" defaultChecked={auxiliary.conjuge?.obreiro} />
                        <Label htmlFor="obreiroConjuge" className="cursor-pointer">
                          É Obreiro
                        </Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Checkbox id="batizadoConjuge" defaultChecked={auxiliary.conjuge?.batizado} />
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
                <Select required defaultValue={auxiliary.igreja.toLowerCase().replace(/ /g, "-")}>
                  <SelectTrigger id="igreja" className="bg-purple-50/50 border border-purple-100">
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
                <Select required defaultValue={auxiliary.regiao.toLowerCase()}>
                  <SelectTrigger id="regiao" className="bg-purple-50/50 border border-purple-100">
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
                <Select required defaultValue={auxiliary.enderecoIgreja.provincia.toLowerCase()}>
                  <SelectTrigger id="provinciaIgreja" className="bg-purple-50/50 border border-purple-100">
                    <SelectValue placeholder="Selecione a província" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="luanda">Luanda</SelectItem>
                    <SelectItem value="benguela">Benguela</SelectItem>
                    <SelectItem value="huambo">Huambo</SelectItem>
                    <SelectItem value="huila">Huíla</SelectItem>
                    <SelectItem value="cabinda">Cabinda</SelectItem>
                    <SelectItem value="namibe">Namibe</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="municipioIgreja">Município *</Label>
                <Input
                  id="municipioIgreja"
                  placeholder="Nome do município"
                  required
                  defaultValue={auxiliary.enderecoIgreja.municipio}
                  className="bg-purple-50/50 border border-purple-100"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bairroIgreja">Bairro *</Label>
                <Input
                  id="bairroIgreja"
                  placeholder="Nome do bairro"
                  required
                  defaultValue={auxiliary.enderecoIgreja.bairro}
                  className="bg-purple-50/50 border border-purple-100"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ruaIgreja">Rua *</Label>
                <Input
                  id="ruaIgreja"
                  placeholder="Nome da rua"
                  required
                  defaultValue={auxiliary.enderecoIgreja.rua}
                  className="bg-purple-50/50 border border-purple-100"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="numeroCasaIgreja">Número *</Label>
                <Input
                  id="numeroCasaIgreja"
                  placeholder="Nº"
                  required
                  defaultValue={auxiliary.enderecoIgreja.numeroCasa}
                  className="bg-purple-50/50 border border-purple-100"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="referenciaIgreja">Ponto de Referência</Label>
                <Input
                  id="referenciaIgreja"
                  placeholder="Ex: Próximo à praça principal"
                  defaultValue={auxiliary.enderecoIgreja.pontoReferencia}
                  className="bg-purple-50/50 border border-purple-100"
                />
              </div>
            </div>
          </div>

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
              💕 Salvar Alterações
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
