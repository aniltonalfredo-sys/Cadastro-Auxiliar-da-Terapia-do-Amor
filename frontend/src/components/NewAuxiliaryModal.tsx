import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Checkbox } from "./ui/checkbox";
import { PhotoUpload } from "./PhotoUpload";
import { PhoneInput } from "./PhoneInput";
import { SearchableSelect } from "./SearchableSelect";
import { Separator } from "./ui/separator";
import { toast } from "sonner";
import { Users, MapPin, AlertCircle, Heart } from "lucide-react";
import type { Auxiliary } from "./AuxiliariesTable";
import { getProvincias, getMunicipiosByProvincia } from "../data/angola-locations";

interface NewAuxiliaryModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (auxiliary: Auxiliary) => void;
  existingAuxiliaries: Auxiliary[];
}

export function NewAuxiliaryModal({ open, onClose, onSave, existingAuxiliaries }: NewAuxiliaryModalProps) {
  const [estadoCivil, setEstadoCivil] = useState<string>("");
  const [foto, setFoto] = useState<string>("");
  const [fotoConjuge, setFotoConjuge] = useState<string>("");

  // Form fields
  const [nome, setNome] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [telefone, setTelefone] = useState<string>("");
  const [telefoneConjuge, setTelefoneConjuge] = useState<string>("");
  const [igreja, setIgreja] = useState<string>("");
  const [regiao, setRegiao] = useState<string>("");
  const [obreiro, setObreiro] = useState(false);
  const [batizado, setBatizado] = useState(false);
  const [provinciaResidencial, setProvinciaResidencial] = useState<string>("");
  const [municipioResidencial, setMunicipioResidencial] = useState<string>("");
  const [bairroResidencial, setBairroResidencial] = useState<string>("");
  const [ruaResidencial, setRuaResidencial] = useState<string>("");
  const [numeroCasaResidencial, setNumeroCasaResidencial] = useState<string>("");
  const [referenciaResidencial, setReferenciaResidencial] = useState<string>("");
  const [provinciaIgreja, setProvinciaIgreja] = useState<string>("");
  const [municipioIgreja, setMunicipioIgreja] = useState<string>("");
  const [bairroIgreja, setBairroIgreja] = useState<string>("");
  const [ruaIgreja, setRuaIgreja] = useState<string>("");
  const [numeroCasaIgreja, setNumeroCasaIgreja] = useState<string>("");
  const [referenciaIgreja, setReferenciaIgreja] = useState<string>("");
  const [nomeConjuge, setNomeConjuge] = useState<string>("");
  const [obreiroConjuge, setObreiroConjuge] = useState(false);
  const [batizadoConjuge, setBatizadoConjuge] = useState(false);

  const [emailConjuge, setEmailConjuge] = useState<string>("");
  const [numeroResidencial, setNumeroResidencial] = useState<string>("");
  const [numeroIgreja, setNumeroIgreja] = useState<string>("");
  // Validation states
  const [nomeError, setNomeError] = useState<string>("");
  const [telefoneError, setTelefoneError] = useState<string>("");
  const [telefoneConjugeError, setTelefoneConjugeError] = useState<string>("");


  const [dataNascimento, setDataNascimento] = useState<string>("");
  const [dataUniao, setDataUniao] = useState<string>("");
  const [tempoRelacionamento, setTempoRelacionamento] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  
  
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
    if (cleanPhone.length < 12) {
      setTelefoneConjugeError("");
      return;
    }

    const isDuplicate = existingAuxiliaries.some((aux) => {
      const auxPhone = aux.telefone.replace(/\D/g, "");
      const spousePhone = aux.conjuge?.telefone.replace(/\D/g, "");
      return auxPhone === cleanPhone || spousePhone === cleanPhone;
    });

    const sameAsMain = telefone.replace(/\D/g, "") === cleanPhone;

    if (isDuplicate) {
      setTelefoneConjugeError("Este telefone já está cadastrado no sistema.");
    } else if (sameAsMain) {
      setTelefoneConjugeError("O telefone do cônjuge não pode ser igual ao do auxiliar.");
    } else {
      setTelefoneConjugeError("");
    }
  }, [telefoneConjuge, telefone, existingAuxiliaries]);

  // Get available data
  const provincias = getProvincias();
  const municipiosResidenciais = provinciaResidencial ? getMunicipiosByProvincia(provinciaResidencial) : [];
  const municipiosIgreja = provinciaIgreja ? getMunicipiosByProvincia(provinciaIgreja) : [];

  // Reset município when província changes
  useEffect(() => {
    if (provinciaResidencial) {
      const municipios = getMunicipiosByProvincia(provinciaResidencial);
      if (municipioResidencial && !municipios.includes(municipioResidencial)) {
        setMunicipioResidencial("");
      }
    }
  }, [provinciaResidencial, municipioResidencial]);

  useEffect(() => {
    if (provinciaIgreja) {
      const municipios = getMunicipiosByProvincia(provinciaIgreja);
      if (municipioIgreja && !municipios.includes(municipioIgreja)) {
        setMunicipioIgreja("");
      }
    }
  }, [provinciaIgreja, municipioIgreja]);

  const handleEstadoCivilChange = (value: string) => {
    setEstadoCivil(value);
    if (value === "solteiro") {
      setFotoConjuge("");
      setTelefoneConjuge("");
      setNomeConjuge("");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Mapear valores para o formato correto
      const estadoCivilMap: { [key: string]: string } = {
        "solteiro": "Solteiro(a)",
        "casado": "Casado(a)",
        "uniao-estavel": "União Estável",
        "divorciado": "Divorciado(a)",
        "viuvo": "Viúvo(a)"
      };

      const igrejaMap: { [key: string]: string } = {
        "central": "Igreja Central",
        "nova-esperanca": "Igreja Nova Esperança",
        "fe-viva": "Igreja Fé Viva",
        "luz-divina": "Igreja Luz Divina",
        "amor-perfeito": "Igreja Amor Perfeito"
      };

      const regiaoMap: { [key: string]: string } = {
        "norte": "Norte",
        "sul": "Sul",
        "leste": "Leste",
        "oeste": "Oeste",
        "centro": "Centro"
      };

      // Função para capitalizar a primeira letra
      const capitalizar = (texto: string) => {
        return texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase();
      };

      const novoAuxiliar: Auxiliary = {
        nome: nome.trim(),
        telefone,
        email: email.trim(),
        igreja: igrejaMap[igreja] || igreja,
        regiao: regiaoMap[regiao] || regiao,
        estadoCivil: estadoCivilMap[estadoCivil] || estadoCivil,
        dataNascimento,
        foto,
        obreiro,
        batizado,
        dataCadastro: new Date().toISOString(),
        enderecoResidencial: {
          provincia: capitalizar(provinciaResidencial),
          municipio: capitalizar(municipioResidencial),
          bairro: capitalizar(bairroResidencial),
          rua: capitalizar(ruaResidencial),
          numeroCasa: numeroResidencial,
          pontoReferencia: referenciaResidencial,
        },
        enderecoIgreja: {
          provincia: capitalizar(provinciaIgreja),
          municipio: capitalizar(municipioIgreja),
          bairro: capitalizar(bairroIgreja),
          rua: capitalizar(ruaIgreja),
          numeroCasa: numeroIgreja,
          pontoReferencia: referenciaIgreja,
        },
        conjuge: showSpouseFields
          ? {
            nome: nomeConjuge.trim(),
            telefone: telefoneConjuge,
            foto: fotoConjuge,
            obreiro: obreiroConjuge,
            batizado: batizadoConjuge,
          }
          : undefined,
        id: ""
      };

      console.log("Dados mapeados para envio:", novoAuxiliar);
      onSave(novoAuxiliar);
      handleClose();
      toast.success("Auxiliar cadastrado com sucesso!");

    } catch (error: any) {
      toast.error(`Erro ao salvar auxiliar: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }

  };

  const resetForm = () => {
    setEstadoCivil("");
    setFoto("");
    setFotoConjuge("");
    setNome("");
    setTelefone("");
    setTelefoneConjuge("");
    setNomeConjuge("");
    // setEmail("");
    // setEmailConjuge("");
    setIgreja("");
    setRegiao("");
    setProvinciaResidencial("");
    setMunicipioResidencial("");
    setBairroResidencial("");
    setRuaResidencial("");
    // setNumeroResidencial("");
    setReferenciaResidencial("");
    setProvinciaIgreja("");
    setMunicipioIgreja("");
    setBairroIgreja("");
    setRuaIgreja("");
    // setNumeroIgreja("");
    setReferenciaIgreja("");
    setObreiro(false);
    setBatizado(false);
    setObreiroConjuge(false);
    setBatizadoConjuge(false);
    // setDataNascimento("");
    // setDataUniao("");
    // setTempoRelacionamento("");
    setNomeError("");
    setTelefoneError("");
    setTelefoneConjugeError("");
    // setIsSubmitting(false);
    setEstadoCivil("");
    setFoto("");
    setFotoConjuge("");


  };

  const handleClose = () => {
    // Reset form
    resetForm();
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
                    <Checkbox id="obreiro" checked={obreiro} onCheckedChange={(checked: any) => setObreiro(checked === true)} />
                    <Label htmlFor="obreiro" className="cursor-pointer">
                      É Obreiro
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox id="batizado" checked={batizado} onCheckedChange={(checked: any) => setBatizado(checked === true)} />
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
                <SearchableSelect
                  id="provinciaResidencial"
                  value={provinciaResidencial}
                  onChange={setProvinciaResidencial}
                  options={provincias}
                  placeholder="Selecione a província"
                  searchPlaceholder="Pesquisar província..."
                  className="bg-purple-50/50 border border-purple-100"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="municipioResidencial">Município *</Label>
                <SearchableSelect
                  id="municipioResidencial"
                  value={municipioResidencial}
                  onChange={setMunicipioResidencial}
                  options={municipiosResidenciais}
                  placeholder="Selecione o município"
                  searchPlaceholder="Pesquisar município..."
                  disabled={!provinciaResidencial}
                  className="bg-purple-50/50 border border-purple-100"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bairroResidencial">Bairro *</Label>
                <Input
                  id="bairroResidencial"
                  placeholder="Nome do bairro"
                  required
                  value={bairroResidencial}
                  onChange={(e) => setBairroResidencial(e.target.value)}
                  className="bg-[#F7F8FA] border-0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ruaResidencial">Rua *</Label>
                <Input
                  id="ruaResidencial"
                  placeholder="Nome da rua"
                  required
                  value={ruaResidencial}
                  onChange={(e) => setRuaResidencial(e.target.value)}
                  className="bg-[#F7F8FA] border-0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="numeroCasaResidencial">Número da Casa *</Label>
                <Input
                  id="numeroCasaResidencial"
                  placeholder="Nº"
                  required
                  value={numeroCasaResidencial}
                  onChange={(e) => setNumeroCasaResidencial(e.target.value)}
                  className="bg-[#F7F8FA] border-0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="referenciaResidencial">Ponto de Referência</Label>
                <Input
                  id="referenciaResidencial"
                  placeholder="Ex: Próximo ao mercado"
                  value={referenciaResidencial}
                  onChange={(e) => setReferenciaResidencial(e.target.value)}
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
                        <Checkbox id="obreiroConjuge" checked={obreiroConjuge} onCheckedChange={(checked: any) => setObreiroConjuge(checked === true)} />
                        <Label htmlFor="obreiroConjuge" className="cursor-pointer">
                          É Obreiro
                        </Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Checkbox id="batizadoConjuge" checked={batizadoConjuge} onCheckedChange={(checked: any) => setBatizadoConjuge(checked === true)} />
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
                <Select required value={igreja} onValueChange={setIgreja}>
                  <SelectTrigger id="igreja" className="bg-[#F7F8FA] border-0">
                    <SelectValue placeholder="Selecione a igreja" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Igreja Central">Igreja Central</SelectItem>
                    <SelectItem value="Igreja Nova Esperança">Igreja Nova Esperança</SelectItem>
                    <SelectItem value="Igreja Fé Viva">Igreja Fé Viva</SelectItem>
                    <SelectItem value="Igreja Luz Divina">Igreja Luz Divina</SelectItem>
                    <SelectItem value="Igreja Amor Perfeito">Igreja Amor Perfeito</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="regiao">Região *</Label>
                <Select required value={regiao} onValueChange={setRegiao}>
                  <SelectTrigger id="regiao" className="bg-[#F7F8FA] border-0">
                    <SelectValue placeholder="Selecione a região" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Norte">Norte</SelectItem>
                    <SelectItem value="Sul">Sul</SelectItem>
                    <SelectItem value="Leste">Leste</SelectItem>
                    <SelectItem value="Oeste">Oeste</SelectItem>
                    <SelectItem value="Centro">Centro</SelectItem>
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
                <SearchableSelect
                  id="provinciaIgreja"
                  value={provinciaIgreja}
                  onChange={setProvinciaIgreja}
                  options={provincias}
                  placeholder="Selecione a província"
                  searchPlaceholder="Pesquisar província..."
                  className="bg-purple-50/50 border border-purple-100"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="municipioIgreja">Município *</Label>
                <SearchableSelect
                  id="municipioIgreja"
                  value={municipioIgreja}
                  onChange={setMunicipioIgreja}
                  options={municipiosIgreja}
                  placeholder="Selecione o município"
                  searchPlaceholder="Pesquisar município..."
                  disabled={!provinciaIgreja}
                  className="bg-purple-50/50 border border-purple-100"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bairroIgreja">Bairro *</Label>
                <Input
                  id="bairroIgreja"
                  placeholder="Nome do bairro"
                  required
                  value={bairroIgreja}
                  onChange={(e) => setBairroIgreja(e.target.value)}
                  className="bg-[#F7F8FA] border-0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ruaIgreja">Rua *</Label>
                <Input
                  id="ruaIgreja"
                  placeholder="Nome da rua"
                  required
                  value={ruaIgreja}
                  onChange={(e) => setRuaIgreja(e.target.value)}
                  className="bg-[#F7F8FA] border-0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="numeroCasaIgreja">Número *</Label>
                <Input
                  id="numeroCasaIgreja"
                  placeholder="Nº"
                  required
                  value={numeroCasaIgreja}
                  onChange={(e) => setNumeroCasaIgreja(e.target.value)}
                  className="bg-[#F7F8FA] border-0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="referenciaIgreja">Ponto de Referência</Label>
                <Input
                  id="referenciaIgreja"
                  placeholder="Ex: Próximo à praça principal"
                  value={referenciaIgreja}
                  onChange={(e) => setReferenciaIgreja(e.target.value)}
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
