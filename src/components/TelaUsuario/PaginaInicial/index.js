import React from "react";
import Logo from "../../../img/logo.png";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
export default function PaginalInicialU() {
  const navigate = useNavigate();

  const handleDashboard = () => {
    navigate("/dashboard");
  };

  const handleCandidaturas = () => {
    navigate("/candidaturaUsuario");
  };

  const handleRelatorios = () => {
    navigate("/relatorios");
  };

  const handleDetalhes = () => {
    navigate("/detalhes");
  };

  const handlePerfil = () => {
    navigate("/perfilU");
  };

  return (
    <PaginaContainer>
      {/* NAVBAR */}
      <BarraNavegacao>
        <LogoContainer>
          <ImagemLogo src={Logo} alt="Logo" />
        </LogoContainer>

        <ItensNav>
          <BotaoNav ativo>Vagas</BotaoNav>
          <BotaoNav onClick={handleRelatorios}>Relatórios</BotaoNav>
          <BotaoNav onClick={handleCandidaturas}>Candidaturas</BotaoNav>
        </ItensNav>

        <InfoUsuario onClick={handlePerfil}>
          <NomeUsuario>Usuário</NomeUsuario>
          <Avatar>👤</Avatar>
        </InfoUsuario>
      </BarraNavegacao>

      {/* CONTEÚDO */}
      <Conteudo>
        {/* SIDEBAR */}
        <BarraLateral>
          <TituloSidebar>Filtrar</TituloSidebar>
          <Entrada type="text" placeholder="🔍" />
          <Selecao>
            <option>Área</option>
          </Selecao>
          <Selecao>
            <option>Nível</option>
          </Selecao>
          <Rotulo>Salário</Rotulo>
          <ControleDeslizante type="range" />
        </BarraLateral>

        {/* VAGAS */}
        <ListaVagas>
          {[1, 2, 3].map((_, index) => (
            <CartaoVaga key={index}>
              <TituloVaga>*******</TituloVaga>
              <DescricaoVaga>********</DescricaoVaga>
              <CaixaSalario>R$ *****</CaixaSalario>
              <Popup
                trigger={<BotaoDetalhes>Ver detalhes</BotaoDetalhes>}
                modal
                nested
                overlayStyle={{ background: "rgba(0, 0, 0, 0.5)" }}
                contentStyle={{
                  background: "transparent", // 🔹 remove fundo branco
                  border: "none",
                  boxShadow: "none",
                  padding: 0,
                }}
              >
                {(close) => (
                  <div style={styles.container}>
                    <div style={styles.card}>
                      {/* Botão Fechar */}
                      <span style={styles.fechar} onClick={close}>
                        Fechar ✖
                      </span>

                      {/* Título */}
                      <h1 style={styles.titulo}>Lorem Ipsum</h1>

                      {/* Subtítulo */}
                      <h3 style={styles.subtitulo}>Informações da Vaga</h3>

                      {/* Caixa de texto */}
                      <div style={styles.caixaTexto}>
                        <p>
                          Lorem ipsum dolor sit amet, consectetur adipiscing
                          elit. Ut pellentesque sapien ac lorem accumsan
                          venenatis. Maecenas non erat erat. Morbi et facilisis
                          leo. Cras dignissim velit non condimentum. Suspendisse
                          id lacus justo. Sed scelerisque bibendum massa, ut
                          commodo nibh bibendum non. Suspendisse consectetur
                          arcu sed odio ullamcorper. Nam euismod augue eu
                          euismod. Duis scelerisque facilisis sodales. Duis
                          vestibulum, erat non vestibulum malesuada, nibh magna
                          molestie enim, sed lacinia eros sapien nec elit. Nulla
                          hendrerit felis neque massa placerat, vitae viverra
                          elit rhoncus. Maecenas vel arcu pharetra, placerat
                          mauris eu, pharetra dui. Sed consequat eleifend lacus
                          vel convallis. Praesent eu hendrerit ante, sit amet
                          vehicula mi. Nulla eget dolor erat.
                        </p>
                      </div>
                      <BotaoInscrever>Increver-se</BotaoInscrever>
                    </div>
                  </div>
                )}
              </Popup>
            </CartaoVaga>
          ))}
        </ListaVagas>
      </Conteudo>
    </PaginaContainer>
  );
}

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

const Conteudo = styled.div`
  display: flex;
  padding: 30px;
`;

const BarraLateral = styled.div`
  width: 200px;
  background-color: #c0b4ff;
  padding: 20px;
  border-radius: 10px;
  border: 2px solid #3891ff;
  margin-right: 30px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const TituloSidebar = styled.h3`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
`;

const Entrada = styled.input`
  padding: 8px;
  border-radius: 8px;
  border: 1px solid #999;
  outline: none;
`;

const Selecao = styled.select`
  padding: 8px;
  border-radius: 8px;
  border: 1px solid #999;
  outline: none;
`;

const Rotulo = styled.label`
  font-size: 14px;
  margin-top: 10px;
`;

const ControleDeslizante = styled.input`
  width: 100%;
`;

const ListaVagas = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  flex: 1;
`;

const CartaoVaga = styled.div`
  background-color: #b8a8f7;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 2px 2px 5px #ccc;

  position: relative;
`;

const TituloVaga = styled.p`
  font-weight: bold;
  margin-bottom: 5px;
`;

const DescricaoVaga = styled.p`
  margin-bottom: 10px;
`;

const CaixaSalario = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  background-color: #e6e6e6;
  padding: 6px 10px;
  border-radius: 6px;
  font-weight: bold;
`;

const BotaoInscrever = styled.button`
  border-radius: 15px;
  border: 0;
  font-size: 20px;
  padding: 10px 30px;
  background-color: #b783ff;
  color: white;
`;

const BotaoDetalhes = styled.button`
  margin-top: 10px;
  padding: 6px 12px;
  border-radius: 6px;
  border: 1px solid #000;
  background-color: #fff;
  cursor: pointer;
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
    textAlign: "left",
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
