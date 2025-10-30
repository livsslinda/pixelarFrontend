import React, { useEffect, useState } from "react";
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
import { FaGear } from "react-icons/fa6";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import { IoMdClose } from "react-icons/io";
import { AiFillFileText } from "react-icons/ai";
import { motion } from "framer-motion";

export default function PerfilUsuario() {
  const [descricao_perfil, setDescricao_perfil] = useState("");

  const navigate = useNavigate();
  const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));

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
  useEffect(() => {
    const fetchDescricaoPerfil = async () => {
      try {
        const resposta = await fetch(
          `http://localhost:3000/usuarios/buscarDescricao/${usuario.id}`
        );
        if (resposta.ok) {
          const dados = await resposta.json();
          setDescricao_perfil(dados.descricao_perfil);
        } else {
          console.error("Erro ao buscar descrição do perfil");
        }
      } catch (error) {
        console.error("Erro na requisição:", error);
      }
    };

    fetchDescricaoPerfil();
  }, [usuario.id]);
  const handleSalvarDescricao = async () => {
    try {
      const resposta = await fetch(
        `http://localhost:3000/usuarios/atualizarDescricao/${usuario.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ descricao_perfil: descricao_perfil.trim() }),
        }
      );

      if (resposta.ok) {
        const dados = await resposta.json();
        setDescricao_perfil(dados.usuario.descricao_perfil);
        setEditando(false);
      } else {
        console.error("Erro ao atualizar descrição do perfil");
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
    }
  };
  const [cargo, setCargo] = useState("");
  const [foto, setFoto] = useState("");
  useEffect(() => {
    if (!usuario) {
      navigate("/");
      return null;
    }
    const fetchCargo = async () => {
      try {
        const resposta = await fetch(
          `http://localhost:3000/usuarios/buscarPorId/${usuario.id}`
        );
        if (resposta.ok) {
          const dados = await resposta.json();
          setCargo(dados);
          setFoto(dados);
          console.log(setFoto);
        }
      } catch (error) {
        console.error("Erro ao buscar usuário por ID:", error);
      }
    };

    fetchCargo();
  }, [usuario.id]);

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
          activeHref="/"
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
          <FotoPerfil src={foto.foto} alt="Foto de perfil" />
          <Nome>{usuario.nome}</Nome>
          <Cargo>{cargo.cargo}</Cargo>
          <Botoes>
            <Popup
              trigger={
                <BotaoConfig>
                  <Config>
                    Configurações {"  "}
                    <FaGear size={20} />
                  </Config>
                </BotaoConfig>
              }
              modal
              nested
              overlayStyle={{ background: "rgba(0,0,0,0.5)" }}
              contentStyle={{
                background: "transparent",
                border: "none",
                boxShadow: "none",
                padding: 0,
              }}
            >
              {(close) => (
                <div style={styles.container}>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    style={styles.card2}
                  >
                    <h2 style={styles.fechar} onClick={close}>
                      <IoMdClose size={30} />
                    </h2>
                    <h2 style={{ marginBottom: "15px" }}>Configurações</h2>
                  </motion.div>
                </div>
              )}
            </Popup>
            {/* <BotaoConfig>
              {" "}
              <h6>Atualizar Currículo</h6>
              <AiFillFileText size={30} />
            </BotaoConfig> */}
          </Botoes>
        </ProfileContainer>

        <ResumoBox>
          <ResumoTitulo>
            Descrição
            <FaEdit
              style={{ marginLeft: 10, cursor: "pointer", fontSize: 16 }}
              onClick={() => setEditando(true)}
            />
          </ResumoTitulo>

          {editando ? (
            <>
              <TextareaEdit
                value={descricao_perfil}
                onChange={(e) => setDescricao_perfil(e.target.value)}
              />
              <BotaoSalvar onClick={handleSalvarDescricao}>Salvar</BotaoSalvar>
            </>
          ) : (
            <ResumoTexto>
              {descricao_perfil || "Sem descrição cadastrada"}
            </ResumoTexto>
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
  margin-top: 20px;
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
const Config = styled.p`
  font-size: 14px;
  margin-right: 8px;
`;
const Botoes = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: row;
  gap: 10px;
  margin-top: 15px;
`;
/* -------- RESUMO -------- */
const ResumoBox = styled.div`
  margin-top: 10px;
  white-space: pre-wrap;
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

const BotaoConfig = styled.div`
  top: 20px;
  right: 20px;
  cursor: pointer;
  font-size: 20px;
  backround-color: #b188ff;
  margin-bottom: 0;
`;
const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    background: "linear-gradient(to bottom right, #210892, #563881)",
    borderRadius: "15px",
    padding: "30px",
    width: "500px",
    textAlign: "center",
    color: "white",
    position: "relative",
  },
  card2: {
    background: "linear-gradient(to bottom right, #210892, #563881)",
    borderRadius: "15px",
    padding: "70px",
    width: "900px",
    textAlign: "center",
    color: "white",
    position: "relative",
  },
  card: {
    background: "linear-gradient(to bottom right, #210892, #563881)",
    borderRadius: "15px",
    padding: "30px",
    width: "500px",
    textAlign: "center",
    color: "white",
    position: "relative",
  },
  fechar: {
    position: "absolute",
    top: "10px",
    right: "15px",
    fontSize: "12px",
    color: "lime",
    cursor: "pointer",
  },
  titulo: {
    fontSize: "28px",
    marginBottom: "5px",
  },
  subtitulo: {
    fontSize: "14px",
    fontWeight: "normal",

    marginBottom: "10px",
  },
  caixaTexto: {
    backgroundColor: "white",
    color: "black",
    padding: "15px",
    borderRadius: "8px",
    fontSize: "12px",
    lineHeight: "1.5",
    marginBottom: "20px",
    textAlign: "justify",
  },
  botao: {
    backgroundColor: "#8000ff",
    color: "white",
    padding: "12px",
    width: "70%",
    border: "none",
    borderRadius: "25px",
    fontSize: "16px",
    cursor: "pointer",
  },
};
