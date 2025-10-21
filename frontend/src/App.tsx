import { useState, useMemo, useEffect } from "react";
import { LoginPage } from "./components/LoginPage";
import { FilterBar } from "./components/FilterBar";
import { AuxiliariesTable, type Auxiliary } from "./components/AuxiliariesTable";
import { AuxiliaryDetailsModal } from "./components/AuxiliaryDetailsModal";
import { NewAuxiliaryModal } from "./components/NewAuxiliaryModal";
import { EditAuxiliaryModal } from "./components/EditAuxiliaryModal";
import { CreateActivityModal } from "./components/CreateActivityModal";
import { ViewActivitiesModal } from "./components/ViewActivitiesModal";
import { Activity } from "./types/activity";
import { ActivityDetailsModal } from "./components/ActivityDetailsModal";
import { AuxiliaryRegistrationCard } from "./components/AuxiliaryRegistrationCard";
import { PrintAuxiliariesList } from "./components/PrintAuxiliariesList";
import { PrintActivityParticipants } from "./components/PrintActivityParticipants";
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
  Search,
  CalendarPlus,
  CalendarDays,
  LogOut
} from "lucide-react";
import { listarAuxiliares } from "./api/api";
import { actualizarAuxiliar, criarAuxiliar } from "./api/api";
import { getActivities, deleteActivity } from "./api/api";

