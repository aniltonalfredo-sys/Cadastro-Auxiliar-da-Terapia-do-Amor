import { Heart, MapPin, Phone, Church } from "lucide-react";
import type { Auxiliary } from "./AuxiliariesTable";

interface AuxiliaryRegistrationCardProps {
  auxiliary: Auxiliary;
}

export function AuxiliaryRegistrationCard({ auxiliary }: AuxiliaryRegistrationCardProps) {
  return (
    <div className="print-only">
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print-only, .print-only * {
            visibility: visible;
          }
          .print-only {
            position: absolute;
            left: 0;
            top: 0;
            width: 148mm;
            height: 210mm;
            padding: 8mm;
            background: white;
          }
          @page {
            size: A5;
            margin: 0;
          }
        }
      `}</style>
      
      <div className="w-full h-full border-4 border-purple-300 rounded-lg p-3 bg-gradient-to-br from-purple-50 to-pink-50">
        {/* Header */}
        <div className="text-center mb-3 border-b-2 border-purple-300 pb-2">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Heart className="w-6 h-6 text-purple-600 fill-purple-600" />
            <h1 className="text-lg font-semibold text-purple-900">Terapia do Amor</h1>
          </div>
          <h2 className="text-sm font-medium text-purple-700">Ficha de Inscrição - Auxiliar</h2>
          <p className="text-xs text-purple-600">💕 {auxiliary.igreja}</p>
        </div>

        {/* Photo and Personal Info */}
        <div className="flex gap-3 mb-3">
          <div className="flex-shrink-0">
            <div className="w-20 h-20 border-2 border-purple-300 rounded-lg overflow-hidden bg-gray-100">
              {auxiliary.foto && (
                <img src={auxiliary.foto} alt={auxiliary.nome} className="w-full h-full object-cover" />
              )}
            </div>
          </div>
          
          <div className="flex-1 space-y-1.5">
            <div>
              <p className="text-[9px] text-purple-600 mb-0.5">Nome Completo:</p>
              <p className="text-xs font-medium text-purple-900 leading-tight">{auxiliary.nome}</p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="text-[9px] text-purple-600 mb-0.5">Estado Civil:</p>
                <p className="text-[10px] text-purple-900">{auxiliary.estadoCivil}</p>
              </div>
              <div>
                <p className="text-[9px] text-purple-600 mb-0.5">Data Cadastro:</p>
                <p className="text-[10px] text-purple-900">{auxiliary.dataCadastro}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact and Church Info - Combined */}
        <div className="mb-2 p-2 bg-white/70 rounded-lg border border-purple-200">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <h3 className="text-[10px] font-medium text-purple-900 mb-1.5 flex items-center gap-1">
                <Phone className="w-3 h-3" />
                Contato
              </h3>
              <div>
                <p className="text-[9px] text-purple-600">Telefone:</p>
                <p className="text-[10px] font-medium text-purple-900">{auxiliary.telefone}</p>
              </div>
            </div>
            
            <div>
              <h3 className="text-[10px] font-medium text-purple-900 mb-1.5 flex items-center gap-1">
                <Church className="w-3 h-3" />
                Igreja
              </h3>
              <div>
                <p className="text-[9px] text-purple-600">Região:</p>
                <p className="text-[10px] text-purple-900">{auxiliary.regiao}</p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-purple-100">
            <div className="flex items-center gap-1">
              <p className="text-[9px] text-purple-600">Obreiro:</p>
              <p className="text-[10px] font-medium text-purple-900">{auxiliary.obreiro ? "Sim" : "Não"}</p>
            </div>
            <div className="flex items-center gap-1">
              <p className="text-[9px] text-purple-600">Batizado:</p>
              <p className="text-[10px] font-medium text-purple-900">{auxiliary.batizado ? "Sim" : "Não"}</p>
            </div>
          </div>
        </div>

        {/* Address */}
        <div className="mb-2 p-2 bg-white/70 rounded-lg border border-purple-200">
          <h3 className="text-[10px] font-medium text-purple-900 mb-1.5 flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            Endereço Residencial
          </h3>
          <p className="text-[10px] text-purple-900 leading-tight">
            {auxiliary.enderecoResidencial.rua}, Nº {auxiliary.enderecoResidencial.numeroCasa}
          </p>
          <p className="text-[10px] text-purple-900 leading-tight">
            {auxiliary.enderecoResidencial.bairro}, {auxiliary.enderecoResidencial.municipio}
          </p>
          <p className="text-[10px] text-purple-900 leading-tight">
            {auxiliary.enderecoResidencial.provincia}
          </p>
          {auxiliary.enderecoResidencial.pontoReferencia && (
            <p className="text-[9px] text-purple-600 mt-0.5 leading-tight">
              Ref: {auxiliary.enderecoResidencial.pontoReferencia}
            </p>
          )}
        </div>

        {/* Spouse Info */}
        {auxiliary.conjuge && (
          <div className="mb-2 p-2 bg-white/70 rounded-lg border border-purple-200">
            <h3 className="text-[10px] font-medium text-purple-900 mb-1.5 flex items-center gap-1">
              <Heart className="w-3 h-3 fill-purple-400 text-purple-400" />
              Cônjuge/Parceiro(a)
            </h3>
            <div className="flex gap-2">
              <div className="w-12 h-12 border-2 border-purple-300 rounded overflow-hidden bg-gray-100 flex-shrink-0">
                {auxiliary.conjuge.foto && (
                  <img src={auxiliary.conjuge.foto} alt={auxiliary.conjuge.nome} className="w-full h-full object-cover" />
                )}
              </div>
              <div className="flex-1 space-y-0.5">
                <p className="text-[10px] font-medium text-purple-900 leading-tight">{auxiliary.conjuge.nome}</p>
                <p className="text-[9px] text-purple-700">{auxiliary.conjuge.telefone}</p>
                <p className="text-[9px] text-purple-600">
                  {auxiliary.conjuge.obreiro && "Obreiro"} {auxiliary.conjuge.obreiro && auxiliary.conjuge.batizado && "•"} {auxiliary.conjuge.batizado && "Batizado"}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Church Address */}
        <div className="mb-2 p-2 bg-white/70 rounded-lg border border-purple-200">
          <h3 className="text-[10px] font-medium text-purple-900 mb-1 flex items-center gap-1">
            <Church className="w-3 h-3" />
            Endereço da Igreja
          </h3>
          <p className="text-[10px] text-purple-900 leading-tight">
            {auxiliary.enderecoIgreja.rua}, Nº {auxiliary.enderecoIgreja.numeroCasa}
          </p>
          <p className="text-[10px] text-purple-900 leading-tight">
            {auxiliary.enderecoIgreja.bairro}, {auxiliary.enderecoIgreja.municipio}
          </p>
          {auxiliary.enderecoIgreja.pontoReferencia && (
            <p className="text-[9px] text-purple-600 mt-0.5 leading-tight">
              Ref: {auxiliary.enderecoIgreja.pontoReferencia}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="mt-2 pt-2 border-t-2 border-purple-300 text-center">
          <p className="text-[9px] text-purple-600 leading-tight">
            💕 Ficha oficial de cadastro da Terapia do Amor
          </p>
        </div>
      </div>
    </div>
  );
}
