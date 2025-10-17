import { Heart, Calendar, MapPin, Phone, Users } from "lucide-react";
import type { Activity } from "./ViewActivitiesModal";
import type { Auxiliary } from "./AuxiliariesTable";

interface PrintActivityParticipantsProps {
  activity: Activity;
  participants: Auxiliary[];
}

export function PrintActivityParticipants({ activity, participants }: PrintActivityParticipantsProps) {
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
          <h2 className="text-purple-700">Lista de Participantes da Atividade</h2>
        </div>

        {/* Activity Details */}
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-6 border-2 border-purple-300 mb-6">
          <h2 className="text-purple-900 mb-4 flex items-center gap-2">
            <Heart className="w-6 h-6 text-purple-400 fill-purple-400" />
            {activity.name}
          </h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-200 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-purple-700" />
              </div>
              <div>
                <p className="text-xs text-purple-600">Data da Atividade</p>
                <p className="font-medium text-purple-900">
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
                <div className="w-10 h-10 bg-purple-200 rounded-lg flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-purple-700" />
                </div>
                <div>
                  <p className="text-xs text-purple-600">Local</p>
                  <p className="font-medium text-purple-900">{activity.location}</p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-200 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-purple-700" />
              </div>
              <div>
                <p className="text-xs text-purple-600">Total de Participantes</p>
                <p className="font-medium text-purple-900">{participants.length} auxiliar(es)</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-200 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-purple-700" />
              </div>
              <div>
                <p className="text-xs text-purple-600">Data de Geração</p>
                <p className="font-medium text-purple-900">
                  {new Date().toLocaleDateString("pt-BR")}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Participants List */}
        <div className="mb-6">
          <h3 className="text-purple-900 mb-4 flex items-center gap-2 pb-2 border-b-2 border-purple-300">
            <Users className="w-5 h-5 text-purple-600" />
            Participantes Confirmados
          </h3>

          <div className="space-y-3">
            {participants.map((participant, index) => (
              <div
                key={participant.id}
                className="flex items-center gap-4 p-4 border-2 border-purple-200 rounded-lg bg-gradient-to-br from-white to-purple-50/30"
              >
                {/* Number */}
                <div className="flex-shrink-0 w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">
                  {index + 1}
                </div>

                {/* Photo */}
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 border-2 border-purple-300 rounded-lg overflow-hidden bg-gray-100">
                    {participant.foto && (
                      <img
                        src={participant.foto}
                        alt={participant.nome}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1">
                  <p className="font-medium text-purple-900 mb-1">{participant.nome}</p>
                  <div className="flex items-center gap-2 text-sm text-purple-700 mb-1">
                    <Phone className="w-3 h-3" />
                    <span>{participant.telefone}</span>
                  </div>
                  <p className="text-sm text-purple-600">
                    {participant.igreja} • {participant.regiao}
                  </p>
                </div>

                {/* Status */}
                <div className="flex-shrink-0 text-right">
                  <div className="space-y-1">
                    {participant.obreiro && (
                      <span className="inline-block px-2 py-0.5 bg-purple-200 text-purple-900 rounded text-xs">
                        Obreiro
                      </span>
                    )}
                    {participant.batizado && (
                      <span className="inline-block px-2 py-0.5 bg-pink-200 text-pink-900 rounded text-xs ml-1">
                        Batizado
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-purple-600 mt-1">{participant.estadoCivil}</p>
                </div>

                {/* Signature Line */}
                <div className="flex-shrink-0 w-32 border-b-2 border-gray-400 border-dashed pt-8">
                  <p className="text-xs text-gray-500 text-center mt-1">Assinatura</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="mt-8 pt-4 border-t-2 border-purple-300">
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center p-3 bg-purple-100 rounded-lg">
              <p className="text-2xl font-bold text-purple-900">{participants.length}</p>
              <p className="text-sm text-purple-600">Total de Participantes</p>
            </div>
            <div className="text-center p-3 bg-purple-100 rounded-lg">
              <p className="text-2xl font-bold text-purple-900">
                {participants.filter((p) => p.obreiro).length}
              </p>
              <p className="text-sm text-purple-600">Obreiros</p>
            </div>
            <div className="text-center p-3 bg-purple-100 rounded-lg">
              <p className="text-2xl font-bold text-purple-900">
                {participants.filter((p) => p.batizado).length}
              </p>
              <p className="text-sm text-purple-600">Batizados</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t-2 border-purple-300 text-center">
          <p className="text-sm text-purple-600">
            💕 Lista gerada automaticamente pelo Sistema de Gestão de Auxiliares - Terapia do Amor
          </p>
          <p className="text-xs text-purple-500 mt-1">
            Documento oficial para controle de presença
          </p>
        </div>
      </div>
    </div>
  );
}
