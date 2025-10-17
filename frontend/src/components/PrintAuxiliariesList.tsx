import { Heart, Phone, MapPin } from "lucide-react";
import type { Auxiliary } from "./AuxiliariesTable";

interface PrintAuxiliariesListProps {
  auxiliaries: Auxiliary[];
}

export function PrintAuxiliariesList({ auxiliaries }: PrintAuxiliariesListProps) {
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
            width: 100%;
            padding: 20mm;
            background: white;
          }
          @page {
            size: A4 portrait;
            margin: 0;
          }
        }
      `}</style>
      
      <div className="w-full">
        {/* Header */}
        <div className="text-center mb-8 pb-4 border-b-4 border-purple-300">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Heart className="w-12 h-12 text-purple-600 fill-purple-600" />
            <h1 className="text-purple-900">Terapia do Amor</h1>
          </div>
          <h2 className="text-purple-700">Lista de Auxiliares Cadastrados</h2>
          <p className="text-sm text-purple-600 mt-2">
            Total: {auxiliaries.length} auxiliar(es) • Gerado em {new Date().toLocaleDateString("pt-BR")}
          </p>
        </div>

        {/* List */}
        <div className="space-y-4">
          {auxiliaries.map((auxiliary, index) => (
            <div key={auxiliary.id} className="border-2 border-purple-200 rounded-lg p-4 bg-gradient-to-br from-purple-50/30 to-pink-50/30">
              <div className="flex gap-4">
                {/* Number */}
                <div className="flex-shrink-0 w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">
                  {index + 1}
                </div>

                {/* Photo */}
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 border-2 border-purple-300 rounded-lg overflow-hidden bg-gray-100">
                    {auxiliary.foto && (
                      <img src={auxiliary.foto} alt={auxiliary.nome} className="w-full h-full object-cover" />
                    )}
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1 grid grid-cols-3 gap-4">
                  <div>
                    <p className="font-medium text-purple-900 mb-2">{auxiliary.nome}</p>
                    <p className="text-sm text-purple-700 flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      {auxiliary.telefone}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-purple-600 mb-1">Igreja / Região</p>
                    <p className="text-sm text-purple-900">{auxiliary.igreja}</p>
                    <p className="text-sm text-purple-700">{auxiliary.regiao}</p>
                  </div>

                  <div>
                    <p className="text-xs text-purple-600 mb-1">Endereço</p>
                    <p className="text-sm text-purple-900 flex items-start gap-1">
                      <MapPin className="w-3 h-3 mt-0.5" />
                      <span>
                        {auxiliary.enderecoResidencial.bairro}, {auxiliary.enderecoResidencial.municipio}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Status */}
                <div className="flex-shrink-0 text-right">
                  <p className="text-xs text-purple-600 mb-1">Status</p>
                  <div className="space-y-1">
                    {auxiliary.obreiro && (
                      <span className="inline-block px-2 py-0.5 bg-purple-200 text-purple-900 rounded text-xs">
                        Obreiro
                      </span>
                    )}
                    {auxiliary.batizado && (
                      <span className="inline-block px-2 py-0.5 bg-pink-200 text-pink-900 rounded text-xs ml-1">
                        Batizado
                      </span>
                    )}
                    <p className="text-xs text-purple-700 mt-1">{auxiliary.estadoCivil}</p>
                  </div>
                </div>
              </div>

              {/* Spouse Info */}
              {auxiliary.conjuge && (
                <div className="mt-3 pt-3 border-t border-purple-200 flex items-center gap-2">
                  <Heart className="w-4 h-4 text-purple-400 fill-purple-400" />
                  <p className="text-sm text-purple-700">
                    <span className="font-medium">Cônjuge:</span> {auxiliary.conjuge.nome} • {auxiliary.conjuge.telefone}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-8 pt-4 border-t-2 border-purple-300 text-center">
          <p className="text-sm text-purple-600">
            💕 Lista gerada automaticamente pelo Sistema de Gestão de Auxiliares - Terapia do Amor
          </p>
        </div>
      </div>
    </div>
  );
}
