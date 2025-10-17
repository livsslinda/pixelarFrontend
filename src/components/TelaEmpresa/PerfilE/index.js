import React, { useState } from "react";
import Logo from "../../../img/logo.png";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { FaEdit } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import Dock from "../../componentesMenu/Dock";
import PillNav from "../../componentesMenu/PillNav";
import { FiLogOut } from "react-icons/fi";
import { VscAccount } from "react-icons/vsc";
export default function PerfilUsuario() {
  const navigate = useNavigate();

  const handleDashboard = () => {
    navigate("/dashboard");
  };

  const handleCandidatos = () => {
    navigate("/candidatos");
  };

  const handleLogout = () => {
    localStorage.removeItem("usuarioLogado");
    setTimeout(() => navigate("/"), 500);
  };

  const handlePerfil = () => {
    navigate("/perfilE");
  };
  const [resumo, setResumo] = useState(
    "Desenvolvedor de software com mais de 5 anos de experiência em desenvolvimento web e móvel. Apaixonado por criar aplicações eficientes e escaláveis utilizando tecnologias modernas."
  );
  const [editando, setEditando] = useState(false);

  const handleEditar = () => {
    setEditando(true);
  };

  const handleSalvar = () => {
    setEditando(false);
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
            { label: "Home", href: "/vagas" },
            { label: "Dashboard", href: "/dashboard" },
            { label: "Candidatos", href: "/candidatos" },
          ]}
          activeHref="/perfilE"
          className="custom-nav"
          ease="power2.easeOut"
          baseColor="#7000d8"
          pillColor="#ffffff"
          hoveredPillTextColor="#ffffff"
          pillTextColor="#000000"
        />
      </BarraNav>

      {/* CONTEÚDO PERFIL */}
      <Conteudo>
        <ProfileContainer>
          <FotoPerfil
            src="https://br.web.img2.acsta.net/pictures/18/09/17/22/41/1680893.jpg"
            alt="Foto de perfil"
          />
          <Nome>Rihanna Silva</Nome>
          <Cargo>Desenvolvedor de Software</Cargo>
        </ProfileContainer>

        <ResumoBox>
          <ResumoTitulo>
            Descrição
            <FaEdit
              style={{ marginLeft: 10, cursor: "pointer", fontSize: 16 }}
              onClick={handleEditar}
            />
          </ResumoTitulo>

          {editando ? (
            <>
              <TextareaEdit
                value={resumo}
                onChange={(e) => setResumo(e.target.value)}
              />
              <BotaoSalvar onClick={handleSalvar}>Salvar</BotaoSalvar>
            </>
          ) : (
            <ResumoTexto>{resumo}</ResumoTexto>
          )}
        </ResumoBox>
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

const TextareaEdit = styled.textarea`
  width: 90%;
  max-width: 700px;
  height: 120px;
  font-size: 15px;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #aaa;
  margin: 0 auto; /* centraliza horizontalmente */
  display: block; /* necessário para centralização */
  resize: vertical;
`;
const BarraNav = styled.div`
  background-color: rgba(112, 0, 216, 0);
  display: flex;
  align-items: center;
  padding: 10px 30px;
  justify-content: center;
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

const BotaoSalvar = styled.button`
  margin: 15px auto 0 auto; /* centraliza horizontalmente e dá espaço em cima */
  display: block;
  padding: 10px 20px;
  border-radius: 8px;
  border: none;
  background-color: #7000d8;
  color: white;
  font-weight: bold;
  cursor: pointer;

  &:hover {
    background-color: #4b0082;
  }
`;
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

/* -------- PERFIL -------- */
const Conteudo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px;
`;

const ProfileContainer = styled.div`
  text-align: center;
`;

const FotoPerfil = styled.img`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 15px;
`;

const Nome = styled.h2`
  font-size: 24px;
  margin: 5px 0;
`;

const Cargo = styled.p`
  font-size: 14px;
  color: gray;
`;

const BotaoCurriculo = styled.button`
  margin-top: 15px;
  padding: 10px 20px;
  border-radius: 12px;
  border: none;
  background-color: #b188ff;
  color: black;
  font-weight: bold;
  cursor: pointer;

  &:hover {
    background-color: #7000d8;
    color: white;
  }
`;

/* -------- RESUMO -------- */
const ResumoBox = styled.div`
  margin-top: 30px;
  border: 1px solid #aaa;
  padding: 20px;
  border-radius: 8px;
  background-color: #efefff;
  max-width: 800px;
  width: 600px;
`;

const ResumoTitulo = styled.h3`
  font-size: 20px;
  margin-bottom: 10px;
`;

const ResumoTexto = styled.p`
  font-size: 15px;
  line-height: 1.6;
`;
