import { X, Phone, Mail, Calendar, MapPin, Church, Heart, Droplet, CheckCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import type { Auxiliary } from "./AuxiliariesTable";

interface AuxiliaryDetailsModalProps {
  auxiliary: Auxiliary | null;
  open: boolean;
  onClose: () => void;
  onEdit: (auxiliary: Auxiliary) => void;
}

export function AuxiliaryDetailsModal({
  auxiliary,
  open,
  onClose,
  onEdit,
}: AuxiliaryDetailsModalProps) {
  if (!auxiliary) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white border-purple-200">
        <DialogHeader>
          <DialogTitle className="text-purple-900 flex items-center gap-2">
            <Heart className="w-5 h-5 text-purple-400 fill-purple-200" />
            Detalhes do Auxiliar
          </DialogTitle>
          <DialogDescription className="text-purple-600">
            Visualize todas as informações cadastradas do auxiliar.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header with Photo */}
          <div className="flex items-start gap-6">
            <Avatar className="w-24 h-24">
              <AvatarImage src={auxiliary.foto} alt={auxiliary.nome} />
              <AvatarFallback>
                {auxiliary.nome
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .substring(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2>{auxiliary.nome}</h2>
              <p className="text-gray-500 mb-3">Auxiliar da Terapia do Amor</p>
              <div className="flex gap-2">
                {auxiliary.obreiro && (
                  <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Obreiro
                  </Badge>
                )}
                {auxiliary.batizado && (
                  <Badge className="bg-pink-100 text-pink-800 hover:bg-pink-100">
                    <Droplet className="w-3 h-3 mr-1" />
                    Baptizado
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* Personal Information */}
          <div>
            <h3 className="mb-4">Informações Pessoais</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                  <Heart className="w-5 h-5 text-[#9333EA]" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Estado Civil</p>
                  <p>{auxiliary.estadoCivil}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                  <Phone className="w-5 h-5 text-[#9333EA]" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Telefone/WhatsApp</p>
                  <p>{auxiliary.telefone}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                  <Mail className="w-5 h-5 text-[#9333EA]" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">E-mail</p>
                  <p className="text-sm">{auxiliary.nome.toLowerCase().replace(/\s+/g, ".")}@email.com</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-[#9333EA]" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Data de Cadastro</p>
                  <p>{auxiliary.dataCadastro}</p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Residential Address */}
          <div>
            <h3 className="mb-4">Endereço Residencial</h3>
            <div className="bg-[#F7F8FA] rounded-lg p-4">
              <p>
                <span className="text-gray-600">Rua:</span> {auxiliary.enderecoResidencial.rua}, Nº {auxiliary.enderecoResidencial.numeroCasa}
              </p>
              <p>
                <span className="text-gray-600">Bairro:</span> {auxiliary.enderecoResidencial.bairro}
              </p>
              <p>
                <span className="text-gray-600">Município:</span> {auxiliary.enderecoResidencial.municipio}, <span className="text-gray-600">Província:</span> {auxiliary.enderecoResidencial.provincia}
              </p>
              {auxiliary.enderecoResidencial.pontoReferencia && (
                <p>
                  <span className="text-gray-600">Ponto de Referência:</span> {auxiliary.enderecoResidencial.pontoReferencia}
                </p>
              )}
            </div>
          </div>

          <Separator />

          {/* Church Information */}
          <div>
            <h3 className="mb-4">Informações Eclesiásticas</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                  <Church className="w-5 h-5 text-[#9333EA]" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Igreja</p>
                  <p>{auxiliary.igreja}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-[#9333EA]" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Região</p>
                  <p>{auxiliary.regiao}</p>
                </div>
              </div>
            </div>

            <h4 className="mb-2">Endereço da Igreja</h4>
            <div className="bg-[#F7F8FA] rounded-lg p-4">
              <p>
                <span className="text-gray-600">Rua:</span> {auxiliary.enderecoIgreja.rua}, Nº {auxiliary.enderecoIgreja.numeroCasa}
              </p>
              <p>
                <span className="text-gray-600">Bairro:</span> {auxiliary.enderecoIgreja.bairro}
              </p>
              <p>
                <span className="text-gray-600">Município:</span> {auxiliary.enderecoIgreja.municipio}, <span className="text-gray-600">Província:</span> {auxiliary.enderecoIgreja.provincia}
              </p>
              {auxiliary.enderecoIgreja.pontoReferencia && (
                <p>
                  <span className="text-gray-600">Ponto de Referência:</span> {auxiliary.enderecoIgreja.pontoReferencia}
                </p>
              )}
            </div>
          </div>

          <Separator />

          {/* Spouse Information - Conditional */}
          {auxiliary.conjuge && (
            <>
              <Separator />
              <div>
                <h3 className="mb-4">Informações do Cônjuge/Parceiro(a)</h3>
                <div className="flex items-start gap-6 mb-4">
                  <Avatar className="w-20 h-20">
                    <AvatarImage src={auxiliary.conjuge.foto} alt={auxiliary.conjuge.nome} />
                    <AvatarFallback>
                      {auxiliary.conjuge.nome
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .substring(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3>{auxiliary.conjuge.nome}</h3>
                    <p className="text-gray-500 mb-2">Cônjuge/Parceiro(a)</p>
                    <div className="flex gap-2">
                      {auxiliary.conjuge.obreiro && (
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Obreiro
                        </Badge>
                      )}
                      {auxiliary.conjuge.batizado && (
                        <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                          <Droplet className="w-3 h-3 mr-1" />
                          Baptizado
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                      <Phone className="w-5 h-5 text-[#0066CC]" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Telefone/WhatsApp</p>
                      <p>{auxiliary.conjuge.telefone}</p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          <Separator />

          {/* Additional Information */}
          {/* <div>
            <h3 className="mb-4">Informações Adicionais</h3>
            <div className="bg-[#F7F8FA] rounded-lg p-4 space-y-2">
              {auxiliary.estadoCivil !== "Solteiro(a)" && (
                <>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tempo de relacionamento:</span>
                    <span>2 anos e 4 meses</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Data da união:</span>
                    <span>15/09/2022</span>
                  </div>
                </>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Frequência na igreja:</span>
                <span>Assíduo</span>
              </div>
            </div>
          </div> */}

          {/* Action Buttons */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose} className="border-purple-200 text-purple-700 hover:bg-purple-50">
              Fechar
            </Button>
            <Button 
              onClick={() => {
                onEdit(auxiliary);
                onClose();
              }}
              className="bg-gradient-to-r from-[#9333EA] to-[#A855F7] hover:from-[#7E22CE] hover:to-[#9333EA] shadow-md shadow-purple-200"
            >
              Editar Informações
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