// Initial mock data
// const initialAuxiliaries: Auxiliary[] = [
//   {
//     id: "1",
//     foto: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria",
//     nome: "Maria Silva Santos",
//     igreja: "Igreja Central",
//     regiao: "Centro",
//     estadoCivil: "Solteiro(a)",
//     telefone: "+244 923 456 789",
//     obreiro: true,
//     batizado: true,
//     dataCadastro: "15/01/2024",
//     enderecoResidencial: {
//       provincia: "Luanda",
//       municipio: "Luanda",
//       bairro: "Maculusso",
//       rua: "Rua das Flores",
//       numeroCasa: "123",
//       pontoReferencia: "Próximo ao Mercado Central",
//     },
//     enderecoIgreja: {
//       provincia: "Luanda",
//       municipio: "Luanda",
//       bairro: "Maianga",
//       rua: "Av. 4 de Fevereiro",
//       numeroCasa: "1000",
//       pontoReferencia: "Em frente ao Banco BFA",
//     },
//   },
//   {
//     id: "2",
//     foto: "https://api.dicebear.com/7.x/avataaars/svg?seed=Joao",
//     nome: "João Pedro Oliveira",
//     igreja: "Igreja Nova Esperança",
//     regiao: "Norte",
//     estadoCivil: "Solteiro(a)",
//     telefone: "+244 945 678 901",
//     obreiro: false,
//     batizado: true,
//     dataCadastro: "20/01/2024",
//     enderecoResidencial: {
//       provincia: "Luanda",
//       municipio: "Viana",
//       bairro: "Zango",
//       rua: "Rua do Progresso",
//       numeroCasa: "456",
//       pontoReferencia: "Perto da Escola Primária",
//     },
//     enderecoIgreja: {
//       provincia: "Luanda",
//       municipio: "Viana",
//       bairro: "Zango II",
//       rua: "Av. Principal",
//       numeroCasa: "2500",
//       pontoReferencia: "Ao lado da Farmácia",
//     },
//   },
//   {
//     id: "3",
//     foto: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ana",
//     nome: "Ana Paula Costa",
//     igreja: "Igreja Fé Viva",
//     regiao: "Sul",
//     estadoCivil: "Casado(a)",
//     telefone: "+244 912 345 678",
//     obreiro: true,
//     batizado: true,
//     dataCadastro: "22/01/2024",
//     enderecoResidencial: {
//       provincia: "Benguela",
//       municipio: "Benguela",
//       bairro: "Praia Morena",
//       rua: "Rua da Liberdade",
//       numeroCasa: "789",
//       pontoReferencia: "Próximo à Praia",
//     },
//     enderecoIgreja: {
//       provincia: "Benguela",
//       municipio: "Benguela",
//       bairro: "Centro",
//       rua: "Av. Norton de Matos",
//       numeroCasa: "1500",
//       pontoReferencia: "Em frente ao Hospital",
//     },
//     conjuge: {
//       nome: "Roberto Costa",
//       telefone: "+244 912 345 679",
//       foto: "https://api.dicebear.com/7.x/avataaars/svg?seed=Roberto",
//       obreiro: true,
//       batizado: true,
//     },
//   },
//   {
//     id: "4",
//     foto: "https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos",
//     nome: "Carlos Eduardo Souza",
//     igreja: "Igreja Luz Divina",
//     regiao: "Leste",
//     estadoCivil: "Solteiro(a)",
//     telefone: "+244 934 567 890",
//     obreiro: false,
//     batizado: false,
//     dataCadastro: "25/01/2024",
//     enderecoResidencial: {
//       provincia: "Huíla",
//       municipio: "Lubango",
//       bairro: "Comercial",
//       rua: "Rua Sá da Bandeira",
//       numeroCasa: "321",
//       pontoReferencia: "Ao lado do Supermercado",
//     },
//     enderecoIgreja: {
//       provincia: "Huíla",
//       municipio: "Lubango",
//       bairro: "Lajes",
//       rua: "Rua Principal",
//       numeroCasa: "800",
//       pontoReferencia: "Próximo à Praça",
//     },
//   },
//   {
//     id: "5",
//     foto: "https://api.dicebear.com/7.x/avataaars/svg?seed=Beatriz",
//     nome: "Beatriz Fernandes Lima",
//     igreja: "Igreja Amor Perfeito",
//     regiao: "Oeste",
//     estadoCivil: "Divorciado(a)",
//     telefone: "+244 956 789 012",
//     obreiro: true,
//     batizado: true,
//     dataCadastro: "28/01/2024",
//     enderecoResidencial: {
//       provincia: "Huambo",
//       municipio: "Huambo",
//       bairro: "Benfica",
//       rua: "Av. da Independência",
//       numeroCasa: "654",
//       pontoReferencia: "Perto do Centro Comercial",
//     },
//     enderecoIgreja: {
//       provincia: "Huambo",
//       municipio: "Huambo",
//       bairro: "Centro",
//       rua: "Rua Dr. António Agostinho Neto",
//       numeroCasa: "1200",
//       pontoReferencia: "Ao lado da Câmara Municipal",
//     },
//   },
//   {
//     id: "6",
//     foto: "https://api.dicebear.com/7.x/avataaars/svg?seed=Pedro",
//     nome: "Pedro Henrique Almeida",
//     igreja: "Igreja Central",
//     regiao: "Centro",
//     estadoCivil: "Solteiro(a)",
//     telefone: "+244 967 890 123",
//     obreiro: false,
//     batizado: true,
//     dataCadastro: "01/02/2024",
//     enderecoResidencial: {
//       provincia: "Luanda",
//       municipio: "Luanda",
//       bairro: "Alvalade",
//       rua: "Rua Rainha Ginga",
//       numeroCasa: "987",
//       pontoReferencia: "Próximo ao Clube",
//     },
//     enderecoIgreja: {
//       provincia: "Luanda",
//       municipio: "Luanda",
//       bairro: "Maianga",
//       rua: "Av. 4 de Fevereiro",
//       numeroCasa: "1000",
//       pontoReferencia: "Em frente ao Banco BFA",
//     },
//   },
//   {
//     id: "7",
//     foto: "https://api.dicebear.com/7.x/avataaars/svg?seed=Julia",
//     nome: "Julia Cristina Rocha",
//     igreja: "Igreja Nova Esperança",
//     regiao: "Norte",
//     estadoCivil: "Casado(a)",
//     telefone: "+244 978 901 234",
//     obreiro: true,
//     batizado: true,
//     dataCadastro: "05/02/2024",
//     enderecoResidencial: {
//       provincia: "Cabinda",
//       municipio: "Cabinda",
//       bairro: "Marien Ngouabi",
//       rua: "Rua da Amizade",
//       numeroCasa: "555",
//       pontoReferencia: "Próximo ao Porto",
//     },
//     enderecoIgreja: {
//       provincia: "Cabinda",
//       municipio: "Cabinda",
//       bairro: "Centro",
//       rua: "Av. Principal",
//       numeroCasa: "2500",
//       pontoReferencia: "Ao lado da Biblioteca",
//     },
//     conjuge: {
//       nome: "Marcelo Rocha Silva",
//       telefone: "+244 978 901 235",
//       foto: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcelo",
//       obreiro: false,
//       batizado: true,
//     },
//   },
//   {
//     id: "8",
//     foto: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lucas",
//     nome: "Lucas Vieira Martins",
//     igreja: "Igreja Fé Viva",
//     regiao: "Sul",
//     estadoCivil: "Solteiro(a)",
//     telefone: "+244 989 012 345",
//     obreiro: false,
//     batizado: false,
//     dataCadastro: "08/02/2024",
//     enderecoResidencial: {
//       provincia: "Namibe",
//       municipio: "Moçâmedes",
//       bairro: "Praia Amélia",
//       rua: "Rua do Mar",
//       numeroCasa: "2222",
//       pontoReferencia: "Próximo ao Farol",
//     },
//     enderecoIgreja: {
//       provincia: "Namibe",
//       municipio: "Moçâmedes",
//       bairro: "Centro",
//       rua: "Av. da República",
//       numeroCasa: "1500",
//       pontoReferencia: "Em frente à Delegação",
//     },
//   },
// ];

