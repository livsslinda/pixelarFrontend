import React, { useEffect, useState } from "react";
import Logo from "../../../img/logo.png";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

export default function PaginalInicial() {
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [requisitos, setRequisitos] = useState("");
  const [setor, setSetor] = useState("");
  const [salario, setSalario] = useState("");
  const [vagas, setVagas] = useState([]);
  const [erro, setErro] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
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
      } catch (error) {
        setErro("Erro ao buscar Vagas");
      } finally {
        setLoading(false);
      }
    };
    fetchVagas();
  }, [navigate]);
  const usuarioStorage = localStorage.getItem("usuarioLogado");
  if (!usuarioStorage) {
    navigate("/login");
    return;
  }
  const handleCriarVaga = async (e, close) => {
    e.preventDefault();
    try {
      const resposta = await fetch(`http://localhost:3000/vagas/criar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_usuario: usuarioStorage,
          titulo,
          descricao,
          requisitos,
          setor,
          salario,
        }),
      });

      if (!resposta.ok) {
        throw new Error("Erro ao criar vaga");
      }

      const novaVaga = await resposta.json();

      setVagas((prev) => [...prev, novaVaga]);

      close();

      setTitulo("");
      setDescricao("");
      setRequisitos("");
      setSetor("");
      setSalario("");
    } catch (error) {
      console.error(error);
      alert("Erro ao criar vaga");
    }
  };

  const handleDashboard = () => {
    navigate("/dashboard");
  };

  const handleCandidatos = () => {
    navigate("/candidatos");
  };

  const handleVagas = () => {
    navigate("/vagasE");
  };

  const handleDetalhes = () => {
    navigate("/detalhesVagasE");
  };

  const handlePerfil = () => {
    navigate("/perfilE");
  };

  const handleLogout = () => {
    localStorage.removeItem("usuarioLogado");
    setTimeout(() => {
      alert("Deslogando...");
      navigate("/");
    }, 500);
  };

  return (
    <PaginaContainer>
      {/* NAVBAR */}
      <BarraNavegacao>
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
          <TextoUsuario>Usuário</TextoUsuario>
          <Avatar onClick={handlePerfil}>👤</Avatar>
        </InfoUsuario>
      </BarraNavegacao>

      <Conteudo>
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
          <Popup
            trigger={<BotaoCriarVaga>Criar Vaga</BotaoCriarVaga>}
            modal
            nested
            overlayStyle={{ background: "rgba(0,0,0,0.5)" }}
            contentStyle={{
              background: "transparent", // 🔹 remove fundo branco
              border: "none",
              boxShadow: "none",
              padding: 0,
            }}
          >
            {(close) => (
              <div style={styles.container}>
                <div style={styles.card2}>
                  <span style={styles.fechar} onClick={close}>
                    Fechar ✖
                  </span>
                  <h2 style={{ marginBottom: "15px" }}>Nova Vaga</h2>

                  <form onSubmit={(e) => handleCriarVaga(e, close)}>
                    <InputForm
                      style={styles.caixaTexto}
                      type="text"
                      name="titulo"
                      value={titulo}
                      onChange={(e) => setTitulo(e.target.value)}
                      placeholder="Título"
                      required
                    />

                    <InputForm
                      style={styles.caixaTexto}
                      type="text"
                      name="descricao"
                      value={descricao}
                      onChange={(e) => setDescricao(e.target.value)}
                      placeholder="Descrição"
                      required
                    />

                    <InputForm
                      style={styles.caixaTexto}
                      type="text"
                      name="requisitos"
                      value={requisitos}
                      onChange={(e) => setRequisitos(e.target.value)}
                      placeholder="Requisitos"
                      required
                    />

                    <InputForm
                      style={styles.caixaTexto}
                      type="text"
                      name="setor"
                      value={setor}
                      onChange={(e) => setSetor(e.target.value)}
                      placeholder="Setor"
                      required
                    />

                    <InputForm
                      style={styles.caixaTexto}
                      type="number"
                      name="salario"
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

          {vagas.map((vaga, index) => (
            <CartaoVaga key={index}>
              <TituloVaga>{vaga.titulo}</TituloVaga>
              <DescricaoVaga>{vaga.descricao}</DescricaoVaga>
              <CaixaSalario>R$ {vaga.salario}</CaixaSalario>
              <CaixaIcones>
                <b>
                  <button
                    title="Editar"
                    className="btn btn-sm btn-outline-primary me-2"
                  >
                    <i className="bi bi-pencil-square"></i>
                  </button>
                  <button
                    title="Excluir"
                    className="btn btn-sm btn-outline-danger me-2"
                  >
                    <i className="bi bi-trash3-fill"></i>
                  </button>
                </b>
              </CaixaIcones>

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
                      <span style={styles.fechar} onClick={close}>
                        Fechar ✖
                      </span>

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
