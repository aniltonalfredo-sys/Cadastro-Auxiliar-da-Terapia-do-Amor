import { Filter, X } from "lucide-react";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";

interface FilterBarProps {
  filters: {
    regiao: string;
    estadoCivil: string;
    igreja: string;
    apenasObreiros: boolean;
    apenasBatizados: boolean;
  };
  onFilterChange: (filters: any) => void;
  onClearFilters: () => void;
}

export function FilterBar({ filters, onFilterChange, onClearFilters }: FilterBarProps) {
  return (
    <div className="bg-white/80 backdrop-blur rounded-2xl border border-purple-100 p-6 mb-6 shadow-sm shadow-purple-100">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-5 h-5 text-[#9333EA]" />
        <h3 className="text-purple-900">Filtros</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {/* Região */}
        <div className="space-y-2">
          <Label>Região</Label>
          <Select
            value={filters.regiao}
            onValueChange={(value: any) => onFilterChange({ ...filters, regiao: value })}
          >
            <SelectTrigger className="bg-purple-50/50 border border-purple-100">
              <SelectValue placeholder="Todas as regiões" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas as regiões</SelectItem>
              <SelectItem value="Centro">Centro</SelectItem>
              <SelectItem value="Norte">Norte</SelectItem>
              <SelectItem value="Sul">Sul</SelectItem>
              <SelectItem value="Leste">Leste</SelectItem>
              <SelectItem value="Oeste">Oeste</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Estado Civil */}
        <div className="space-y-2">
          <Label>Estado Civil</Label>
          <Select
            value={filters.estadoCivil}
            onValueChange={(value: any) => onFilterChange({ ...filters, estadoCivil: value })}
          >
            <SelectTrigger className="bg-purple-50/50 border border-purple-100">
              <SelectValue placeholder="Todos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              <SelectItem value="Solteiro(a)">Solteiro(a)</SelectItem>
              <SelectItem value="Casado(a)">Casado(a)</SelectItem>
              <SelectItem value="União Estável">União Estável</SelectItem>
              <SelectItem value="Divorciado(a)">Divorciado(a)</SelectItem>
              <SelectItem value="Viúvo(a)">Viúvo(a)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Igreja */}
        <div className="space-y-2">
          <Label>Igreja</Label>
          <Select
            value={filters.igreja}
            onValueChange={(value: any) => onFilterChange({ ...filters, igreja: value })}
          >
            <SelectTrigger className="bg-purple-50/50 border border-purple-100">
              <SelectValue placeholder="Todas as igrejas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas as igrejas</SelectItem>
              <SelectItem value="Igreja Central">Igreja Central</SelectItem>
              <SelectItem value="Igreja Nova Esperança">Igreja Nova Esperança</SelectItem>
              <SelectItem value="Igreja Fé Viva">Igreja Fé Viva</SelectItem>
              <SelectItem value="Igreja Luz Divina">Igreja Luz Divina</SelectItem>
              <SelectItem value="Igreja Amor Perfeito">Igreja Amor Perfeito</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Checkboxes */}
        <div className="space-y-3">
          <Label>Filtros Adicionais</Label>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Checkbox
                id="obreiros"
                checked={filters.apenasObreiros}
                onCheckedChange={(checked: any) =>
                  onFilterChange({ ...filters, apenasObreiros: checked === true })
                }
              />
              <Label htmlFor="obreiros" className="cursor-pointer">
                Apenas Obreiros
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="batizados"
                checked={filters.apenasBatizados}
                onCheckedChange={(checked: any) =>
                  onFilterChange({ ...filters, apenasBatizados: checked === true })
                }
              />
              <Label htmlFor="batizados" className="cursor-pointer">
                Apenas Batizados
              </Label>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          onClick={onClearFilters} 
          className="border-purple-200 text-purple-700 hover:bg-purple-50"
        >
          <X className="w-4 h-4 mr-2" />
          Limpar Filtros
        </Button>
      </div>
    </div>
  );
}