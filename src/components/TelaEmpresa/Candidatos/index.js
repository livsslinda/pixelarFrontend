import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import Logo from "../../../img/logo.png";
import { FaPlus } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import PillNav from "../../componentesMenu/PillNav";
import { FiLogOut } from "react-icons/fi";
import { VscAccount } from "react-icons/vsc";
import Dock from "../../componentesMenu/Dock";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import { IoMdClose } from "react-icons/io";

/* ---------------------- ESTILOS ---------------------- */

const CartaoCandidato = styled.div`
  display: flex;
  align-items: center;
  background-color: #f1f1f1;
  color: black;
  padding: 15px;
  border-radius: 12px;
  justify-content: space-between;
  cursor: pointer;
`;

const CartaoCandidatoAnimado = styled(CartaoCandidato)`
  opacity: 0;
  transform: translateY(15px);
  animation: subir 0.4s ease forwards;

  @keyframes subir {
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  transition: transform 0.25s ease, box-shadow 0.3s ease;
  &:hover {
    transform: translateY(-6px) scale(1.02);
    box-shadow: 0 6px 20px rgba(90, 0, 255, 0.25);
  }
`;

const GradeCandidatos = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const InfoCandidato = styled.div`
  display: flex;
  align-items: center;
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
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &:hover {
    background-color: #3700b3;
    transform: scale(1.1);
  }
`;

const Container = styled.div`
  display: flex;
  height: calc(100vh - 60px);
  margin-top: 30px;
  justify-content: center;
  align-items: center;
`;

const BarraLateral = styled.div`
  width: 95vw;
  background: linear-gradient(to bottom, #2d007d, #512b90);
  color: white;
  padding: 20px;
  display: flex;
  flex-direction: column;
  height: 85%;
  margin-left: 5px;
  overflow-y: auto;
  border-radius: 10px;
`;

const ListaVagas = styled.div`
  display: flex;
  gap: 10px;
  overflow-x: auto;
  padding-bottom: 10px;
`;

const CartaoVaga = styled.div`
  background: #9992f5;
  color: black;
  font-weight: bold;
  padding: 8px 15px;
  border-radius: 15px;
  white-space: nowrap;
  cursor: pointer;
`;

const Titulo = styled.h2`
  margin: 20px 0 10px 0;
`;

const ConteudoLateral = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow-y: auto;
`;

const FotoCandidato = styled.img`
  width: 45px;
  height: 45px;
  border-radius: 50%;
  margin-right: 12px;
  border: 3px solid #bbaaff;
`;

const NomePontuacao = styled.div`
  flex: 1;
`;

const Nome = styled.div`
  font-weight: bold;
  font-size: 16px;
`;

const Pontuacao2 = styled.div`
  font-size: 14px;
  font-weight: bold;
  color: #333;
`;

const PopupCard = styled.div`
  background: rgba(83, 42, 147, 1);
  border-radius: 20px;
  padding: 30px;
  width: 600px;
  color: #ffffff;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
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
  font-weight: bold;
  border: 0;

  &:hover {
    background-color: #4b00cc;
  }
`;

const Fechar = styled.span`
  position: absolute;
  top: 15px;
  right: 20px;
  color: #00ff00;
  cursor: pointer;
`;

const EditarWrapper = styled.div`
  margin-top: 20px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const InputEdit = styled.input`
  padding: 12px;
  border: none;
  border-radius: 10px;
  width: 100%;
  font-size: 15px;
`;

const BotaoSalvar = styled.button`
  padding: 12px;
  background: #00c200;
  color: #fff;
  border: none;
  border-radius: 12px;
  font-weight: bold;
  cursor: pointer;

  &:hover {
    background: #009900;
  }
`;

const Corpo = styled.div`
  background-color: #c4caff;
`;

const BarraNav = styled.div`
  display: flex;
  justify-content: center;
  padding: 20px;
`;

const DockWrapper = styled.div`
  position: fixed;
  bottom: 0;
  width: 100%;
  display: flex;
  justify-content: center;
`;

/* ---------------------- COMPONENTE ---------------------- */

