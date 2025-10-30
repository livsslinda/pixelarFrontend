import React, { useEffect, useState } from "react";
import Logo from "../../../img/logo.png";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import PillNav from "../../componentesMenu/PillNav";
import { FiLogOut } from "react-icons/fi";
import { VscAccount } from "react-icons/vsc";
import { IoMdClose } from "react-icons/io";
import { motion } from "framer-motion";

import Dock from "../../componentesMenu/Dock";

export default function PaginaInicial() {
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [requisitos, setRequisitos] = useState("");
  const [setor, setSetor] = useState("");
  const [salario, setSalario] = useState("");
  const [vagas, setVagas] = useState([]);
  const [erro, setErro] = useState(null);
  const [loading, setLoading] = useState(true);
  
    //
    const [setores, setSetores] = useState([]);
    const [setorSelecionado, setSetorSelecionado] = useState("");
    const [salarioMaximo, setSalarioMaximo] = useState(0);
    const [maiorSalarioDisponivel, setMaiorSalarioDisponivel] = useState(0);
    const [buscaTitulo, setBuscaTitulo] = useState("");
    //
    const vagasFiltradas = vagas.filter((v) => {
    const tituloValido = v.titulo.toLowerCase().includes(buscaTitulo.toLowerCase());
    const salarioValido = !salarioMaximo || Number(v.salario) <= salarioMaximo;
    const setorValido = !setorSelecionado || v.setor === setorSelecionado;
    return tituloValido && salarioValido && setorValido;
    });
    //


  const [vagaEmEdicao, setVagaEmEdicao] = useState(null);
  const [formDados, setFormDados] = useState({
    id_vaga: "",
    id_usuario: "",
    titulo: "",
    descricao: "",
    requisitos: "",
    setor: "",
    salario: "",
    status_vaga: "",
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [editErro, setEditErro] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const navigate = useNavigate();

  const atualizarVaga = async (id, dadosVaga) => {
    try {
      const resposta = await fetch(
        `http://localhost:3000/vagas/atualizar/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            // Authorization: `Bearer ${usuario.token}`,
          },
          body: JSON.stringify(dadosVaga),
        }
      );
      return await resposta.json();
    } catch (erro) {
      console.log("Erro ao atualizar vaga:", erro);
      throw erro;
    }
  };

  useEffect(() => {
    const fetchVagas = async () => {
      try {
        setLoading(true);
        setErro(null);
        const resposta = await fetch(`http://localhost:3000/vagas/listarTodas`);
        if (!resposta.ok) {
          throw new Error("Erro ao buscar Vagas");
        }
        const dados = await resposta.json();
        setVagas(dados);
      const vagasComEmpresa = await Promise.all(
          dados.map(async (vaga) => {
            const resUsuario = await fetch(
              `http://localhost:3000/usuarios/buscarPorId/${vaga.id_usuario}`
            );
            if (!resUsuario.ok)
              return { ...vaga, nome_empresa: "Desconhecida" };
            const usuarioDados = await resUsuario.json();
            return { ...vaga, nome_empresa: usuarioDados.nome };
          })
        );
        const maiorSalario = Math.max(...vagasComEmpresa.map(v => Number(v.salario) || 0));
setMaiorSalarioDisponivel(maiorSalario);
setSalarioMaximo(maiorSalario); // já começa no máximo
        console.log("Empresa da vaga:", vagas.nome_empresa);
        setVagas(vagasComEmpresa);
        //
        const setoresUnicos = [...new Set(vagasComEmpresa.map((v) => v.setor))];
        setSetores(setoresUnicos);
        //
        // setVagas(dados);
      } catch (error) {
        setErro("Erro ao buscar Vagas");
      } finally {
        setLoading(false);
      }
    };
    fetchVagas();
  }, [navigate]);

  const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));
  if (!usuario) {
    navigate("/");
    return null;
  }

  const handleCriarVaga = async (e, close) => {
    e.preventDefault();

    console.log("Criando vaga com dados:", {
      id_usuario: usuario.id,
      titulo,
      descricao,
      requisitos,
      setor,
      salario: Number(salario),
    });

    try {
      const resposta = await fetch(`http://localhost:3000/vagas/criar`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Authorization: `Bearer ${usuario.token}`,
        },
        body: JSON.stringify({
          id_usuario: usuario.id,
          titulo,
          descricao,
          requisitos,
          setor,
          salario: Number(salario),
        }),
      });

      const dadosResposta = await resposta.json();

      if (!resposta.ok) {
        console.error("Erro do backend ao criar vaga:", dadosResposta);
        alert(
          `Erro ao criar vaga: ${dadosResposta.erro || dadosResposta.mensagem}`
        );
        return;
      }

      console.log("Vaga criada com sucesso:", dadosResposta);
      setVagas((prev) => [...prev, dadosResposta]);
      close();

      setTitulo("");
      setDescricao("");
      setRequisitos("");
      setSetor("");
      setSalario("");
    } catch (error) {
      console.error("Erro no fetch de criar vaga:", error);
      alert(`Erro ao criar vaga: ${error.message}`);
    }
  };

  // Editar vaga
  const execEditar = (vaga) => {
    setVagaEmEdicao(vaga);
    setFormDados({
      id_vaga: vaga.id_vaga,
      id_usuario: vaga.id_usuario,
      titulo: vaga.titulo,
      descricao: vaga.descricao,
      requisitos: vaga.requisitos,
      setor: vaga.setor,
      salario: vaga.salario,
      status_vaga: vaga.status_vaga,
    });
    setEditErro(null);
    setShowEditModal(true);
  };

  const handleSalvarEdicao = async (e) => {
    e.preventDefault();
    if (!vagaEmEdicao) return;

    setIsUpdating(true);
    setEditErro(null);

    try {
      const carregar = {
        id_usuario: formDados.id_usuario,
        titulo: formDados.titulo,
        descricao: formDados.descricao,
        requisitos: formDados.requisitos,
        setor: formDados.setor,
        salario: parseFloat(formDados.salario),
        status_vaga: formDados.status_vaga,
      };

      const vagaAtualizada = await atualizarVaga(
        vagaEmEdicao.id_vaga,
        carregar
      );

      setVagas((prev) =>
        prev.map((vaga) =>
          vaga.id_vaga === vagaAtualizada.id_vaga ? vagaAtualizada : vaga
        )
      );

      setShowEditModal(false);
      setVagaEmEdicao(null);
      window.location.reload();
    } catch (erro) {
      console.log("Erro ao salvar edição", erro);
      setEditErro("Falha ao salvar edição " + erro);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancelarEdicao = () => {
    setShowEditModal(false);
    setVagaEmEdicao(null);
    setEditErro(null);
  };

  // Excluir vaga
  const executaExcluir = async (idVaga) => {
    if (window.confirm(`Tem certeza que deseja excluir a vaga ID ${idVaga}?`)) {
      try {
        const resposta = await fetch(
          `http://localhost:3000/vagas/deletar/${idVaga}`,
          {
            method: "DELETE",
            // headers: {
            //   Authorization: `Bearer ${usuario.token}`,
            // },
          }
        );

        if (!resposta.ok) {
          throw new Error("Erro ao excluir no servidor");
        }

        setVagas((prev) => prev.filter((vaga) => vaga.id_vaga !== idVaga));
        alert(`Vaga ID ${idVaga} excluída com sucesso!`);
      } catch (erro) {
        console.error(`Erro ao excluir vaga ID ${idVaga}`, erro);
        alert(`Falha ao excluir vaga: ${erro.message}`);
      }
    }
  };
  // Navegação
  const handleDashboard = () => navigate("/dashboard");
  const handleCandidatos = () => navigate("/candidatos");
  const handleVagas = () => navigate("/vagasE");
  const handleDetalhes = () => navigate("/detalhesVagasE");
  const handlePerfil = () => navigate("/perfilE");
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
            { label: "Home", href: "/vagas" },
            { label: "Dashboard", href: "/dashboard" },
            { label: "Candidatos", href: "/candidatos" },
          ]}
          activeHref="/vagas"
          className="custom-nav"
          ease="power2.easeOut"
          baseColor="#7000d8"
          pillColor="#ffffff"
          hoveredPillTextColor="#ffffff"
          pillTextColor="#000000"
        />
      </BarraNav>
      {/* <BarraNavegacao>
        <LogoContainer>
          <ImagemLogo src={Logo} alt="Logo" onClick={handlePerfil} />
        </LogoContainer>

        <ItensNav>
          <BotaoNav ativo>Vagas</BotaoNav>
          <BotaoNav onClick={handleDashboard}>Dashboard</BotaoNav>
          <BotaoNav onClick={handleCandidatos}>Candidatos</BotaoNav>
        </ItensNav>

        <InfoUsuario>
          <Logout onClick={handleLogout}>Sair</Logout>
          <TextoUsuario>{usuario.nome}</TextoUsuario>
          <Avatar onClick={handlePerfil}>👤</Avatar>
        </InfoUsuario>
      </BarraNavegacao> */}

      {/* CONTEÚDO */}
      <Conteudo>
        <BarraLateral>
          <TituloSidebar>Filtrar</TituloSidebar>
          <Entrada
            type="text"
            placeholder="🔍"
            value={buscaTitulo}
            onChange={(e) => setBuscaTitulo(e.target.value)}
          />
          <Selecao
            value={setorSelecionado}
            onChange={(e) => setSetorSelecionado(e.target.value)}
          >
            <option value="">Todas</option>
            {setores.map((setor, index) => (
              <option key={index} value={setor}>
                {setor}
              </option>
            ))}
          </Selecao>
          <Rotulo>Salário: R$ {salarioMaximo > 0 ? salarioMaximo : ""}</Rotulo>
          <ControleDeslizante
            type="range"
            min="0"
            max={maiorSalarioDisponivel}
            step="100"
            value={salarioMaximo}
            onChange={(e) => setSalarioMaximo(Number(e.target.value))}
          />
          <Popup
            trigger={<BotaoCriarVaga>Criar Vaga</BotaoCriarVaga>}
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
                <div style={styles.card2}>
                  <h2 style={styles.fechar} onClick={close}>
                    <IoMdClose size={30} />
                  </h2>
                  <h2 style={{ marginBottom: "15px" }}>Nova Vaga</h2>
                  <form onSubmit={(e) => handleCriarVaga(e, close)}>
                    <InputForm
                      type="text"
                      value={titulo}
                      onChange={(e) => setTitulo(e.target.value)}
                      placeholder="Título"
                      required
                    />
                    <InputForm
                      type="text"
                      value={descricao}
                      onChange={(e) => setDescricao(e.target.value)}
                      placeholder="Descrição"
                      required
                    />
                    <InputForm
                      type="text"
                      value={requisitos}
                      onChange={(e) => setRequisitos(e.target.value)}
                      placeholder="Requisitos"
                      required
                    />
                    <InputForm
                      type="text"
                      value={setor}
                      onChange={(e) => setSetor(e.target.value)}
                      placeholder="Setor"
                      required
                    />
                    <InputForm
                      type="number"
                      value={salario}
                      onChange={(e) => setSalario(e.target.value)}
                      placeholder="Salário"
                      required
                    />
                    <BotaoSubmit type="submit">Salvar</BotaoSubmit>
                  </form>
                </div>
              </div>
            )}
          </Popup>
        </BarraLateral>

        <ListaVagas>
          {loading && <p>Carregando vagas...</p>}
          {erro && <p>{erro}</p>}
          {!loading && !erro && vagas.length === 0 && (
            <p>Nenhuma vaga encontrada.</p>
          )}

          {vagasFiltradas.map((vaga) => (
            <CartaoVaga key={vaga.id_vaga}>
              <TituloVaga>{vaga.titulo}</TituloVaga>
              <DescricaoVaga>{vaga.descricao}</DescricaoVaga>
              <CaixaSalario>R$ {vaga.salario}</CaixaSalario>
              <CaixaIcones>
                {vaga.id_usuario === usuario.id && (
                  <>
                    <button
                      title="Editar"
                      className="btn btn-sm btn-outline-primary me-2"
                      onClick={() => execEditar(vaga)}
                    >
                      <i className="bi bi-pencil-square"></i>
                    </button>
{showEditModal && (
                  <Popup
                    open={showEditModal}
                    modal
                    nested
                    onClose={handleCancelarEdicao}
                    overlayStyle={{ background: "rgba(0, 0, 0, 0.5)" }}
                    contentStyle={{
                      background: "transparent",
                      border: "none",
                      boxShadow: "none",
                      padding: 0,
                    }}
                  >
                    {(close) => (
                      <div style={styles.container}>
                        <div style={styles.card2}>
                          <h2
                            style={styles.fechar}
                            onClick={handleCancelarEdicao}
                          >
                            Fechar ✖
                          </h2>
                          <h2 style={{ marginBottom: "15px" }}>Editar Vaga</h2>
                          <form onSubmit={handleSalvarEdicao}>
                            <InputForm
                              type="text"
                              value={formDados.titulo}
                              onChange={(e) =>
                                setFormDados({
                                  ...formDados,
                                  titulo: e.target.value,
                                })
                              }
                              placeholder="Título"
                              required
                            />
                            <InputForm
                              type="text"
                              value={formDados.descricao}
                              onChange={(e) =>
                                setFormDados({
                                  ...formDados,
                                  descricao: e.target.value,
                                })
                              }
                              placeholder="Descrição"
                              required
                            />
                            <InputForm
                              type="text"
                              value={formDados.requisitos}
                              onChange={(e) =>
                                setFormDados({
                                  ...formDados,
                                  requisitos: e.target.value,
                                })
                              }
                              placeholder="Requisitos"
                              required
                            />
                            <InputForm
                              type="text"
                              value={formDados.setor}
                              onChange={(e) =>
                                setFormDados({
                                  ...formDados,
                                  setor: e.target.value,
                                })
                              }
                              placeholder="Setor"
                              required
                            />
                            <InputForm
                              type="number"
                              value={formDados.salario}
                              onChange={(e) =>
                                setFormDados({
                                  ...formDados,
                                  salario: e.target.value,
                                })
                              }
                              placeholder="Salário"
                              required
                            />
                            <BotaoSubmit type="submit" disabled={isUpdating}>
                              {isUpdating ? "Salvando..." : "Salvar Edição"}
                            </BotaoSubmit>
                          </form>
                        </div>
                      </div>
                    )}
                  </Popup>
                )}
                    <button
                      title="Excluir"
                      className="btn btn-sm btn-outline-danger me-2"
                      onClick={() => executaExcluir(vaga.id_vaga)}
                    >
                      <i className="bi bi-trash3-fill"></i>
                    </button>
                  </>
                )}
              </CaixaIcones>

              {/* Detalhes */}
              <Popup
                trigger={<BotaoDetalhes>Ver detalhes</BotaoDetalhes>}
                modal
                nested
                overlayStyle={{ background: "rgba(0, 0, 0, 0.5)" }}
                contentStyle={{
                  background: "transparent",
                  border: "none",
                  boxShadow: "none",
                  padding: 0,
                }}
              >
                {(close) => (
                  <div style={styles.container}>
                    <div style={styles.card}>
                      <h2 style={styles.fechar} onClick={close}>
                        <IoMdClose size={30} />
                      </h2>
                      <h1 style={styles.titulo}>{vaga.titulo}</h1>
                      <h3 style={styles.subtitulo}>Informações da Vaga</h3>
                      <div style={styles.caixaTexto}>
                        <p>
                          <b>Descrição:</b> {vaga.descricao}
                        </p>
                        <p>
                          <b>Requisitos:</b> {vaga.requisitos}
                        </p>
                        <p>
                          <b>Setor:</b> {vaga.setor}
                        </p>
                        <p>
                          <b>Salário:</b> R$ {vaga.salario}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </Popup>
            </CartaoVaga>
          ))}
        </ListaVagas>
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

const PaginaContainer = styled.div`
  font-family: Arial, sans-serif;
  background-color: #efefff;
  min-height: 100vh;
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
const BarraNav = styled.div`
  background-color: rgba(112, 0, 216, 0);
  display: flex;
  align-items: center;
  padding: 10px 30px;
  justify-content: center;
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
  margin-top: 20px;
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
const BotaoCriarVaga = styled.button`
  margin-top: 15px;
  padding: 10px;
  border-radius: 8px;
  border: none;
  background-color: #7000d8;
  color: white;
  font-weight: bold;
  cursor: pointer;
  &:hover {
    background-color: #4e009d;
  }
`;

const InputForm = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 6px;
  border: 1px solid #ccc;
  outline: none;
`;

const BotaoSubmit = styled.button`
  background-color: #28a745;
  color: white;
  padding: 10px;
  width: 100%;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  &:hover {
    background-color: #1e7e34;
  }
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

const ControleDeslizante = styled.input.attrs({ type: "range" })`
  -webkit-appearance: none;
  width: 100%;
  height: 6px;
  border-radius: 5px;
  outline: none;
  cursor: pointer;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: #7000d8;
    cursor: pointer;
  }

  &::-moz-range-thumb {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: #7000d8;
    cursor: pointer;
  }
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
const CaixaIcones = styled.div`
  position: absolute;
  top: 60px;
  right: 20px;
  padding: 6px 10px;
  border-radius: 6px;
  font-weight: bold;
`;

const BotaoDetalhes = styled.button`
  margin-top: 10px;
  padding: 6px 12px;
  border-radius: 6px;
  border: 1px solid #000;
  background-color: #fff;
  cursor: pointer;
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
