import { useState, useMemo } from "react";
import { FilterBar } from "./components/FilterBar";
import { AuxiliariesTable, type Auxiliary } from "./components/AuxiliariesTable";
import { AuxiliaryDetailsModal } from "./components/AuxiliaryDetailsModal";
import { NewAuxiliaryModal } from "./components/NewAuxiliaryModal";
import { EditAuxiliaryModal } from "./components/EditAuxiliaryModal";
import { StatsCard } from "./components/StatsCard";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Toaster, toast } from "sonner@2.0.3";
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

// Mock data
const mockAuxiliaries: Auxiliary[] = [
  {
    id: "1",
    foto: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria",
    nome: "Maria Silva Santos",
    igreja: "Igreja Central",
    regiao: "Centro",
    estadoCivil: "Solteiro(a)",
    telefone: "+244 923 456 789",
    obreiro: true,
    batizado: true,
    dataCadastro: "15/01/2024",
    enderecoResidencial: {
      provincia: "Luanda",
      municipio: "Luanda",
      bairro: "Maculusso",
      rua: "Rua das Flores",
      numeroCasa: "123",
      pontoReferencia: "Próximo ao Mercado Central",
    },
    enderecoIgreja: {
      provincia: "Luanda",
      municipio: "Luanda",
      bairro: "Maianga",
      rua: "Av. 4 de Fevereiro",
      numeroCasa: "1000",
      pontoReferencia: "Em frente ao Banco BFA",
    },
  },
  {
    id: "2",
    foto: "https://api.dicebear.com/7.x/avataaars/svg?seed=Joao",
    nome: "João Pedro Oliveira",
    igreja: "Igreja Nova Esperança",
    regiao: "Norte",
    estadoCivil: "Solteiro(a)",
    telefone: "+244 945 678 901",
    obreiro: false,
    batizado: true,
    dataCadastro: "20/01/2024",
    enderecoResidencial: {
      provincia: "Luanda",
      municipio: "Viana",
      bairro: "Zango",
      rua: "Rua do Progresso",
      numeroCasa: "456",
      pontoReferencia: "Perto da Escola Primária",
    },
    enderecoIgreja: {
      provincia: "Luanda",
      municipio: "Viana",
      bairro: "Zango II",
      rua: "Av. Principal",
      numeroCasa: "2500",
      pontoReferencia: "Ao lado da Farmácia",
    },
  },
  {
    id: "3",
    foto: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ana",
    nome: "Ana Paula Costa",
    igreja: "Igreja Fé Viva",
    regiao: "Sul",
    estadoCivil: "Casado(a)",
    telefone: "+244 912 345 678",
    obreiro: true,
    batizado: true,
    dataCadastro: "22/01/2024",
    enderecoResidencial: {
      provincia: "Benguela",
      municipio: "Benguela",
      bairro: "Praia Morena",
      rua: "Rua da Liberdade",
      numeroCasa: "789",
      pontoReferencia: "Próximo à Praia",
    },
    enderecoIgreja: {
      provincia: "Benguela",
      municipio: "Benguela",
      bairro: "Centro",
      rua: "Av. Norton de Matos",
      numeroCasa: "1500",
      pontoReferencia: "Em frente ao Hospital",
    },
    conjuge: {
      nome: "Roberto Costa",
      telefone: "+244 912 345 679",
      foto: "https://api.dicebear.com/7.x/avataaars/svg?seed=Roberto",
      obreiro: true,
      batizado: true,
    },
  },
  {
    id: "4",
    foto: "https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos",
    nome: "Carlos Eduardo Souza",
    igreja: "Igreja Luz Divina",
    regiao: "Leste",
    estadoCivil: "Solteiro(a)",
    telefone: "+244 934 567 890",
    obreiro: false,
    batizado: false,
    dataCadastro: "25/01/2024",
    enderecoResidencial: {
      provincia: "Huíla",
      municipio: "Lubango",
      bairro: "Comercial",
      rua: "Rua Sá da Bandeira",
      numeroCasa: "321",
      pontoReferencia: "Ao lado do Supermercado",
    },
    enderecoIgreja: {
      provincia: "Huíla",
      municipio: "Lubango",
      bairro: "Lajes",
      rua: "Rua Principal",
      numeroCasa: "800",
      pontoReferencia: "Próximo à Praça",
    },
  },
  {
    id: "5",
    foto: "https://api.dicebear.com/7.x/avataaars/svg?seed=Beatriz",
    nome: "Beatriz Fernandes Lima",
    igreja: "Igreja Amor Perfeito",
    regiao: "Oeste",
    estadoCivil: "Divorciado(a)",
    telefone: "+244 956 789 012",
    obreiro: true,
    batizado: true,
    dataCadastro: "28/01/2024",
    enderecoResidencial: {
      provincia: "Huambo",
      municipio: "Huambo",
      bairro: "Benfica",
      rua: "Av. da Independência",
      numeroCasa: "654",
      pontoReferencia: "Perto do Centro Comercial",
    },
    enderecoIgreja: {
      provincia: "Huambo",
      municipio: "Huambo",
      bairro: "Centro",
      rua: "Rua Dr. António Agostinho Neto",
      numeroCasa: "1200",
      pontoReferencia: "Ao lado da Câmara Municipal",
    },
  },
  {
    id: "6",
    foto: "https://api.dicebear.com/7.x/avataaars/svg?seed=Pedro",
    nome: "Pedro Henrique Almeida",
    igreja: "Igreja Central",
    regiao: "Centro",
    estadoCivil: "Solteiro(a)",
    telefone: "+244 967 890 123",
    obreiro: false,
    batizado: true,
    dataCadastro: "01/02/2024",
    enderecoResidencial: {
      provincia: "Luanda",
      municipio: "Luanda",
      bairro: "Alvalade",
      rua: "Rua Rainha Ginga",
      numeroCasa: "987",
      pontoReferencia: "Próximo ao Clube",
    },
    enderecoIgreja: {
      provincia: "Luanda",
      municipio: "Luanda",
      bairro: "Maianga",
      rua: "Av. 4 de Fevereiro",
      numeroCasa: "1000",
      pontoReferencia: "Em frente ao Banco BFA",
    },
  },
  {
    id: "7",
    foto: "https://api.dicebear.com/7.x/avataaars/svg?seed=Julia",
    nome: "Julia Cristina Rocha",
    igreja: "Igreja Nova Esperança",
    regiao: "Norte",
    estadoCivil: "Casado(a)",
    telefone: "+244 978 901 234",
    obreiro: true,
    batizado: true,
    dataCadastro: "05/02/2024",
    enderecoResidencial: {
      provincia: "Cabinda",
      municipio: "Cabinda",
      bairro: "Marien Ngouabi",
      rua: "Rua da Amizade",
      numeroCasa: "555",
      pontoReferencia: "Próximo ao Porto",
    },
    enderecoIgreja: {
      provincia: "Cabinda",
      municipio: "Cabinda",
      bairro: "Centro",
      rua: "Av. Principal",
      numeroCasa: "2500",
      pontoReferencia: "Ao lado da Biblioteca",
    },
    conjuge: {
      nome: "Marcelo Rocha Silva",
      telefone: "+244 978 901 235",
      foto: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcelo",
      obreiro: false,
      batizado: true,
    },
  },
  {
    id: "8",
    foto: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lucas",
    nome: "Lucas Vieira Martins",
    igreja: "Igreja Fé Viva",
    regiao: "Sul",
    estadoCivil: "Solteiro(a)",
    telefone: "+244 989 012 345",
    obreiro: false,
    batizado: false,
    dataCadastro: "08/02/2024",
    enderecoResidencial: {
      provincia: "Namibe",
      municipio: "Moçâmedes",
      bairro: "Praia Amélia",
      rua: "Rua do Mar",
      numeroCasa: "2222",
      pontoReferencia: "Próximo ao Farol",
    },
    enderecoIgreja: {
      provincia: "Namibe",
      municipio: "Moçâmedes",
      bairro: "Centro",
      rua: "Av. da República",
      numeroCasa: "1500",
      pontoReferencia: "Em frente à Delegação",
    },
  },
];

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

  // Filter and search logic
  const filteredAuxiliaries = useMemo(() => {
    return mockAuxiliaries.filter((aux) => {
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
  }, [searchTerm, filters]);

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
                <h2 className="bg-gradient-to-r from-[#9333EA] to-[#C084FC] bg-clip-text text-transparent">Terapia do Amor</h2>
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
          <h1 className="bg-gradient-to-r from-[#9333EA] to-[#C084FC] bg-clip-text text-transparent">
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

        {/* Charts */}
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

        {/* Filters */}
        <FilterBar
          filters={filters}
          onFilterChange={setFilters}
          onClearFilters={handleClearFilters}
        />

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 mb-6">
          <Button
            className="bg-gradient-to-r from-[#9333EA] to-[#A855F7] hover:from-[#7E22CE] hover:to-[#9333EA] shadow-lg shadow-purple-200"
            onClick={() => setIsNewAuxiliaryModalOpen(true)}
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Novo Auxiliar
          </Button>
          <Button variant="outline" onClick={handleExportExcel} className="border-purple-200 text-purple-700 hover:bg-purple-50 hover:border-purple-300">
            <FileSpreadsheet className="w-4 h-4 mr-2" />
            Exportar para Excel
          </Button>
          <Button variant="outline" onClick={handleExportSQL} className="border-purple-200 text-purple-700 hover:bg-purple-50 hover:border-purple-300">
            <Database className="w-4 h-4 mr-2" />
            Exportar para SQL
          </Button>
          <Button variant="outline" onClick={handlePrint} className="border-purple-200 text-purple-700 hover:bg-purple-50 hover:border-purple-300">
            <Printer className="w-4 h-4 mr-2" />
            Imprimir Lista
          </Button>
        </div>

        {/* Table */}
        <div className="mb-4">
          <p className="text-sm text-purple-600 flex items-center gap-2">
            <Heart className="w-3 h-3 fill-purple-300 text-purple-300" />
            Mostrando <span className="font-medium text-purple-700">{filteredAuxiliaries.length}</span> de{" "}
            <span className="font-medium text-purple-700">{mockAuxiliaries.length}</span> auxiliares
          </p>
        </div>

        <AuxiliariesTable
          auxiliaries={filteredAuxiliaries}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
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
        existingAuxiliaries={mockAuxiliaries}
        onSave={() => {
          // In a real app, this would add the new auxiliary to the list
        }}
      />

      <EditAuxiliaryModal
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        existingAuxiliaries={mockAuxiliaries}
        auxiliary={selectedAuxiliary}
        onSave={() => {
          // In a real app, this would update the auxiliary in the list
        }}
      />
    </div>
  );
}
