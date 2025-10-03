import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import Logo from "../../../img/logo.png";
import { FaPlus, FaCommentAlt } from "react-icons/fa";

import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
const CartaoCandidato = styled.div`
  display: flex;
  align-items: center;
  background-color: #f1f1f1;
  color: black;
  padding: 10px;
  margin-bottom: 15px;
  border-radius: 10px;
  justify-content: space-between;
  cursor: pointer;
`;

const InfoCandidato = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
`;

const Acoes = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const IconeAcao = styled.div`
  background-color: #5a00ff;
  color: white;
  border-radius: 50%;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &:hover {
    background-color: #3700b3;
  }
`;
const CandidaturaTitulo = styled.p`
  font-weight: bold;
  font-size: 16px;
  margin-bottom: 0;
  margin-top: 0;
  text-align: center;
`;

const CandidaturaT = styled.h2`
  margin-bottom: 0;
  font-size: 30px;
`;

const Container = styled.div`
  display: flex;
  height: calc(100vh - 60px); /* ocupa a tela inteira menos a navbar */
  font-family: Arial, sans-serif;
`;

const BarraLateral = styled.div`
  width: 300px;
  background: linear-gradient(to bottom, #2d007d, #512b90);
  color: white;
  padding: 20px;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow-y: auto; /* scroll só aqui se necessário */
`;

const ListaVagas = styled.div`
  display: flex;
  gap: 10px;
  overflow-x: auto;
  padding-bottom: 10px;
  margin-bottom: 10px;

  &::-webkit-scrollbar {
    height: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: #9992f5;
    border-radius: 10px;
  }
`;

const CartaoVaga = styled.div`
  background: #9992f5;
  color: black;
  font-weight: bold;
  padding: 8px 15px;
  border-radius: 15px;
  white-space: nowrap;
  cursor: pointer;
  flex-shrink: 0;

  &:hover {
    background: #bbaaff;
  }
`;

const Titulo = styled.h2`
  margin: 20px 0 10px 0; /* reduzido para evitar scroll */
`;

// Área do chat
const AreaChat = styled.div`
  flex: 1;
  background: #fff;
  display: flex;
  flex-direction: column;
  padding: 20px;
  border-radius: 0 10px 10px 0;
  height: 100%;
  overflow-y: auto; /* garante que só o chat role, não a tela */
`;

// Chat
const Chat = styled.div`
  background: #5a00ff;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 20px;
`;

const ConteudoLateral = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow-y: auto;
`;

const FotoCandidato = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
`;

const NomePontuacao = styled.div`
  flex: 1;
`;

const Nome = styled.div`
  font-weight: bold;
`;

const Pontuacao = styled.div`
  font-size: 30px;
  font-weight: bold;
  color: #ffffffff;
  margin-bottom: 15px;
`;
const Pontuacao2 = styled.div`
  font-size: 14px;
  font-weight: bold;
  color: #000000ff;
`;

const CabecalhoChat = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  padding: 15px;
`;

const TituloDetalhe = styled.h2`
  font-size: 30px;
  margin-bottom: 0;
`;

const FotoChat = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 10px;
`;

const NomeChat = styled.div`
  font-weight: bold;
  color: white;
`;

const Mensagens = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const BolhaMensagem = styled.div`
  background: #ddd;
  padding: 10px 15px;
  border-radius: 8px;
  max-width: 60%;
  position: relative;

  ${({ lado }) =>
    lado === "direita"
      ? `
    align-self: flex-end;
    border-bottom-right-radius: 0;
  `
      : `
    align-self: flex-start;
    border-bottom-left-radius: 0;
  `}
`;

const CampoMensagem = styled.div`
  display: flex;
  margin-top: 20px;
`;

const InputMensagem = styled.input`
  flex: 1;
  padding: 10px;
  border-radius: 15px;
  border: none;
  margin-right: 10px;
`;

const BotaoEnviar = styled.button`
  padding: 10px 15px;
  background: #9992f5;
  border: none;
  border-radius: 10px;
  color: black;
  cursor: pointer;
  font-weight: bold;
`;

const Fechar = styled.span`
  position: absolute;
  top: 10px;
  right: 15px;
  color: #00ff00;
  cursor: pointer;
  font-weight: bold;
`;

const PopupCard = styled.div`
  background: rgba(83, 42, 147, 1);
  border-radius: 20px;
  padding: 30px;
  width: 600px;
  color: #ffffffff;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  justify-self: center;
  flex-direction: column;
`;

const InfoBox = styled.div`
  margin: 15px 0;
  padding: 15px;
  background: rgba(148, 103, 219, 0.34);
  border-radius: 10px;
  text-align: center;
  width: 300px;
`;

const BotaoEditar = styled.button`
  width: 100%;
  padding: 14px;
  border-radius: 30px;
  background-color: #6c00ff;
  color: #fff;
  font-size: 16px;
  border: none;
  cursor: pointer;
  font-weight: bold;

  &:hover {
    background-color: #4b00cc;
  }
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
export default function Candidatos() {
  const navigate = useNavigate();
  const handleVagas = () => navigate("/vagas");
  const handleDashboard = () => navigate("/dashboard");
  const handlePerfil = () => {
    navigate("/perfilE");
  };
  const handleLogout = () => {
    localStorage.removeItem("usuarioLogado");
    setTimeout(() => navigate("/"), 500);
  };

  const [vagas, setVagas] = useState([]);
  const [erro, setErro] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));
    if (!usuario) {
      navigate("/login");
      return;
    }

    const fetchVagas = async () => {
      try {
        setLoading(true);
        setErro(null);
        const resposta = await fetch(
          `http://localhost:3000/vagas/listarPorIdUsuario/${usuario.id}`
        );
        if (!resposta.ok) throw new Error("Erro ao buscar Vagas");
        const dados = await resposta.json();
        console.log("Respoista da API: ", dados);
        setVagas(Array.isArray(dados) ? dados : [dados]);
      } catch (error) {
        setErro("Erro ao buscar Vagas");
      } finally {
        setLoading(false);
      }
    };

    fetchVagas();
  }, [navigate]);

  const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));

  return (
    <>
      <BarraNavegacao>
        <LogoContainer>
          <ImagemLogo src={Logo} alt="Logo" onClick={handlePerfil} />
        </LogoContainer>

        <ItensNav>
          <BotaoNav onClick={handleVagas}>Vagas</BotaoNav>
          <BotaoNav onClick={handleDashboard}>Dashboard</BotaoNav>
          <BotaoNav ativo>Candidatos</BotaoNav>
        </ItensNav>

        <InfoUsuario>
          <Logout onClick={handleLogout}>Sair</Logout>
          <TextoUsuario>{usuario.nome}</TextoUsuario>
          <Avatar onClick={handlePerfil}>👤</Avatar>
        </InfoUsuario>
      </BarraNavegacao>
      <Container>
        <BarraLateral>
          {/* LISTA DE VAGAS */}
          <ListaVagas>
            {loading ? (
              <CartaoVaga>Carregando...</CartaoVaga>
            ) : erro ? (
              <CartaoVaga>{erro}</CartaoVaga>
            ) : vagas.length === 0 ? (
              <CartaoVaga>Nenhuma vaga encontrada</CartaoVaga>
            ) : (
              vagas.map((vaga) => (
                <CartaoVaga key={vaga.id_vaga}>{vaga.titulo}</CartaoVaga>
              ))
            )}
          </ListaVagas>

          <ConteudoLateral>
            <Titulo>Candidatos</Titulo>
            <CartaoCandidato>
              <InfoCandidato>
                <FotoCandidato src="https://randomuser.me/api/portraits/women/10.jpg" />
                <NomePontuacao>
                  <Nome>Maria</Nome>
                  <Pontuacao2>Pontuação: 85%</Pontuacao2>
                </NomePontuacao>
              </InfoCandidato>
              <Acoes>
                <Popup
                  trigger={
                    <IconeAcao>
                      <FaPlus />
                    </IconeAcao>
                  }
                  modal
                  nested
                  overlayStyle={{ background: "rgba(0,0,0,0.6)" }}
                  contentStyle={{
                    background: "transparent",
                    border: "none",
                    boxShadow: "none",
                    padding: 0,
                  }}
                >
                  {(close) => (
                    <PopupCard>
                      <Fechar onClick={close}>✖</Fechar>
                      <CandidaturaT>Detalhe de Candidatura</CandidaturaT>
                      <CandidaturaTitulo>Candidatura nº XXX</CandidaturaTitulo>
                      <InfoBox>
                        <p>
                          Status: <b>Em andamento</b>
                        </p>
                        <p>Vaga: XXXXX</p>
                        <p>Data: 12/09/2025</p>
                        <Pontuacao>Pontuação: 85%</Pontuacao>
                      </InfoBox>
                      <BotaoEditar>Editar</BotaoEditar>
                    </PopupCard>
                  )}
                </Popup>

                <IconeAcao>
                  <FaCommentAlt />
                </IconeAcao>
              </Acoes>
            </CartaoCandidato>
            <CartaoCandidato>
              {" "}
              <InfoCandidato>
                {" "}
                <FotoCandidato src="https://randomuser.me/api/portraits/men/32.jpg" />{" "}
                <NomePontuacao>
                  {" "}
                  <Nome>João</Nome> <Pontuacao2>Pontuação: 72%</Pontuacao2>{" "}
                </NomePontuacao>{" "}
              </InfoCandidato>{" "}
              <Acoes>
                <Popup
                  trigger={
                    <IconeAcao>
                      <FaPlus />
                    </IconeAcao>
                  }
                  modal
                  nested
                  overlayStyle={{ background: "rgba(0,0,0,0.6)" }}
                  contentStyle={{
                    background: "transparent",
                    border: "none",
                    boxShadow: "none",
                    padding: 0,
                  }}
                >
                  {(close) => (
                    <PopupCard>
                      <Fechar onClick={close}>✖</Fechar>
                      <TituloDetalhe>Detalhe de Candidatura</TituloDetalhe>
                      <CandidaturaTitulo>Candidatura nº XXX</CandidaturaTitulo>
                      <InfoBox>
                        <p>
                          Status: <b>Em andamento</b>
                        </p>
                        <p>Vaga: XXXXX</p>
                        <p>Data: 12/09/2025</p>
                        <Pontuacao>Pontuação: 85%</Pontuacao>
                      </InfoBox>
                      <BotaoEditar>Editar</BotaoEditar>
                    </PopupCard>
                  )}
                </Popup>{" "}
                <IconeAcao>
                  {" "}
                  <FaCommentAlt />{" "}
                </IconeAcao>{" "}
              </Acoes>{" "}
            </CartaoCandidato>{" "}
            <CartaoCandidato>
              {" "}
              <InfoCandidato>
                {" "}
                <FotoCandidato src="https://randomuser.me/api/portraits/men/77.jpg" />{" "}
                <NomePontuacao>
                  {" "}
                  <Nome>Carlos</Nome> <Pontuacao2>Pontuação: 90%</Pontuacao2>{" "}
                </NomePontuacao>{" "}
              </InfoCandidato>{" "}
              <Acoes>
                <Popup
                  trigger={
                    <IconeAcao>
                      <FaPlus />
                    </IconeAcao>
                  }
                  modal
                  nested
                  overlayStyle={{ background: "rgba(0,0,0,0.6)" }}
                  contentStyle={{
                    background: "transparent",
                    border: "none",
                    boxShadow: "none",
                    padding: 0,
                  }}
                >
                  {(close) => (
                    <PopupCard>
                      <Fechar onClick={close}>✖</Fechar>
                      <TituloDetalhe>Detalhe de Candidatura</TituloDetalhe>
                      <CandidaturaTitulo>Candidatura nº XXX</CandidaturaTitulo>
                      <InfoBox>
                        <p>
                          Status: <b>Em andamento</b>
                        </p>
                        <p>Vaga: XXXXX</p>
                        <p>Data: 12/09/2025</p>
                        <Pontuacao>Pontuação: 85%</Pontuacao>
                      </InfoBox>
                      <BotaoEditar>Editar</BotaoEditar>
                    </PopupCard>
                  )}
                </Popup>{" "}
                <IconeAcao>
                  {" "}
                  <FaCommentAlt />{" "}
                </IconeAcao>{" "}
              </Acoes>{" "}
            </CartaoCandidato>{" "}
            <CartaoCandidato>
              {" "}
              <InfoCandidato>
                {" "}
                <FotoCandidato src="https://randomuser.me/api/portraits/men/12.jpg" />{" "}
                <NomePontuacao>
                  {" "}
                  <Nome>Felipe</Nome> <Pontuacao2>Pontuação: 65%</Pontuacao2>{" "}
                </NomePontuacao>{" "}
              </InfoCandidato>{" "}
              <Acoes>
                <Popup
                  trigger={
                    <IconeAcao>
                      <FaPlus />
                    </IconeAcao>
                  }
                  modal
                  nested
                  overlayStyle={{ background: "rgba(0,0,0,0.6)" }}
                  contentStyle={{
                    background: "transparent",
                    border: "none",
                    boxShadow: "none",
                    padding: 0,
                  }}
                >
                  {(close) => (
                    <PopupCard>
                      <Fechar onClick={close}>✖</Fechar>
                      <TituloDetalhe>Detalhe de Candidatura</TituloDetalhe>
                      <CandidaturaTitulo>Candidatura nº XXX</CandidaturaTitulo>
                      <InfoBox>
                        <p>
                          Status: <b>Em andamento</b>
                        </p>
                        <p>Vaga: XXXXX</p>
                        <p>Data: 12/09/2025</p>
                        <Pontuacao>Pontuação: 85%</Pontuacao>
                      </InfoBox>
                      <BotaoEditar>Editar</BotaoEditar>
                    </PopupCard>
                  )}
                </Popup>{" "}
                <IconeAcao>
                  {" "}
                  <FaCommentAlt />{" "}
                </IconeAcao>{" "}
              </Acoes>{" "}
            </CartaoCandidato>
          </ConteudoLateral>
        </BarraLateral>

        <AreaChat>
          <Chat>
            <CabecalhoChat>
              <FotoChat src="https://randomuser.me/api/portraits/women/10.jpg" />
              <NomeChat>Maria</NomeChat>
            </CabecalhoChat>

            <Mensagens>
              <BolhaMensagem lado="esquerda">Olá, tudo bem?</BolhaMensagem>
              <BolhaMensagem lado="direita">
                Oi, estou bem e você?
              </BolhaMensagem>
              <BolhaMensagem lado="esquerda">
                Também estou bem, obrigado!
              </BolhaMensagem>
            </Mensagens>

            <CampoMensagem>
              <InputMensagem type="text" placeholder="Digite sua mensagem..." />
              <BotaoEnviar>&gt;</BotaoEnviar>
            </CampoMensagem>
          </Chat>
        </AreaChat>
      </Container>
    </>
  );
}
