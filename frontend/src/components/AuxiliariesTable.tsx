import { Eye, Pencil, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

export interface Auxiliary {
  id?: string;
  foto: string;
  nome: string;
  email: string;
  igreja: string;
  regiao: string;
  estadoCivil: string;
  dataNascimento: string;
  telefone: string;
  obreiro: boolean;
  batizado: boolean;
  dataCadastro: string;
  enderecoResidencial: {
    provincia: string;
    municipio: string;
    bairro: string;
    rua: string;
    numeroCasa: string;
    pontoReferencia?: string;
  };
  enderecoIgreja: {
    provincia: string;
    municipio: string;
    bairro: string;
    rua: string;
    numeroCasa: string;
    pontoReferencia?: string;
  };
  conjuge?: {
    nome: string;
    telefone: string;
    foto: string;
    obreiro: boolean;
    batizado: boolean;
  } | null;
}

interface AuxiliariesTableProps {
  auxiliaries: Auxiliary[];
  onView: (auxiliary: Auxiliary) => void;
  onEdit: (auxiliary: Auxiliary) => void;
  onDelete: (auxiliary: Auxiliary) => void;
}

export function AuxiliariesTable({
  auxiliaries,
  onView,
  onEdit,
  onDelete,
}: AuxiliariesTableProps) {
  return (
    <div className="bg-white/80 backdrop-blur rounded-2xl border border-purple-100 overflow-hidden shadow-sm shadow-purple-100">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gradient-to-r from-purple-50/50 to-pink-50/30">
              <TableHead className="w-16">Foto</TableHead>
              <TableHead>Nome Completo</TableHead>
              <TableHead>Igreja</TableHead>
              <TableHead>Região</TableHead>
              <TableHead>Estado Civil</TableHead>
              <TableHead>Telefone/WhatsApp</TableHead>
              <TableHead className="text-center">Obreiro</TableHead>
              <TableHead className="text-center">Batizado</TableHead>
              <TableHead>Data de Cadastro</TableHead>
              <TableHead className="text-center">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {auxiliaries.map((auxiliary) => (
              <TableRow
                key={auxiliary.id}
                className="hover:bg-purple-50/50 transition-colors cursor-pointer border-b border-purple-50"
              >
                <TableCell>
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={auxiliary.foto} alt={auxiliary.nome} />
                    <AvatarFallback>
                      {auxiliary.nome
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .substring(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                </TableCell>
                <TableCell>{auxiliary.nome}</TableCell>
                <TableCell>{auxiliary.igreja}</TableCell>
                <TableCell>{auxiliary.regiao}</TableCell>
                <TableCell>{auxiliary.estadoCivil}</TableCell>
                <TableCell>{auxiliary.telefone}</TableCell>
                <TableCell className="text-center">
                  {auxiliary.obreiro ? (
                    <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">
                      Sim
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-gray-500 border-purple-200">
                      Não
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-center">
                  {auxiliary.batizado ? (
                    <Badge className="bg-pink-100 text-pink-800 hover:bg-pink-100">
                      Sim
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-gray-500 border-purple-200">
                      Não
                    </Badge>
                  )}
                </TableCell>
                <TableCell>{new Date(auxiliary.dataCadastro).toLocaleDateString('pt-AO')}</TableCell>
                <TableCell>
                  <div className="flex items-center justify-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-[#9333EA] hover:bg-purple-50"
                      onClick={() => onView(auxiliary)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-purple-600 hover:bg-purple-50"
                      onClick={() => onEdit(auxiliary)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    {/* <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-rose-600 hover:bg-rose-50"
                      onClick={() => onDelete(auxiliary)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button> */}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
