import React from "react";
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
  const navigate = useNavigate();

  const handleVagas = () => navigate("/vagas");
  const handleCandidatos = () => navigate("/candidatos");
  const handlePerfil = () => {
    navigate("/perfilE");
  };
  const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));
  if (!usuario) {
    navigate("/login");
    return;
  }
  const handleLogout = () => {
    localStorage.removeItem("usuarioLogado");
    setTimeout(() => navigate("/"), 500);
  };
  const BarraNav = styled.div`
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
      <BarraNav>
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
      </BarraNav>

      {/* FILTROS */}
      <Filtros>
        <div>
          <Rotulo>Período</Rotulo>
          <Selecao>
            <option>Últimos 30 dias</option>
          </Selecao>
        </div>
        <div>
          <Rotulo>Projeto</Rotulo>
          <Selecao>
            <option>Todos os projetos</option>
          </Selecao>
        </div>
        <div>
          <Rotulo>Status</Rotulo>
          <Selecao>
            <option>Aberta</option>
          </Selecao>
        </div>
      </Filtros>

      {/* CARDS */}
      <Cards>
        <Card>
          <h3>Total de Vagas</h3>
          <p>
            <strong>12</strong>
          </p>
          <span>4 abertas</span>
        </Card>
        <Card>
          <h3>Candidatos Totais</h3>
          <p>
            <strong>325</strong>
          </p>
          <span>+15 esta semana</span>
        </Card>
        <Card>
          <h3>Vagas Preenchidas</h3>
          <p>
            <strong>8</strong>
          </p>
          <span>Meta: 10</span>
        </Card>
      </Cards>

      {/* PAINÉIS */}
      <SecaoInferior>
        <PainelGrande>
          <h3>Funil de Recrutamento</h3>
          <Funil />

          <Tabela>
            <thead>
              <tr>
                <th>Vaga</th>
                <th>Status</th>
                <th>Tempo Aberta</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Dev Front End</td>
                <td>Em andamento</td>
                <td>10 dias</td>
              </tr>
              <tr>
                <td>Designer UX</td>
                <td>Fechada</td>
                <td>7 dias</td>
              </tr>
            </tbody>
          </Tabela>
        </PainelGrande>

        <PainelPequeno>
          <h3>Origem dos Candidatos</h3>
          <Donut />
          <Alertas>
            <strong>Tarefas / Alertas</strong>
            <ul>
              <li>Agendar entrevista com João L.</li>
              <li>Vaga Dev Back-end sem candidatos há 5 dias</li>
            </ul>
          </Alertas>
        </PainelPequeno>
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
/* FILTROS */
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

/* CARDS */
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

  span {
    font-size: 13px;
    color: #555;
  }
`;

/* PAINÉIS */
const SecaoInferior = styled.div`
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  margin-right: 10px;
  margin-left: 10px;
`;

const PainelGrande = styled.div`
  background-color: #fff;
  padding: 20px;
  border-radius: 12px;
  flex: 2;
  min-width: 400px;
`;

const Funil = styled.div`
  width: 100%;
  height: 150px;
  margin: 20px 0;
  background: linear-gradient(to bottom, #6399ff, #3db2ff, #1ccaa5, #00cc88);
  clip-path: polygon(0 0, 100% 0, 80% 100%, 20% 100%);
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

const PainelPequeno = styled.div`
  background-color: #fff;
  padding: 20px;
  border-radius: 12px;
  flex: 1;
  min-width: 300px;
`;

const Donut = styled.div`
  width: 200px;
  height: 200px;
  background-color: #f0f0f0;
  border-radius: 50%;
  margin: 0 auto 20px auto;
`;

const Alertas = styled.div`
  background-color: #f8f8f8;
  padding: 10px;
  border-radius: 6px;
  font-size: 14px;
`;

const TextoUsuario = styled.button`
  padding: 5px;
  color: #fff;
  font-size: 20px;
  background: transparent;
  border: 0px;
  font-weight: bold;
`;

const BarraNavegacao = styled.div`
  background-color: #7000d8;
  display: flex;
  align-items: center;
  padding: 10px 30px;
  justify-content: space-between;
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
`;

const ImagemLogo = styled.img`
  width: 40px;
  height: 40px;
  object-fit: contain;
  cursor: pointer;
`;

const ItensNav = styled.div`
  display: flex;
  gap: 15px;
`;

const BotaoNav = styled.button`
  background-color: ${(props) => (props.ativo ? "#000" : "#b188ff")};
  color: #fff;
  border: none;
  border-radius: 20px;
  padding: 8px 16px;
  font-size: 14px;
  cursor: pointer;
  &:hover {
    background-color: #000;
  }
`;

const InfoUsuario = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
`;

const Logout = styled.div`
  padding: 10px;
  border-radius: 10px;
  background-color: rgba(207, 0, 0, 1);
  width: 100px;
  text-align: center;
  height: 40px;
  padding: 5px;
  color: #fff;
  font-size: 20px;
  border: 0px;
  font-weight: bold;
`;

const Avatar = styled.div`
  background-color: #d2bfff;
  border-radius: 50%;
  padding: 10px;
  font-size: 18px;
`;
