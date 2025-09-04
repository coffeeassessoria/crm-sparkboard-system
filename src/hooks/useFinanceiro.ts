import { useState, useEffect } from 'react';

interface Cliente {
  id: string;
  cpfCnpj: string;
  nome: string;
  empresa?: string;
  endereco: {
    rua: string;
    numero: string;
    bairro: string;
    cidade: string;
    estado: string;
    cep: string;
  };
  telefone: string;
  email: string;
  servicoContratado: 'Pacote 1' | 'Pacote 2' | 'Pacote 3';
  contrato: {
    prazo: string;
    valor: number;
    observacoes: string;
    dataInicio: string;
    dataVencimento: string;
  };
  status: 'Ativo' | 'Vencido' | 'Pendente';
}

interface FinanceiroStats {
  totalClientes: number;
  clientesAtivos: number;
  contratosVencendo: number;
  contratosVencidos: number;
  receitaTotal: number;
  receitaAtiva: number;
  valorContratosVencendo: number;
}

const STORAGE_KEY = 'crm_clients';

export const useFinanceiro = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadClientes();
  }, []);

  const loadClientes = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setClientes(JSON.parse(stored));
      } else {
        // Dados iniciais se não houver nada no localStorage
        const clientesIniciais: Cliente[] = [
          {
            id: '1',
            cpfCnpj: '12.345.678/0001-90',
            nome: 'João Silva',
            empresa: 'Silva & Associados',
            endereco: {
              rua: 'Rua das Flores',
              numero: '123',
              bairro: 'Centro',
              cidade: 'São Paulo',
              estado: 'SP',
              cep: '01234-567'
            },
            telefone: '(11) 99999-9999',
            email: 'joao@silva.com',
            servicoContratado: 'Pacote 2',
            contrato: {
              prazo: '12 meses',
              valor: 2500,
              observacoes: 'Cliente premium com desconto especial',
              dataInicio: '2024-01-15',
              dataVencimento: '2025-01-15'
            },
            status: 'Ativo'
          },
          {
            id: '2',
            cpfCnpj: '98.765.432/0001-10',
            nome: 'Maria Santos',
            empresa: 'Santos Marketing',
            endereco: {
              rua: 'Av. Paulista',
              numero: '1000',
              bairro: 'Bela Vista',
              cidade: 'São Paulo',
              estado: 'SP',
              cep: '01310-100'
            },
            telefone: '(11) 88888-8888',
            email: 'maria@santos.com',
            servicoContratado: 'Pacote 3',
            contrato: {
              prazo: '6 meses',
              valor: 4500,
              observacoes: 'Contrato de curto prazo',
              dataInicio: '2024-06-01',
              dataVencimento: '2024-12-01'
            },
            status: 'Vencido'
          },
          {
            id: '3',
            cpfCnpj: '11.222.333/0001-44',
            nome: 'Pedro Costa',
            empresa: 'Costa Tech',
            endereco: {
              rua: 'Rua da Tecnologia',
              numero: '500',
              bairro: 'Vila Olímpia',
              cidade: 'São Paulo',
              estado: 'SP',
              cep: '04551-000'
            },
            telefone: '(11) 77777-7777',
            email: 'pedro@costa.com',
            servicoContratado: 'Pacote 1',
            contrato: {
              prazo: '24 meses',
              valor: 1800,
              observacoes: 'Contrato de longo prazo com desconto',
              dataInicio: '2024-10-01',
              dataVencimento: '2025-02-15'
            },
            status: 'Ativo'
          }
        ];
        setClientes(clientesIniciais);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(clientesIniciais));
      }
    } catch (error) {
      console.error('Erro ao carregar clientes financeiros:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatistics = (): FinanceiroStats => {
    const hoje = new Date();
    const em30Dias = new Date();
    em30Dias.setDate(hoje.getDate() + 30);

    const clientesAtivos = clientes.filter(c => c.status === 'Ativo');
    const contratosVencendo = clientes.filter(c => {
      if (c.status !== 'Ativo') return false;
      const dataVencimento = new Date(c.contrato.dataVencimento);
      return dataVencimento >= hoje && dataVencimento <= em30Dias;
    });
    const contratosVencidos = clientes.filter(c => c.status === 'Vencido');

    return {
      totalClientes: clientes.length,
      clientesAtivos: clientesAtivos.length,
      contratosVencendo: contratosVencendo.length,
      contratosVencidos: contratosVencidos.length,
      receitaTotal: clientes.reduce((total, c) => total + c.contrato.valor, 0),
      receitaAtiva: clientesAtivos.reduce((total, c) => total + c.contrato.valor, 0),
      valorContratosVencendo: contratosVencendo.reduce((total, c) => total + c.contrato.valor, 0)
    };
  };

  const getContratosVencendo = () => {
    const hoje = new Date();
    const em30Dias = new Date();
    em30Dias.setDate(hoje.getDate() + 30);

    return clientes.filter(c => {
      if (c.status !== 'Ativo') return false;
      const dataVencimento = new Date(c.contrato.dataVencimento);
      return dataVencimento >= hoje && dataVencimento <= em30Dias;
    });
  };

  const getContratosVencidos = () => {
    return clientes.filter(c => c.status === 'Vencido');
  };

  return {
    clientes,
    loading,
    getStatistics,
    getContratosVencendo,
    getContratosVencidos,
    loadClientes
  };
};
