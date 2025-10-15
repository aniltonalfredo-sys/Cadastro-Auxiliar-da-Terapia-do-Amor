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
  onSave: (updatedAux: Auxiliary) => void;
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
  // Estados principais
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [estadoCivil, setEstadoCivil] = useState("");
  const [foto, setFoto] = useState("");
  const [obreiro, setObreiro] = useState(false);
  const [batizado, setBatizado] = useState(false);
  const [email, setEmail] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");

  // Conjuge
  const [fotoConjuge, setFotoConjuge] = useState("");
  const [nomeConjuge, setNomeConjuge] = useState("");
  const [telefoneConjuge, setTelefoneConjuge] = useState("");
  const [obreiroConjuge, setObreiroConjuge] = useState(false);
  const [batizadoConjuge, setBatizadoConjuge] = useState(false);

  // Endereços
  const [enderecoResidencial, setEnderecoResidencial] = useState({
    provincia: "",
    municipio: "",
    bairro: "",
    rua: "",
    numeroCasa: "",
    pontoReferencia: ""
  });

  const [igreja, setIgreja] = useState("");
  const [regiao, setRegiao] = useState("");
  const [enderecoIgreja, setEnderecoIgreja] = useState({
    provincia: "",
    municipio: "",
    bairro: "",
    rua: "",
    numeroCasa: "",
    pontoReferencia: ""
  });

  // Erros
  const [nomeError, setNomeError] = useState("");
  const [telefoneError, setTelefoneError] = useState("");
  const [telefoneConjugeError, setTelefoneConjugeError] = useState("");

  const showSpouseFields = estadoCivil !== "" && estadoCivil !== "solteiro";

  // 🧩 Carregar dados do auxiliar selecionado - CORRIGIDO
  useEffect(() => {
    if (auxiliary && open) {
      console.log("Dados do auxiliar para edição:", auxiliary);

      // Dados básicos
      setNome(auxiliary.nome || "");
      setTelefone(auxiliary.telefone || "");
      setFoto(auxiliary.foto || "");
      setEmail(auxiliary.email || "");
      setDataNascimento(auxiliary.dataNascimento || "");

      // Estado Civil - mapeamento correto
      const estadoCivilMap: { [key: string]: string } = {
        "Solteiro(a)": "solteiro",
        "Casado(a)": "casado",
        "União Estável": "uniao-estavel",
        "Divorciado(a)": "divorciado",
        "Viúvo(a)": "viuvo"
      };

      const estadoCivilValue = estadoCivilMap[auxiliary.estadoCivil] || "";
      setEstadoCivil(estadoCivilValue);

      // Informações eclesiásticas
      setObreiro(auxiliary.obreiro || false);
      setBatizado(auxiliary.batizado || false);
      setIgreja(auxiliary.igreja || "");
      setRegiao(auxiliary.regiao || "");

      // Endereço residencial
      setEnderecoResidencial({
        provincia: auxiliary.enderecoResidencial?.provincia || "",
        municipio: auxiliary.enderecoResidencial?.municipio || "",
        bairro: auxiliary.enderecoResidencial?.bairro || "",
        rua: auxiliary.enderecoResidencial?.rua || "",
        numeroCasa: auxiliary.enderecoResidencial?.numeroCasa || "",
        pontoReferencia: auxiliary.enderecoResidencial?.pontoReferencia || ""
      });

      // Endereço da igreja
      setEnderecoIgreja({
        provincia: auxiliary.enderecoIgreja?.provincia || "",
        municipio: auxiliary.enderecoIgreja?.municipio || "",
        bairro: auxiliary.enderecoIgreja?.bairro || "",
        rua: auxiliary.enderecoIgreja?.rua || "",
        numeroCasa: auxiliary.enderecoIgreja?.numeroCasa || "",
        pontoReferencia: auxiliary.enderecoIgreja?.pontoReferencia || ""
      });

      // Dados do cônjuge
      if (auxiliary.conjuge) {
        console.log("Dados do cônjuge:", auxiliary.conjuge);
        setNomeConjuge(auxiliary.conjuge.nome || "");
        setTelefoneConjuge(auxiliary.conjuge.telefone || "");
        setFotoConjuge(auxiliary.conjuge.foto || "");
        setObreiroConjuge(auxiliary.conjuge.obreiro || false);
        setBatizadoConjuge(auxiliary.conjuge.batizado || false);
      } else {
        // Reset dos campos do cônjuge se não existir
        setNomeConjuge("");
        setTelefoneConjuge("");
        setFotoConjuge("");
        setObreiroConjuge(false);
        setBatizadoConjuge(false);
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

    // Validações básicas
    if (!foto) {
      toast.error("Por favor, carregue a foto do auxiliar.");
      return;
    }

    if (!nome.trim()) {
      toast.error("Nome é obrigatório");
      return;
    }

    if (!telefone.trim()) {
      toast.error("Telefone é obrigatório");
      return;
    }

    if (!estadoCivil) {
      toast.error("Estado civil é obrigatório");
      return;
    }

    if (nomeError || telefoneError || telefoneConjugeError) {
      toast.error("Corrija os erros no formulário antes de continuar.");
      return;
    }

    // Mapear estado civil de volta para o formato original
    const estadoCivilMap: { [key: string]: string } = {
      "solteiro": "Solteiro(a)",
      "casado": "Casado(a)",
      "uniao-estavel": "União Estável",
      "divorciado": "Divorciado(a)",
      "viuvo": "Viúvo(a)"
    };

    const updatedAuxiliary: Auxiliary = {
      ...auxiliary!,
      nome: nome.trim(),
      telefone,
      email: email.trim(),
      dataNascimento,
      estadoCivil: estadoCivilMap[estadoCivil] || estadoCivil,
      foto,
      obreiro,
      batizado,
      enderecoResidencial,
      igreja,
      regiao,
      enderecoIgreja,
      conjuge: showSpouseFields
        ? {
          ...auxiliary?.conjuge,
          nome: nomeConjuge.trim(),
          telefone: telefoneConjuge,
          foto: fotoConjuge,
          obreiro: obreiroConjuge,
          batizado: batizadoConjuge,
        }
        : undefined,
    };

    console.log("Dados enviados para atualização:", updatedAuxiliary);
    onSave(updatedAuxiliary);
    toast.success("Auxiliar actualizado com sucesso!");
    handleClose();
  };

  const handleClose = () => {
    // Resetar todos os estados
    setNome("");
    setTelefone("");
    setEstadoCivil("");
    setFoto("");
    setObreiro(false);
    setBatizado(false);
    setEmail("");
    setDataNascimento("");
    setEnderecoResidencial({
      provincia: "",
      municipio: "",
      bairro: "",
      rua: "",
      numeroCasa: "",
      pontoReferencia: ""
    });
    setIgreja("");
    setRegiao("");
    setEnderecoIgreja({
      provincia: "",
      municipio: "",
      bairro: "",
      rua: "",
      numeroCasa: "",
      pontoReferencia: ""
    });
    setFotoConjuge("");
    setNomeConjuge("");
    setTelefoneConjuge("");
    setObreiroConjuge(false);
    setBatizadoConjuge(false);
    setNomeError("");
    setTelefoneError("");
    setTelefoneConjugeError("");

    onClose();
  };

  if (!auxiliary) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto bg-white border-purple-200">
        <DialogHeader>
          <DialogTitle className="text-purple-900 flex items-center gap-2">
            <Heart className="w-5 h-5 text-purple-400 fill-purple-200" />
            Editar Auxiliar: {auxiliary.nome}
          </DialogTitle>
          <DialogDescription className="text-purple-600">
            💕 Actualize os dados do auxiliar no sistema.
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
                  className={`bg-[#F7F8FA] border-0 ${telefoneError ? "border-2 border-red-500" : ""}`}
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-[#F7F8FA] border-0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="estadoCivil">Estado Civil *</Label>
                <Select required value={estadoCivil} onValueChange={setEstadoCivil}>
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
                  value={dataNascimento}
                  onChange={(e) => setDataNascimento(e.target.value)}
                  className="bg-[#F7F8FA] border-0"
                />
              </div>

              <div className="space-y-3 md:col-span-2">
                <Label>Informações Eclesiásticas</Label>
                <div className="flex gap-6">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="obreiro"
                      checked={obreiro}
                      onCheckedChange={(checked: any) => setObreiro(checked === true)}
                    />
                    <Label htmlFor="obreiro" className="cursor-pointer">
                      É Obreiro
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="batizado"
                      checked={batizado}
                      onCheckedChange={(checked: any) => setBatizado(checked === true)}
                    />
                    <Label htmlFor="batizado" className="cursor-pointer">
                      É Baptizado
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
                <Select
                  required
                  value={enderecoResidencial.provincia}
                  onValueChange={(value: any) => setEnderecoResidencial(prev => ({ ...prev, provincia: value }))}
                >
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
                  value={enderecoResidencial.municipio}
                  onChange={(e) => setEnderecoResidencial(prev => ({ ...prev, municipio: e.target.value }))}
                  className="bg-[#F7F8FA] border-0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bairroResidencial">Bairro *</Label>
                <Input
                  id="bairroResidencial"
                  placeholder="Nome do bairro"
                  required
                  value={enderecoResidencial.bairro}
                  onChange={(e) => setEnderecoResidencial(prev => ({ ...prev, bairro: e.target.value }))}
                  className="bg-[#F7F8FA] border-0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ruaResidencial">Rua *</Label>
                <Input
                  id="ruaResidencial"
                  placeholder="Nome da rua"
                  required
                  value={enderecoResidencial.rua}
                  onChange={(e) => setEnderecoResidencial(prev => ({ ...prev, rua: e.target.value }))}
                  className="bg-[#F7F8FA] border-0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="numeroCasaResidencial">Número da Casa *</Label>
                <Input
                  id="numeroCasaResidencial"
                  placeholder="Nº"
                  required
                  value={enderecoResidencial.numeroCasa}
                  onChange={(e) => setEnderecoResidencial(prev => ({ ...prev, numeroCasa: e.target.value }))}
                  className="bg-[#F7F8FA] border-0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="referenciaResidencial">Ponto de Referência</Label>
                <Input
                  id="referenciaResidencial"
                  placeholder="Ex: Próximo ao mercado"
                  value={enderecoResidencial.pontoReferencia}
                  onChange={(e) => setEnderecoResidencial(prev => ({ ...prev, pontoReferencia: e.target.value }))}
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
                      value={nomeConjuge}
                      onChange={(e) => setNomeConjuge(e.target.value)}
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
                      className={`bg-white border-0 ${telefoneConjugeError ? "border-2 border-red-500" : ""}`}
                    />
                    {telefoneConjugeError && (
                      <div className="flex items-center gap-2 text-red-600 text-sm">
                        <AlertCircle className="w-4 h-4" />
                        <span>{telefoneConjugeError}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3 md:col-span-2">
                    <Label>Status Eclesiástico do Cônjuge</Label>
                    <div className="flex gap-6">
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id="obreiroConjuge"
                          checked={obreiroConjuge}
                          onCheckedChange={(checked: any) => setObreiroConjuge(checked === true)}
                        />
                        <Label htmlFor="obreiroConjuge" className="cursor-pointer">
                          É Obreiro
                        </Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id="batizadoConjuge"
                          checked={batizadoConjuge}
                          onCheckedChange={(checked: any) => setBatizadoConjuge(checked === true)}
                        />
                        <Label htmlFor="batizadoConjuge" className="cursor-pointer">
                          É Baptizado
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
                <Select
                  required
                  value={igreja}
                  onValueChange={setIgreja}
                >
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
                <Select
                  required
                  value={regiao}
                  onValueChange={setRegiao}
                >
                  <SelectTrigger id="regiao" className="bg-[#F7F8FA] border-0">
                    <SelectValue placeholder="Selecione a região" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Centro">Centro</SelectItem>
                    <SelectItem value="Norte">Norte</SelectItem>
                    <SelectItem value="Sul">Sul</SelectItem>
                    <SelectItem value="Leste">Leste</SelectItem>
                    <SelectItem value="Oeste">Oeste</SelectItem>
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
                <Select
                  required
                  value={enderecoIgreja.provincia}
                  onValueChange={(value: any) => setEnderecoIgreja(prev => ({ ...prev, provincia: value }))}
                >
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
                  value={enderecoIgreja.municipio}
                  onChange={(e) => setEnderecoIgreja(prev => ({ ...prev, municipio: e.target.value }))}
                  className="bg-[#F7F8FA] border-0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bairroIgreja">Bairro *</Label>
                <Input
                  id="bairroIgreja"
                  placeholder="Nome do bairro"
                  required
                  value={enderecoIgreja.bairro}
                  onChange={(e) => setEnderecoIgreja(prev => ({ ...prev, bairro: e.target.value }))}
                  className="bg-[#F7F8FA] border-0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ruaIgreja">Rua *</Label>
                <Input
                  id="ruaIgreja"
                  placeholder="Nome da rua"
                  required
                  value={enderecoIgreja.rua}
                  onChange={(e) => setEnderecoIgreja(prev => ({ ...prev, rua: e.target.value }))}
                  className="bg-[#F7F8FA] border-0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="numeroCasaIgreja">Número *</Label>
                <Input
                  id="numeroCasaIgreja"
                  placeholder="Nº"
                  required
                  value={enderecoIgreja.numeroCasa}
                  onChange={(e) => setEnderecoIgreja(prev => ({ ...prev, numeroCasa: e.target.value }))}
                  className="bg-[#F7F8FA] border-0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="referenciaIgreja">Ponto de Referência</Label>
                <Input
                  id="referenciaIgreja"
                  placeholder="Ex: Próximo à praça principal"
                  value={enderecoIgreja.pontoReferencia}
                  onChange={(e) => setEnderecoIgreja(prev => ({ ...prev, pontoReferencia: e.target.value }))}
                  className="bg-[#F7F8FA] border-0"
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
            >
              💕 Salvar Alterações
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}