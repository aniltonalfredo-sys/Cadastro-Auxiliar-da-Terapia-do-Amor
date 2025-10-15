import { useState, useMemo, useEffect } from "react";
import { FilterBar } from "./components/FilterBar";
import { AuxiliariesTable, type Auxiliary } from "./components/AuxiliariesTable";
import { AuxiliaryDetailsModal } from "./components/AuxiliaryDetailsModal";
import { NewAuxiliaryModal } from "./components/NewAuxiliaryModal";
import { EditAuxiliaryModal } from "./components/EditAuxiliaryModal";
import { StatsCard } from "./components/StatsCard";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Toaster, toast } from "sonner";
import {
  UserPlus,
  FileSpreadsheet,
  Database,
  Printer,
  Users,
  CheckCircle,
  Droplet,
  TrendingUp,
  Heart,
  Search
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { actualizarAuxiliar, criarAuxiliar, listarAuxiliares } from "./api/api";

export default function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    regiao: "todas",
    estadoCivil: "todos",
    igreja: "todas",
    apenasObreiros: false,
    apenasBatizados: false,
  });
  const [selectedAuxiliary, setSelectedAuxiliary] = useState<Auxiliary | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isNewAuxiliaryModalOpen, setIsNewAuxiliaryModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [auxiliares, setAuxiliares] = useState<Auxiliary[]>([]);

  useEffect(() => {
    listarAuxiliares()
      .then((data) => {
        console.log("Dados recebidos no App:", data);
        setAuxiliares(data);
      })
      .catch((error) => {
        console.error("Erro ao buscar auxiliares:", error);
        toast.error("Erro ao carregar auxiliares");
      });
  }, []);

  // Filter and search logic
  const filteredAuxiliaries = useMemo(() => {
    return auxiliares.filter((aux) => {
      // Search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        if (
          !aux.nome.toLowerCase().includes(searchLower) &&
          !aux.igreja.toLowerCase().includes(searchLower) &&
          !aux.telefone.includes(searchLower)
        ) {
          return false;
        }
      }

      // Region filter
      if (filters.regiao !== "todas" && aux.regiao !== filters.regiao) {
        return false;
      }

      // Estado Civil filter
      if (filters.estadoCivil !== "todos" && aux.estadoCivil !== filters.estadoCivil) {
        return false;
      }

      // Igreja filter
      if (filters.igreja !== "todas" && aux.igreja !== filters.igreja) {
        return false;
      }

      // Obreiros filter
      if (filters.apenasObreiros && !aux.obreiro) {
        return false;
      }

      // Batizados filter
      if (filters.apenasBatizados && !aux.batizado) {
        return false;
      }
      
      return true;
    });
  }, [auxiliares, searchTerm, filters]);

  const handleSaveAuxiliar = async (novoAuxiliar: Auxiliary) => {
    try {
      const res = await criarAuxiliar(novoAuxiliar);
      setAuxiliares((prev) => [...prev, res]);
      toast.success("Auxiliar criado com sucesso!");
      setIsNewAuxiliaryModalOpen(false);
    } catch(error: any) {
      toast.error(`Erro ao salvar auxiliar: ${error.message}`);
      console.error("Erro ao salvar auxiliar:", error);
    }
  }

  const handleUpdateAuxiliar = async (updatedAux: Auxiliary) => {
    try {
      if (!updatedAux.id) {
        throw new Error("ID do auxiliar não encontrado");
      }
      
      const res = await actualizarAuxiliar(updatedAux.id, updatedAux);
      setAuxiliares((prev) => prev.map((aux) => aux.id === updatedAux.id ? res : aux));
      toast.success("Auxiliar atualizado com sucesso!");
      setIsEditModalOpen(false);
    } catch(error: any) {
      toast.error(`Erro ao atualizar auxiliar: ${error.message}`);
      console.error("Erro ao atualizar auxiliar:", error);
    }
  }

  // Statistics
  const stats = useMemo(() => {
    const total = filteredAuxiliaries.length;
    const obreiros = filteredAuxiliaries.filter((a) => a.obreiro).length;
    const batizados = filteredAuxiliaries.filter((a) => a.batizado).length;
    const crescimento = "+12%";

    return { total, obreiros, batizados, crescimento };
  }, [filteredAuxiliaries]);

  // Chart data
  const chartData = [
    { name: "Obreiros", value: stats.obreiros, color: "#C084FC" },
    { name: "Não Obreiros", value: stats.total - stats.obreiros, color: "#F3E8FF" },
  ];

  const chartData2 = [
    { name: "Batizados", value: stats.batizados, color: "#9333EA" },
    { name: "Não Batizados", value: stats.total - stats.batizados, color: "#FAF5FF" },
  ];

  const handleClearFilters = () => {
    setFilters({
      regiao: "todas",
      estadoCivil: "todos",
      igreja: "todas",
      apenasObreiros: false,
      apenasBatizados: false,
    });
    setSearchTerm("");
    toast.success("Filtros limpos com sucesso!");
  };

  const handleView = (auxiliary: Auxiliary) => {
    setSelectedAuxiliary(auxiliary);
    setIsDetailsModalOpen(true);
  };

  const handleEdit = (auxiliary: Auxiliary) => {
    setSelectedAuxiliary(auxiliary);
    setIsEditModalOpen(true);
  };

  const handleDelete = (auxiliary: Auxiliary) => {
    toast.error(`Função de exclusão em desenvolvimento para ${auxiliary.nome}`);
  };

  const handleExportExcel = () => {
    toast.success("Exportando para Excel...");
  };

  const handleExportSQL = () => {
    toast.success("Exportando para SQL...");
  };

  const handlePrint = () => {
    toast.success("Preparando impressão...");
    window.print();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50/50 via-pink-50/30 to-white">
      <Toaster position="top-right" richColors />

      {/* Header */}
      <header className="bg-gradient-to-r from-white via-purple-50/30 to-pink-50/30 border-b border-purple-100 sticky top-0 z-10 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between gap-6">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-[#9333EA] via-[#A855F7] to-[#C084FC] rounded-xl flex items-center justify-center shadow-lg shadow-purple-200">
                <Heart className="w-7 h-7 text-white" fill="white" />
              </div>
              <div>
                <h2 className="bg-gradient-to-r from-[#9333EA] to-[#C084FC] bg-clip-text text-transparent text-xl font-bold">
                  Terapia do Amor
                </h2>
                <p className="text-xs text-purple-400">💕 Painel de Auxiliares</p>
              </div>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-xl">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Pesquisar auxiliar..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-purple-50/50 border border-purple-100 rounded-xl focus:border-purple-300 focus:ring-purple-200"
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="mb-8 relative">
          <div className="absolute -top-4 -left-4 text-6xl opacity-10">💕</div>
          <div className="absolute -top-2 right-20 text-4xl opacity-10">💜</div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#9333EA] to-[#C084FC] bg-clip-text text-transparent mb-2">
            Auxiliares Cadastrados
          </h1>
          <p className="text-purple-600 flex items-center gap-2">
            <Heart className="w-4 h-4 fill-purple-400 text-purple-400" />
            Gerencie todos os auxiliares da Terapia do Amor de forma centralizada.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total de Auxiliares"
            value={stats.total}
            icon={Users}
            color="text-[#9333EA]"
            bgColor="bg-gradient-to-br from-purple-50 to-purple-100"
          />
          <StatsCard
            title="Obreiros"
            value={stats.obreiros}
            icon={CheckCircle}
            color="text-[#C084FC]"
            bgColor="bg-gradient-to-br from-purple-50 to-pink-50"
          />
          <StatsCard
            title="Batizados"
            value={stats.batizados}
            icon={Droplet}
            color="text-[#A855F7]"
            bgColor="bg-gradient-to-br from-pink-50 to-purple-100"
          />
          <StatsCard
            title="Crescimento"
            value={stats.crescimento}
            icon={Heart}
            color="text-[#EC4899]"
            bgColor="bg-gradient-to-br from-pink-50 to-rose-50"
          />
        </div>

        {/* Charts - Descomente se quiser usar */}
        {/* {stats.total > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-white/80 backdrop-blur rounded-2xl border border-purple-100 p-6 shadow-sm shadow-purple-100">
              <h3 className="mb-4 text-purple-900 flex items-center gap-2">
                <Heart className="w-5 h-5 text-purple-400 fill-purple-200" />
                Distribuição de Obreiros
              </h3>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white/80 backdrop-blur rounded-2xl border border-purple-100 p-6 shadow-sm shadow-purple-100">
              <h3 className="mb-4 text-purple-900 flex items-center gap-2">
                <Heart className="w-5 h-5 text-purple-400 fill-purple-200" />
                Distribuição de Batizados
              </h3>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={chartData2}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {chartData2.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )} */}

        {/* Filters - Descomente se quiser usar */}
        {/* {auxiliares.length > 0 && (
          <FilterBar
            filters={filters}
            onFilterChange={setFilters}
            onClearFilters={handleClearFilters}
          />
        )} */}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 mb-6">
          <Button
            className="bg-gradient-to-r from-[#9333EA] to-[#A855F7] hover:from-[#7E22CE] hover:to-[#9333EA] shadow-lg shadow-purple-200"
            onClick={() => setIsNewAuxiliaryModalOpen(true)}
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Novo Auxiliar
          </Button>
          
          {/* {filteredAuxiliaries.length > 0 && (
            <>
              <Button 
                variant="outline" 
                onClick={handleExportExcel} 
                className="border-purple-200 text-purple-700 hover:bg-purple-50 hover:border-purple-300"
              >
                <FileSpreadsheet className="w-4 h-4 mr-2" />
                Exportar para Excel
              </Button>
              <Button 
                variant="outline" 
                onClick={handleExportSQL} 
                className="border-purple-200 text-purple-700 hover:bg-purple-50 hover:border-purple-300"
              >
                <Database className="w-4 h-4 mr-2" />
                Exportar para SQL
              </Button>
              <Button 
                variant="outline" 
                onClick={handlePrint} 
                className="border-purple-200 text-purple-700 hover:bg-purple-50 hover:border-purple-300"
              >
                <Printer className="w-4 h-4 mr-2" />
                Imprimir Lista
              </Button>
            </>
          )} */}
          
          {(searchTerm || filters.regiao !== "todas" || filters.estadoCivil !== "todos" || filters.igreja !== "todas" || filters.apenasObreiros || filters.apenasBatizados) && (
            <Button 
              variant="outline" 
              onClick={handleClearFilters}
              className="border-red-200 text-red-700 hover:bg-red-50 hover:border-red-300"
            >
              Limpar Filtros
            </Button>
          )}
        </div>

        {/* Table Info */}
        <div className="mb-4">
          <p className="text-sm text-purple-600 flex items-center gap-2">
            <Heart className="w-3 h-3 fill-purple-300 text-purple-300" />
            Mostrando <span className="font-medium text-purple-700">{filteredAuxiliaries.length}</span> de{" "}
            <span className="font-medium text-purple-700">{auxiliares.length}</span> auxiliares
          </p>
        </div>

        {/* Table */}
        {filteredAuxiliaries.length > 0 ? (
          <AuxiliariesTable
            auxiliaries={filteredAuxiliaries}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ) : (
          <div className="text-center py-12 bg-white/50 rounded-2xl border border-purple-100">
            <Heart className="w-12 h-12 text-purple-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-purple-900 mb-2">
              Nenhum auxiliar encontrado
            </h3>
            <p className="text-purple-600 mb-4">
              {auxiliares.length === 0 
                ? "Comece cadastrando o primeiro auxiliar."
                : "Tente ajustar os filtros ou termos de pesquisa."}
            </p>
            {auxiliares.length === 0 && (
              <Button
                className="bg-gradient-to-r from-[#9333EA] to-[#A855F7] hover:from-[#7E22CE] hover:to-[#9333EA]"
                onClick={() => setIsNewAuxiliaryModalOpen(true)}
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Cadastrar Primeiro Auxiliar
              </Button>
            )}
          </div>
        )}
      </main>

      {/* Modals */}
      <AuxiliaryDetailsModal
        auxiliary={selectedAuxiliary}
        open={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        onEdit={handleEdit}
      />

      <NewAuxiliaryModal
        open={isNewAuxiliaryModalOpen}
        onClose={() => setIsNewAuxiliaryModalOpen(false)}
        existingAuxiliaries={auxiliares}
        onSave={handleSaveAuxiliar}
      />

      <EditAuxiliaryModal
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        existingAuxiliaries={auxiliares}
        auxiliary={selectedAuxiliary}
        onSave={handleUpdateAuxiliar}
      />
    </div>
  );
}