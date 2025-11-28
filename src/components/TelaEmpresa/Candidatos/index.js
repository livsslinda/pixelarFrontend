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
import { AiFillFileText } from "react-icons/ai";

// ---------- ESTILOS ----------
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

const InputPontuacao = styled.input`
  padding: 12px;
  border: none;
  border-radius: 10px;
  width: 100%;
  font-size: 15px;
  background: #ffffff;
  color: #333;
  margin-top: 10px;

  &:focus {
    outline: 2px solid #6c00ff;
  }
`;
const ExibeCurriculo = styled.button`
  margin-top: 5px;
  padding: 10px 20px;
  border-radius: 12px;
  border: none;
  background-color: #28a745;
  color: white;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: #218838;
    transform: scale(1.02);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;
const SelectEdit = styled.select`
  padding: 12px;
  border: none;
  border-radius: 10px;
  width: 100%;
  font-size: 15px;
  background: #ffffff;
  color: #333;
  cursor: pointer;

  &:focus {
    outline: 2px solid #6c00ff;
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
  transition: 0.2s;
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

// ---------- COMPONENTE ----------
export default function Candidatos() {
  const navigate = useNavigate();
  const [vagas, setVagas] = useState([]);
  const [candidatos, setCandidatos] = useState([]);
  const [usuarios, setUsuarios] = useState({});
  const [erro, setErro] = useState(null);
  const [loading, setLoading] = useState(true);

  const [editarAtivo, setEditarAtivo] = useState(null);
  const [novoStatus, setNovoStatus] = useState("");
  const [novaPontuacao, setNovaPontuacao] = useState("");

  const [vagaSelecionada, setVagaSelecionada] = useState(null);

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
    if (!usuario) {
      navigate("/");
      return;
    }

    const fetchVagas = async () => {
      try {
        const resposta = await fetch(
          `http://localhost:3000/vagas/listarPorIdUsuario/${usuario.id}`
        );
        if (!resposta.ok) throw new Error("Erro ao buscar vagas");
        const dados = await resposta.json();
        setVagas(Array.isArray(dados) ? dados : [dados]);
      } catch (e) {
        setErro("Erro ao buscar vagas");
      }
    };

    fetchVagas();
    carregarCandidatos();
  }, []);

  const carregarCandidatos = async () => {
    setLoading(true);
    try {
      const resposta = await fetch("http://localhost:3000/candidaturas/listar");
      if (!resposta.ok) throw new Error("Erro ao buscar candidatos");

      const dados = await resposta.json();
      setCandidatos(dados || []);

      const idsUsuarios = Array.from(
        new Set((dados || []).map((c) => c.id_usuario).filter(Boolean))
      );

      const usuariosFetch = await Promise.all(
        idsUsuarios.map(async (id) => {
          const r = await fetch(
            `http://localhost:3000/usuarios/buscarPorId/${id}`
          );
          if (!r.ok) return { id, erro: true };
          const data = await r.json();
          return { id, data };
        })
      );

      const novoMap = {};
      usuariosFetch.forEach((u) => {
        if (u && u.id && u.data) novoMap[u.id] = u.data;
      });

      setUsuarios(novoMap);
    } catch (e) {
      console.error(e);
      setErro("Erro ao buscar candidatos");
    } finally {
      setLoading(false);
    }
  };
  const deletarCandidatura = async (cand) => {
    try {
      await fetch(
        `http://localhost:3000/candidaturas/deletar/${cand.id_candidatura}`,
        {
          method: "DELETE",
        }
      );

      await carregarCandidatos();
    } catch {
      setErro("Erro ao deletar Candidatura");
    }
  };
  const handleBaixarCurriculo = async (cand) => {
    try {
      setLoading(true);
      setErro("");

      const resposta = await fetch(
        `http://localhost:3000/curriculos/buscarPorUsuario/${cand.id_candidatura}`
      );

      if (!resposta.ok) {
        throw new Error("Currículo não encontrado para este usuário.");
      }

      const dados = await resposta.json();

      // Caso o backend retorne a URL do arquivo (ex: arquivo_url)
      if (dados.arquivo_url) {
        window.open(dados.arquivo_url, "_blank"); // abre em nova aba
      } else if (dados.arquivo_curriculo) {
        // Se veio em base64
        const link = document.createElement("a");
        link.href = dados.arquivo_curriculo;
        link.download = "curriculo.pdf";
        link.click();
      } else {
        throw new Error("Nenhum arquivo de currículo encontrado.");
      }
    } catch (error) {
      console.error(error);
      setErro("Não foi possível carregar o currículo.");
    } finally {
      setLoading(false);
    }
  };
  const editarCandidatura = async (cand) => {
    try {
      const body = {
        status_candidatura: novoStatus || cand.status_candidatura,
        pontuacao: novaPontuacao || cand.pontuacao,
      };

      await fetch(
        `http://localhost:3000/candidaturas/atualizar/${cand.id_candidatura}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );

      await carregarCandidatos();
      setEditarAtivo(null);
      setNovoStatus("");
      setNovaPontuacao("");
    } catch (e) {
      alert("Erro ao atualizar candidatura");
      console.error(e);
    }
  };

  // -------- FILTRAR candidatos pela vaga selecionada --------
  const candidatosFiltrados = vagaSelecionada
    ? candidatos.filter((c) => c.id_vaga === vagaSelecionada)
    : candidatos;

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
                <CartaoVaga
                  key={vaga.id_vaga}
                  onClick={() => setVagaSelecionada(vaga.id_vaga)}
                  style={{
                    background:
                      vagaSelecionada === vaga.id_vaga ? "#6c00ff" : "#9992f5",
                    color: vagaSelecionada === vaga.id_vaga ? "white" : "black",
                  }}
                >
                  {vaga.titulo}
                </CartaoVaga>
              ))}
            </ListaVagas>

            <ConteudoLateral>
              <Titulo>Candidatos</Titulo>

              {loading ? (
                <p>Carregando candidatos...</p>
              ) : candidatosFiltrados.length === 0 ? (
                <p>Nenhum candidato encontrado para esta vaga</p>
              ) : (
                <GradeCandidatos>
                  {candidatosFiltrados.map((cand, index) => {
                    const user = cand.id_usuario
                      ? usuarios[cand.id_usuario]
                      : null;

                    return (
                      <CartaoCandidatoAnimado
                        key={cand.id_candidatura}
                        style={{ animationDelay: `${index * 0.07}s` }}
                      >
                        <InfoCandidato>
                          <FotoCandidato
                            src={
                              user?.foto
                                ? user.foto
                                : "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                            }
                          />

                          <NomePontuacao>
                            <Nome>{user ? user.nome : "Usuário"}</Nome>
                            <Pontuacao2>
                              Pontuação:{" "}
                              {cand.pontuacao ? `${cand.pontuacao}%` : "N/A"}
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
                                    Status:{" "}
                                    <b>
                                      {cand.status || cand.status_candidatura}
                                    </b>
                                  </p>
                                  <p>
                                    Vaga:{" "}
                                    {cand.vagatitulo ||
                                      cand.nome_vaga ||
                                      cand.id_vaga}
                                  </p>
                                  <p>Data: {cand.data_candidatura}</p>
                                  <p>
                                    Pontuação:{" "}
                                    {cand.pontuacao
                                      ? `${cand.pontuacao}%`
                                      : "N/A"}
                                  </p>

                                  <ExibeCurriculo
                                    onClick={() => handleBaixarCurriculo(cand)}
                                  >
                                    <AiFillFileText size={20} />
                                    {loading
                                      ? "Carregando..."
                                      : "Exibir Currículo"}
                                  </ExibeCurriculo>
                                </InfoBox>

                                <BotaoEditar
                                  onClick={() =>
                                    setEditarAtivo(
                                      editarAtivo === cand.id_candidatura
                                        ? null
                                        : cand.id_candidatura
                                    )
                                  }
                                >
                                  {editarAtivo === cand.id_candidatura
                                    ? "Fechar Edição"
                                    : "Editar"}
                                </BotaoEditar>

                                {editarAtivo === cand.id_candidatura && (
                                  <EditarWrapper>
                                    <SelectEdit
                                      value={novoStatus}
                                      onChange={(e) =>
                                        setNovoStatus(e.target.value)
                                      }
                                    >
                                      <option value="">
                                        Selecione o novo status
                                      </option>
                                      <option value="Em andamento">
                                        Em andamento
                                      </option>
                                      <option value="Aprovado">Aprovado</option>
                                      <option value="Reprovado">
                                        Reprovado
                                      </option>
                                    </SelectEdit>

                                    <InputPontuacao
                                      type="number"
                                      placeholder="Nova pontuação"
                                      value={novaPontuacao}
                                      onChange={(e) =>
                                        setNovaPontuacao(e.target.value)
                                      }
                                    />

                                    <button
                                      onClick={() => editarCandidatura(cand)}
                                      style={{
                                        padding: "12px",
                                        background: "#00c200",
                                        color: "#fff",
                                        border: "none",
                                        borderRadius: "12px",
                                        fontWeight: "bold",
                                        cursor: "pointer",
                                      }}
                                    >
                                      Salvar Alterações
                                    </button>
                                  </EditarWrapper>
                                )}
                              </PopupCard>
                            )}
                          </Popup>
                          <button
                            title="Excluir"
                            className="btn btn-sm btn-outline-danger me-2"
                            onClick={() => deletarCandidatura(cand)}
                          >
                            <i className="bi bi-trash3-fill"></i>
                          </button>
                        </Acoes>
                      </CartaoCandidatoAnimado>
                    );
                  })}
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