export default function Candidatos() {
  const navigate = useNavigate();
  const [vagas, setVagas] = useState([]);
  const [candidatos, setCandidatos] = useState([]);
  const [erro, setErro] = useState(null);
  const [editarAtivo, setEditarAtivo] = useState(false);
  const [novoStatus, setNovoStatus] = useState("");

  const items = [
    {
      icon: <VscAccount size={18} />,
      label: "Perfil",
      onClick: () => navigate("/perfilE"),
    },
    {
      icon: <FiLogOut size={18} />,
      label: "Sair",
      onClick: () => {
        localStorage.removeItem("usuarioLogado");
        navigate("/");
      },
    },
  ];

  useEffect(() => {
    const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));
    if (!usuario) return navigate("/");

    const fetchVagas = async () => {
      try {
        const resposta = await fetch(
          `http://localhost:3000/vagas/listarPorIdUsuario/${usuario.id}`
        );
        const dados = await resposta.json();
        setVagas(Array.isArray(dados) ? dados : [dados]);
      } catch {
        setErro("Erro ao buscar vagas");
      }
    };

    fetchVagas();
    fetchCandidatos();
  }, []);

  const fetchCandidatos = async () => {
    try {
      const resposta = await fetch("http://localhost:3000/candidaturas/listar");
      const dados = await resposta.json();
      setCandidatos(dados);
    } catch {
      setErro("Erro ao buscar candidatos");
    }
  };

  const editarCandidatura = async (id_candidatura) => {
    try {
      await fetch(
        `http://localhost:3000/candidaturas/atualizar/${id_candidatura}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            status_candidatura: "",
            pontuacao: "",
          }),
        }
      );

      fetchCandidatos();
      setEditarAtivo(false);
      setNovoStatus("");
    } catch {
      alert("Erro ao atualizar candidatura");
    }
  };

  return (
    <>
      <Corpo>
        <BarraNav>
          <PillNav
            logo={Logo}
            items={[
              { label: "Home", href: "/vagas" },
              { label: "Dashboard", href: "/dashboard" },
              { label: "Candidatos", href: "/candidatos" },
            ]}
            activeHref="/candidatos"
            className="custom-nav"
            ease="power2.easeOut"
            baseColor="#7000d8"
            pillColor="#ffffff"
            hoveredPillTextColor="#ffffff"
            pillTextColor="#000000"
          />
        </BarraNav>

        <Container>
          <BarraLateral>
            <ListaVagas>
              {vagas.map((vaga) => (
                <CartaoVaga key={vaga.id_vaga}>{vaga.titulo}</CartaoVaga>
              ))}
            </ListaVagas>

            <ConteudoLateral>
              <Titulo>Candidatos</Titulo>

              {candidatos.length === 0 ? (
                <p>Nenhum candidato encontrado</p>
              ) : (
                <GradeCandidatos>
                  {candidatos.map((cand, index) => (
                    <CartaoCandidatoAnimado
                      key={cand.id_candidatura}
                      style={{ animationDelay: `${index * 0.07}s` }}
                    >
                      <InfoCandidato>
                        <FotoCandidato
                          src={
                            cand.foto
                              ? cand.foto
                              : "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                          }
                          alt={cand.nome}
                        />

                        <NomePontuacao>
                          <Nome>{cand.nome}</Nome>
                          <Pontuacao2>
                            Pontuação: {cand.pontuacao || "N/A"}
                          </Pontuacao2>
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
                        >
                          {(close) => (
                            <PopupCard>
                              <Fechar onClick={close}>
                                <IoMdClose size={30} />
                              </Fechar>

                              <h2>Detalhes da Candidatura</h2>

                              <InfoBox>
                                <p>
                                  Status: <b>{cand.status}</b>
                                </p>
                                <p>Vaga: {cand.vagatitulo}</p>
                                <p>Data: {cand.data}</p>
                                <p>Pontuação: {cand.pontuacao}</p>
                              </InfoBox>

                              <BotaoEditar
                                onClick={() => setEditarAtivo(!editarAtivo)}
                              >
                                {editarAtivo ? "Fechar Edição" : "Editar"}
                              </BotaoEditar>

                              {editarAtivo && (
                                <EditarWrapper>
                                  <InputEdit
                                    placeholder="Novo Status"
                                    value={novoStatus}
                                    onChange={(e) =>
                                      setNovoStatus(e.target.value)
                                    }
                                  />

                                  <BotaoSalvar
                                    onClick={() =>
                                      editarCandidatura(cand.id_candidatura)
                                    }
                                  >
                                    Salvar Alterações
                                  </BotaoSalvar>
                                </EditarWrapper>
                              )}
                            </PopupCard>
                          )}
                        </Popup>
                      </Acoes>
                    </CartaoCandidatoAnimado>
                  ))}
                </GradeCandidatos>
              )}
            </ConteudoLateral>
          </BarraLateral>
        </Container>

        <DockWrapper>
          <Dock
            items={items}
            panelHeight={68}
            baseItemSize={50}
            magnification={70}
          />
        </DockWrapper>
      </Corpo>
    </>
  );
}
