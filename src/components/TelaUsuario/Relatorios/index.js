import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Logo from "../../../img/logo.png";
import PillNav from "../../componentesMenu/PillNav";
import Dock from "../../componentesMenu/Dock";
import { FiLogOut } from "react-icons/fi";
import { VscAccount } from "react-icons/vsc";

export default function Relatorios() {
  const navigate = useNavigate();
  const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));

  if (!usuario) {
    navigate("/");
    return;
  }
  const handleCandidaturas = () => navigate("/candidaturaUsuario");
  const handleVagas = () => navigate("/vagasU");
  const handlePerfil = () => navigate("/perfilU");
  const handleLogout = () => {
    localStorage.removeItem("usuarioLogado");
    setTimeout(() => navigate("/"), 500);
  };

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
      {/* NAVBAR */}
      <BarraNav>
        <PillNav
          logo={Logo}
          logoAlt="Company Logo"
          items={[
            { label: "Home", href: "/vagasU" },
            { label: "Relatórios", href: "/relatorios" },
            { label: "Candidaturas", href: "/candidaturaUsuario" },
          ]}
          activeHref="/relatorios"
          className="custom-nav"
          ease="power2.easeOut"
          baseColor="#7000d8"
          pillColor="#ffffff"
          hoveredPillTextColor="#ffffff"
          pillTextColor="#000000"
        />
      </BarraNav>

      {/* CONTEÚDO */}
      <Conteudo>
        <SecaoTitulo>RELATÓRIOS</SecaoTitulo>
        <CaixasRelatorios>
          <CaixaRelatorio />
          <CaixaRelatorio />
        </CaixasRelatorios>

        <SecaoTitulo>MÉTRICAS</SecaoTitulo>
        <LinhasMetricas>
          <CaixaMetrica>Tempo de Contratação Médio</CaixaMetrica>
          <CaixaMetrica>Taxa de Conversão de Candidatos</CaixaMetrica>
        </LinhasMetricas>
        <LinhasMetricas>
          <CaixaMetrica full>Currículos Recebidos</CaixaMetrica>
        </LinhasMetricas>
      </Conteudo>
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

const PaginaContainer = styled.div`
  font-family: Arial, sans-serif;
  background-color: #efefff;
  min-height: 100vh;
`;

const BarraNavegacao = styled.div`
  background-color: #7000d8;
  display: flex;
  align-items: center;
  padding: 10px 30px;
  justify-content: space-between;
  margin-bottom: 30px;
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
`;

const ImagemLogo = styled.img`
  width: 40px;
  height: 40px;
  cursor: pointer;
`;

const ItensNav = styled.div`
  display: flex;
  gap: 15px;
`;
const DockWrapper = styled.div`
  position: fixed;
  bottom: 0;
  width: 100%;
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

const NomeUsuario = styled.span`
  font-size: 12px;
  color: #ffefff;
`;

const Avatar = styled.div`
  background-color: #d2bfff;
  border-radius: 50%;
  padding: 10px;
  font-size: 18px;
`;

/* CONTEÚDO */
const Conteudo = styled.div`
  padding: 40px;
`;

const SecaoTitulo = styled.h2`
  font-size: 24px;
  margin-bottom: 20px;
  color: #000;
`;

const CaixasRelatorios = styled.div`
  display: flex;
  gap: 30px;
  margin-bottom: 40px;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
`;

const CaixaRelatorio = styled.div`
  width: 300px;
  height: 150px;
  background-color: #b8a8f7;
  border-radius: 8px;
  box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.1);
`;

const LinhasMetricas = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  flex-wrap: wrap;
`;

const CaixaMetrica = styled.div`
  background-color: #ebebf9;
  padding: 16px;
  border-radius: 8px;
  border: 1px solid #5a41ff;
  font-size: 14px;
  width: ${(props) => (props.full ? "100%" : "calc(50% - 10px)")};
`;
const BarraNav = styled.div`
  background-color: rgba(112, 0, 216, 0);
  display: flex;
  align-items: center;
  padding: 10px 30px;
  justify-content: center;
`;
