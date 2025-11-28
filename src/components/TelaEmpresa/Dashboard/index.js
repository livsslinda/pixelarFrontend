import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Logo from "../../../img/logo.png";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import PillNav from "../../componentesMenu/PillNav";
import { FiLogOut } from "react-icons/fi";
import { VscAccount } from "react-icons/vsc";
import Dock from "../../componentesMenu/Dock";

export default function Dashboard() {
  const [vagasUsuario, setVagasUsuario] = useState([]);
  const [vagaSelecionada, setVagaSelecionada] = useState("");
  const [candidaturas, setCandidaturas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));
    if (!usuario) {
      navigate("/");
      return;
    }

    const carregarDados = async () => {
      setLoading(true);
      setErro(null);

      try {
        const vagasRes = await fetch(
          `http://localhost:3000/vagas/listarPorIdUsuario/${usuario.id}`
        );
        if (!vagasRes.ok) {
          throw new Error("Erro ao buscar vagas da empresa");
        }
        const vagasData = await vagasRes.json();
        const vagasEmpresa = Array.isArray(vagasData) ? vagasData : [];
        setVagasUsuario(vagasEmpresa);

        const candRes = await fetch(
          `http://localhost:3000/candidaturas/listar`
        );
        if (!candRes.ok) {
          throw new Error("Erro ao buscar candidaturas");
        }
        const todasCandidaturas = await candRes.json();
        const todasArr = Array.isArray(todasCandidaturas)
          ? todasCandidaturas
          : [];

        // 🔥 Filtra somente candidaturas das vagas do usuário
        const idsVagasEmpresa = vagasEmpresa.map((v) => v.id_vaga);

        const candidaturasFiltradas = todasArr.filter((c) =>
          idsVagasEmpresa.includes(Number(c.id_vaga))
        );

        setCandidaturas(candidaturasFiltradas);
      } catch (err) {
        console.error(err);
        setErro(err.message || "Erro ao carregar dados");
      } finally {
        setLoading(false);
      }
    };

    carregarDados();
  }, [navigate]);

  const getStatus = (c) => c.status ?? c.status_candidatura ?? "";

  function totalDeCandidatos() {
    if (!vagaSelecionada) {
      return candidaturas.length;
    }
    return candidaturas.filter(
      (c) => String(c.id_vaga) === String(vagaSelecionada)
    ).length;
  }

  function totalDeVagasPreenchidas() {
    if (!vagaSelecionada) {
      return candidaturas.filter((c) => getStatus(c) === "aprovado").length;
    }
    return candidaturas.filter(
      (c) =>
        String(c.id_vaga) === String(vagaSelecionada) &&
        getStatus(c) === "aprovado"
    ).length;
  }

  const vagasProcessadas = vagasUsuario.map((v) => {
    const candidatosDaVaga = candidaturas.filter(
      (c) => String(c.id_vaga) === String(v.id_vaga)
    );
    return {
      id_vaga: v.id_vaga,
      titulo: v.titulo,
      status: v.status ?? "Em andamento",
      total: candidatosDaVaga.length,
      aprovados: candidatosDaVaga.filter((c) => getStatus(c) === "Aprovado")
        .length,
      reprovados: candidatosDaVaga.filter((c) => getStatus(c) === "Reprovado")
        .length,
      andamento: candidatosDaVaga.filter((c) => getStatus(c) === "Em andamento")
        .length,
    };
  });

  const funil = (() => {
    if (!vagaSelecionada) {
      const total = candidaturas.length;
      const aprovados = candidaturas.filter(
        (c) => getStatus(c) === "Aprovado"
      ).length;
      const reprovados = candidaturas.filter(
        (c) => getStatus(c) === "Reprovado"
      ).length;
      const andamento = candidaturas.filter(
        (c) => getStatus(c) === "Em andamento"
      ).length;

      return {
        total,
        emAndamento: andamento,
        aprovados,
        reprovados,
      };
    } else {
      const candidatosVaga = candidaturas.filter(
        (c) => String(c.id_vaga) === String(vagaSelecionada)
      );
      const total = candidatosVaga.length;
      const aprovados = candidatosVaga.filter(
        (c) => getStatus(c) === "Aprovado"
      ).length;
      const reprovados = candidatosVaga.filter(
        (c) => getStatus(c) === "Reprovado"
      ).length;
      const andamento = candidatosVaga.filter(
        (c) => getStatus(c) === "Em andamento"
      ).length;

      return {
        total,
        emAndamento: andamento,
        aprovados,
        reprovados,
      };
    }
  })();

  const handleLogout = () => {
    localStorage.removeItem("usuarioLogado");
    setTimeout(() => navigate("/"), 500);
  };
  const handlePerfil = () => {
    navigate("/PerfilU");
  };

  const BarraNavLocal = styled.div`
    background-color: rgba(112, 0, 216, 0);
    display: flex;
    align-items: center;
    padding: 10px 30px;
    justify-content: center;
  `;

  const items = [
    {
      icon: <VscAccount size={18} />,
      label: "Perfil",
      onClick: () => handlePerfil(),
    },
    {
      icon: <FiLogOut size={18} />,
      label: "Sair",
      onClick: () => handleLogout(),
    },
  ];

  return (
    <PaginaContainer>
      <BarraNavLocal>
        <PillNav
          logo={Logo}
          logoAlt="Company Logo"
          items={[
            { label: "Home", href: "/vagas" },
            { label: "Dashboard", href: "/dashboard" },
            { label: "Candidatos", href: "/candidatos" },
          ]}
          activeHref="/dashboard"
          className="custom-nav"
          ease="power2.easeOut"
          baseColor="#7000d8"
          pillColor="#ffffff"
          hoveredPillTextColor="#ffffff"
          pillTextColor="#000000"
        />
      </BarraNavLocal>

      <Filtros>
        <div>
          <Rotulo>Projeto</Rotulo>
          <Selecao
            value={vagaSelecionada}
            onChange={(e) => setVagaSelecionada(e.target.value)}
          >
            <option value="">Todos os projetos</option>
            {vagasUsuario.map((vaga) => (
              <option key={vaga.id_vaga} value={vaga.id_vaga}>
                {vaga.titulo}
              </option>
            ))}
          </Selecao>
        </div>
      </Filtros>

      <Cards>
        <Card>
          <h3>Candidatos Totais</h3>
          <p>
            <strong>{loading ? "..." : totalDeCandidatos()}</strong>
          </p>
        </Card>

        <Card>
          <h3>Vagas Preenchidas</h3>
          <p>
            <strong>{loading ? "..." : totalDeVagasPreenchidas()}</strong>
          </p>
        </Card>
      </Cards>

      <SecaoInferior>
        <PainelGrande>
          <h3>Funil de Recrutamento</h3>

          {erro && <p style={{ color: "red" }}>{erro}</p>}
          {loading && <p>Carregando...</p>}

          <FunilContainer>
            <BarraFunil tamanho={funil.total}>
              <span>Aplicações: {funil.total}</span>
            </BarraFunil>

            <BarraFunil tamanho={funil.emAndamento}>
              <span>Em Andamento: {funil.emAndamento}</span>
            </BarraFunil>

            <BarraFunil tamanho={funil.aprovados}>
              <span>Aprovados: {funil.aprovados}</span>
            </BarraFunil>

            <BarraFunil tamanho={funil.reprovados}>
              <span>Reprovados: {funil.reprovados}</span>
            </BarraFunil>
          </FunilContainer>

          <Tabela>
            <thead>
              <tr>
                <th>Vaga</th>
                <th>Status</th>
                <th>Candidatos</th>
              </tr>
            </thead>
            <tbody>
              {vagasProcessadas.map((v) => (
                <tr key={v.id_vaga}>
                  <td>{v.titulo}</td>
                  <td>{v.status}</td>
                  <td>{v.total}</td>
                </tr>
              ))}
            </tbody>
          </Tabela>
        </PainelGrande>
      </SecaoInferior>

      <DockWrapper>
        <Dock
          items={items}
          panelHeight={68}
          baseItemSize={50}
          magnification={70}
        />
      </DockWrapper>
    </PaginaContainer>
  );
}