// Credenciais de login (NOTA: Em produção real, isso deveria ser gerenciado no backend)
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "terapiadoamor2024";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [auxiliaries, setAuxiliaries] = useState<Auxiliary[]>([]);
  // const [auxiliaries, setAuxiliaries] = useState<Auxiliary[]>(initialAuxiliaries);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    regiao: "todas",
    estadoCivil: "todos",
    igreja: "todas",
    apenasObreiros: false,
    apenasBatizados: false,
  });
  const [selectedAuxiliary, setSelectedAuxiliary] = useState<Auxiliary | null>(null);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isNewAuxiliaryModalOpen, setIsNewAuxiliaryModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateActivityModalOpen, setIsCreateActivityModalOpen] = useState(false);
  const [isViewActivitiesModalOpen, setIsViewActivitiesModalOpen] = useState(false);
  const [isActivityDetailsModalOpen, setIsActivityDetailsModalOpen] = useState(false);
  const [auxiliaryToPrint, setAuxiliaryToPrint] = useState<Auxiliary | null>(null);
  const [shouldPrintList, setShouldPrintList] = useState(false);
  const [activityToPrint, setActivityToPrint] = useState<Activity | null>(null);

  // Check localStorage for saved session
  useEffect(() => {
    const savedAuth = localStorage.getItem("terapia_auth");
    if (savedAuth === "authenticated") {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    loadActivities();
  }, []);

  const loadActivities = async () => {
    try {
      const response = await getActivities();
      if (response.success) {
        setActivities(response.data);
      }
    } catch (error) {
      console.error('Erro ao carregar atividades:', error);
      toast.error('Erro ao carregar atividades');
    }
  };

  useEffect(() => {
    listarAuxiliares()
      .then((data) => {
        console.log("Dados recebidos no App:", data);
        setAuxiliaries(data);
      })
      .catch((error) => {
        console.error("Erro ao buscar auxiliares:", error);
        toast.error("Erro ao carregar auxiliares");
      });
  }, []);

  // Filter and search logic
  const filteredAuxiliaries = useMemo(() => {
    return auxiliaries.filter((aux) => {
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
  }, [searchTerm, filters, auxiliaries]);

  // Statistics
  const stats = useMemo(() => {
    const total = filteredAuxiliaries.length;
    const obreiros = filteredAuxiliaries.filter((a) => a.obreiro).length;
    const batizados = filteredAuxiliaries.filter((a) => a.batizado).length;
    const crescimento = "+12%";

    return { total, obreiros, batizados, crescimento };
  }, [filteredAuxiliaries]);

  // Login handler
  const handleLogin = (username: string, password: string) => {
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      localStorage.setItem("terapia_auth", "authenticated");
      toast.success("Login realizado com sucesso! 💜");
    } else {
      toast.error("Usuário ou senha incorretos. Tente novamente.");
    }
  };

  // Logout handler
  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("terapia_auth");
    toast.success("Logout realizado com sucesso!");
  };

  // If not authenticated, show login page
  if (!isAuthenticated) {
    return (
      <>
        <Toaster position="top-right" richColors />
        <LoginPage onLogin={handleLogin} />
      </>
    );
  }

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
    if (confirm(`Tem certeza que deseja excluir ${auxiliary.nome}?`)) {
      setAuxiliaries(prev => prev.filter(aux => aux.id !== auxiliary.id));
      toast.success(`${auxiliary.nome} foi excluído com sucesso!`);
    }
  };

  const handleAddAuxiliary = async (newAuxiliary: Auxiliary) => {
    // setAuxiliaries(prev => [...prev, newAuxiliary]);
    // toast.success("Auxiliar cadastrado com sucesso!");
    try {
      console.log("Dados sendo enviados: ", newAuxiliary)
      const res = await criarAuxiliar(newAuxiliary);
      setAuxiliaries((prev) => [...prev, res]);
    } catch (error: any) {
      toast.error(`Erro ao salvar auxiliar: ${error.message}`);
      console.error("Erro ao salvar auxiliar:", error);
    }
  };

  const handleUpdateAuxiliary = async (updatedAuxiliary: Auxiliary) => {
    // setAuxiliaries(prev => 
    //   prev.map(aux => aux.id === updatedAuxiliary.id ? updatedAuxiliary : aux)
    // );
    // toast.success("Auxiliar atualizado com sucesso!");
    try {
      if (!updatedAuxiliary.id) {
        throw new Error("ID do auxiliar não encontrado");
      }

      const res = await actualizarAuxiliar(updatedAuxiliary.id.toString(), updatedAuxiliary);
      setAuxiliaries((prev) => prev.map((aux) => aux.id === updatedAuxiliary.id ? res : aux));
      toast.success("Auxiliar actualizado com sucesso!");
      setIsEditModalOpen(false);
    } catch (error: any) {
      toast.error(`Erro ao atualizar auxiliar: ${error.message}`);
      console.error("Erro ao atualizar auxiliar:", error);
    }

  };

  const handleExportExcel = () => {
    toast.success("Exportando para Excel...");
  };

  const handleExportSQL = () => {
    toast.success("Exportando para SQL...");
  };

  const handlePrint = () => {
    toast.success("Preparando impressão da lista...");
    setShouldPrintList(true);
    setTimeout(() => {
      window.print();
      setShouldPrintList(false);
    }, 100);
  };

  const handlePrintCard = (auxiliary: Auxiliary) => {
    toast.success(`Preparando ficha de ${auxiliary.nome}...`);
    setAuxiliaryToPrint(auxiliary);
    setTimeout(() => {
      window.print();
      setAuxiliaryToPrint(null);
    }, 100);
  };

  const handleSaveActivity = (activity: Activity) => {
    setActivities(prev => [...prev, activity]);
  };

  const handleViewActivityDetails = (activity: Activity) => {
    setSelectedActivity(activity);
    setIsActivityDetailsModalOpen(true);
  };

  const handlePrintActivityParticipants = (activity: Activity) => {
    toast.success(`Preparando lista de participantes...`);
    setActivityToPrint(activity);
    setTimeout(() => {
      window.print();
      setActivityToPrint(null);
    }, 100);
  };

  const handleDeleteActivity = (activity: Activity) => {
    if (confirm(`Tem certeza que deseja excluir a atividade "${activity.name}"?`)) {
      setActivities(prev => prev.filter(act => act.id !== activity.id));
      toast.success(`Atividade "${activity.name}" foi excluída com sucesso!`);
    }
  };

  const handleCloseCreateActivityModal = () => {
    setIsCreateActivityModalOpen(false);
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

            {/* Logout Button */}
            <Button
              variant="outline"
              onClick={handleLogout}
              className="border-purple-200 text-purple-700 hover:bg-purple-50 hover:border-purple-300 shrink-0"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
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
          <Button
            className="bg-gradient-to-r from-[#EC4899] to-[#F472B6] hover:from-[#DB2777] hover:to-[#EC4899] shadow-lg shadow-pink-200"
            onClick={() => setIsCreateActivityModalOpen(true)}
          >
            <CalendarPlus className="w-4 h-4 mr-2" />
            Criar Actividade
          </Button>
          <Button
            className="bg-gradient-to-r from-[#A855F7] to-[#C084FC] hover:from-[#9333EA] hover:to-[#A855F7] shadow-lg shadow-purple-200"
            onClick={() => setIsViewActivitiesModalOpen(true)}
          >
            <CalendarDays className="w-4 h-4 mr-2" />
            Ver Atividades
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
            <span className="font-medium text-purple-700">{auxiliaries.length}</span> auxiliares
          </p>
        </div>

        <AuxiliariesTable
          auxiliaries={filteredAuxiliaries}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onPrintCard={handlePrintCard}
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
        existingAuxiliaries={auxiliaries}
        onSave={handleAddAuxiliary}
      />

      <EditAuxiliaryModal
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        existingAuxiliaries={auxiliaries}
        auxiliary={selectedAuxiliary}
        onSave={handleUpdateAuxiliary}
      />

      <CreateActivityModal
        open={isCreateActivityModalOpen}
        // onClose={() => setIsCreateActivityModalOpen(false)}
        onClose={handleCloseCreateActivityModal}
        auxiliaries={auxiliaries}
        onSaveActivity={handleSaveActivity}
      />

      <ViewActivitiesModal
        open={isViewActivitiesModalOpen}
        onClose={() => setIsViewActivitiesModalOpen(false)}
        activities={activities}
        onViewDetails={handleViewActivityDetails}
        onPrintParticipants={handlePrintActivityParticipants}
        onDeleteActivity={handleDeleteActivity}
      />

      <ActivityDetailsModal
        open={isActivityDetailsModalOpen}
        onClose={() => setIsActivityDetailsModalOpen(false)}
        activity={selectedActivity}
        auxiliaries={auxiliaries}
        onPrintParticipants={() => {
          if (selectedActivity) {
            handlePrintActivityParticipants(selectedActivity);
          }
        }}
      />

      {/* Print Components */}
      {auxiliaryToPrint && (
        <AuxiliaryRegistrationCard auxiliary={auxiliaryToPrint} />
      )}

      {shouldPrintList && (
        <PrintAuxiliariesList auxiliaries={filteredAuxiliaries} />
      )}

      {activityToPrint && (
        <PrintActivityParticipants
          activity={activityToPrint}
          participants={auxiliaries.filter(aux => activityToPrint.participantIds.includes(aux.id.toString()))}
        />
      )}
    </div>
  );
}