/* ---------- ESTILOS ---------- */
const FunilContainer = styled.div`
  width: 100%;
  margin: 20px 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const BarraFunil = styled.div`
  background: #6a5acd;
  padding: 10px;
  border-radius: 8px;
  width: ${({ tamanho }) =>
    tamanho === 0 ? "10%" : `${Math.min(tamanho * 10, 100)}%`};
  transition: width 0.4s ease;
  color: #fff;
  font-weight: bold;
`;

const DockWrapper = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: center;
  background: transparent;
  z-index: 1000;
`;

const PaginaContainer = styled.div`
  font-family: Arial, sans-serif;
  background-color: #ceceffff;
  min-height: 100vh;
`;

const Filtros = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
  justify-content: center;
  align-items: center;
  margin-top: 60px;
`;

const Rotulo = styled.label`
  font-size: 14px;
  font-weight: bold;
  display: block;
  margin-bottom: 4px;
`;

const Selecao = styled.select`
  padding: 8px;
  border-radius: 8px;
  border: 1px solid #999;
  outline: none;
  width: 180px;
`;

const Cards = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
`;

const Card = styled.div`
  background-color: #fff;
  padding: 20px;
  border-radius: 12px;
  width: 200px;
  text-align: center;
  box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.1);

  h3 {
    font-size: 16px;
    margin-bottom: 10px;
  }

  p {
    font-size: 22px;
    margin: 0;
  }
`;

const SecaoInferior = styled.div`
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  margin-right: 10px;
  margin-left: 10px;
  width: 95%;
  justify-self: center;
`;

const PainelGrande = styled.div`
  background-color: #fff;
  padding: 20px;
  border-radius: 12px;
  flex: 2;
  min-width: 400px;
`;

const Tabela = styled.table`
  width: 100%;
  border-collapse: collapse;

  th,
  td {
    padding: 8px;
    border-bottom: 1px solid #ccc;
    text-align: left;
  }

  th {
    background-color: #f3f3f3;
  }
`;
