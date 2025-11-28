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
// --- FUNÇÃO AUXILIAR DE CONVERSÃO DE ARQUIVO PARA BASE64 ---
const converterParaBase64 = (arquivo) => {
  return new Promise((resolver, rejeitar) => {
    const leitor = new FileReader();
    leitor.readAsDataURL(arquivo);
    leitor.onload = () => resolver(leitor.result);
    leitor.onerror = (erro) => rejeitar(erro);
  });
};
export default function PerfilUsuario() {
  const [descricao_perfil, setDescricao_perfil] = useState("");
  const [abrirEditar, setAbrirEditar] = useState(false);
  const [abrirCurriculo, setAbrirCurriculo] = useState(false);
  const [cpf_cnpj, setCpf_cnpj] = useState("");
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [usuario, setUsuario] = useState("");
  const [error, setErro] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [curriculo, setCurriculo] = useState("");

  const navigate = useNavigate();
  const usuarioL = JSON.parse(localStorage.getItem("usuarioLogado"));
  if (!usuarioL) {
    navigate("/");
  }
  const [formDados, setFormDados] = useState({
    id_usuario: usuarioL.id,
    nome: "",
    email: "",
    cargo: "",
    cpf_cnpj: "",
    senha: "",
  });
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
    navigate("/perfilU");
  };
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
    if (!usuarioL) {
      navigate("/");
      return;
    }

    const fetchUsuario = async () => {
      try {
        const resposta = await fetch(
          `http://localhost:3000/usuarios/buscarPorId/${usuarioL.id}`
        );

        if (resposta.ok) {
          const dados = await resposta.json();

          setCargo(dados.cargo);
          setFoto(dados.foto);
          setCpf_cnpj(dados.cpf_cnpj);
          setEmail(dados.email);
          setNome(dados.nome);
          setUsuario(dados);
          setDescricao_perfil(dados.descricao_perfil || "");

          setFormDados({
            id_usuario: usuarioL.id,
            nome: dados.nome,
            email: dados.email,
            cargo: dados.cargo,
            cpf_cnpj: dados.cpf_cnpj,
            senha: "",
          });
        } else {
          console.error("Erro ao buscar usuário por ID");
        }
      } catch (error) {
        console.error("Erro na requisição:", error);
      }
    };

    fetchUsuario();
  }, [usuarioL.id]);

  const handleSalvarPerfil = async (event) => {
    event.preventDefault();
    setLoading(true);
    setErro("");
    try {
      let fotoBase64 = null;
      if (foto) {
        fotoBase64 = await converterParaBase64(foto);
      }

      const resposta = await fetch(
        `http://localhost:3000/usuarios/atualizar/${usuarioL.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nome: formDados.nome,
            email: formDados.email,
            cargo: formDados.cargo,
            cpf_cnpj: formDados.cpf_cnpj,
            senha: formDados.senha,
            foto: fotoBase64,
          }),
        }
      );

      if (resposta.ok) {
        const dados = await resposta.json();
        setUsuario(dados);

        setAbrirEditar(false);
        setSuccess(true);
      } else {
        const erro = await resposta.text();
        console.error("Erro ao atualizar:", erro);
        setErro(erro.message || "Erro ao atualizar o Perfil. Tente novamente.");
      }
    } catch (erro) {
      console.error("Erro de conexão:", erro);
      setErro("Não foi possível conectar ao servidor.");
    } finally {
      setLoading(false);
    }
  };
  const handleSalvarCurriculo = async () => {
    setLoading(true);
    setErro("");
    setSuccess(false);
    try {
      if (!curriculo.file) {
        setErro("Selecione um arquivo PDF primeiro.");
        setLoading(false);
        return;
      }

      const base64 = await converterParaBase64(curriculo.file);

      const resposta = await fetch(
        `http://localhost:3000/curriculos/registrar`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id_usuario: usuarioL.id,
            arquivo_curriculo: base64, // Envia em base64 para o backend
          }),
        }
      );

      if (resposta.ok) {
        const dados = await resposta.json();
        setCurriculo(dados);
        setSuccess(true);
      } else {
        const erro = await resposta.text();
        console.error("Erro ao atualizar:", erro);
        setErro("Não foi possível conectar ao servidor.");
      }
    } catch (erro) {
      console.error("Erro de conexão:", erro);
      setErro("Não foi possível conectar ao servidor.");
    } finally {
      setLoading(false);
    }
  };
  const handleSalvarDescricao = async () => {
    setLoading(true);
    setErro("");
    setSuccess(false);

    try {
      const resposta = await fetch(
        `http://localhost:3000/usuarios/atualizarDescricao/${usuarioL.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ descricao_perfil: descricao_perfil.trim() }),
        }
      );

      if (resposta.ok) {
        const dadosAtualizados = await fetch(
          `http://localhost:3000/usuarios/buscarPorId/${usuarioL.id}`
        );
        const usuarioAtualizado = await dadosAtualizados.json();

        setDescricao_perfil(usuarioAtualizado.descricao_perfil);
        setSuccess(true);

        setTimeout(() => {
          setEditando(false);
          setSuccess(false);
        }, 500);
      } else {
        const erro = await resposta.text();
        console.error("Erro ao atualizar descrição do perfil:", erro);
        setErro("Não foi possível atualizar a descrição.");
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
      setErro("Erro de conexão com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  // --- EXIBIR CURRÍCULO CADASTRADO ---
  const handleBaixarCurriculo = async () => {
    try {
      setLoading(true);
      setErro("");

      const resposta = await fetch(
        `http://localhost:3000/curriculos/buscarPorUsuario/${usuarioL.id}`
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

  const [cargo, setCargo] = useState("");
  const [foto, setFoto] = useState("");
  useEffect(() => {
    if (!usuarioL) {
      navigate("/");
      return null;
    }
    const fetchCargo = async () => {
      try {
        const resposta = await fetch(
          `http://localhost:3000/usuarios/buscarPorId/${usuarioL.id}`
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
          <Nome>{usuarioL.nome}</Nome>
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
              lockScroll={false}
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
                    style={{
                      background:
                        "linear-gradient(to right bottom, rgb(33, 8, 146), rgb(86, 56, 129))",
                      borderRadius: "12px",
                      padding: "30px",
                      width: "90%",
                      maxWidth: "800px",
                      position: "relative",
                      textAlign: "center",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <h2 style={styles.fechar} onClick={close}>
                      <IoMdClose size={30} />
                    </h2>
                    <h2 style={{ marginBottom: "15px", color: "#ffffffff" }}>
                      Configurações
                    </h2>

                    <BotaoSalvar
                      onClick={() => setAbrirEditar(!abrirEditar)}
                      style={{
                        backgroundColor: "#7000d8",
                        color: "white",
                        marginBottom: "20px",
                      }}
                    >
                      {abrirEditar ? "Fechar edição" : "Editar Perfil"}
                    </BotaoSalvar>

                    <motion.div
                      initial={false}
                      animate={{
                        height: abrirEditar ? "auto" : 0,
                        opacity: abrirEditar ? 1 : 0,
                        marginTop: abrirEditar ? 20 : 0,
                      }}
                      transition={{ duration: 0.4, ease: "easeInOut" }}
                      style={{
                        overflow: "hidden",
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <EditarBox>
                        <h4>Editar Perfil</h4>
                        <Input
                          type="text"
                          value={formDados.nome}
                          onChange={(e) =>
                            setFormDados({
                              ...formDados,
                              nome: e.target.value,
                            })
                          }
                          placeholder="Nome"
                          required
                        />
                        <Input
                          type="email"
                          value={formDados.email}
                          onChange={(e) =>
                            setFormDados({
                              ...formDados,
                              email: e.target.value,
                            })
                          }
                          placeholder="E-mail"
                          required
                        />
                        <Input
                          type="text"
                          value={formDados.cargo}
                          onChange={(e) =>
                            setFormDados({
                              ...formDados,
                              cargo: e.target.value,
                            })
                          }
                          placeholder="Cargo"
                          required
                        />
                        <Input
                          type="text"
                          value={formDados.cpf_cnpj}
                          placeholder="CPF/CNPJ"
                          required
                        />
                        <Input
                          type="password"
                          value={formDados.senha}
                          onChange={(e) =>
                            setFormDados({
                              ...formDados,
                              senha: e.target.value,
                            })
                          }
                          placeholder="Senha"
                          required
                        />
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const arquivo = e.target.files[0];
                            if (arquivo) {
                              setFoto({
                                preview: URL.createObjectURL(arquivo),
                                file: arquivo,
                              });
                            }
                          }}
                        />

                        {foto && (
                          <img
                            src={foto.preview}
                            alt="Prévia"
                            style={styles.preview}
                          />
                        )}
                        {error && (
                          <div className="alert alert-danger" role="alert">
                            {error}
                          </div>
                        )}
                        {success && (
                          <SuccessBox>
                            Perfil atualizado com sucesso!
                          </SuccessBox>
                        )}
                        <BotaoSalvar
                          onClick={handleSalvarPerfil}
                          disabled={loading}
                        >
                          {loading ? "Atualizando..." : "Salvar"}
                        </BotaoSalvar>
                      </EditarBox>
                    </motion.div>
                    <BotaoSalvar
                      onClick={() => setAbrirCurriculo(!abrirCurriculo)}
                      style={{
                        backgroundColor: "#7000d8",
                        color: "white",
                        marginBottom: "20px",
                      }}
                    >
                      {abrirCurriculo ? "Fechar" : "Currículo"}
                    </BotaoSalvar>
                    <motion.div
                      initial={false}
                      animate={{
                        height: abrirCurriculo ? "auto" : 0,
                        opacity: abrirCurriculo ? 1 : 0,
                        marginTop: abrirCurriculo ? 20 : 0,
                      }}
                      transition={{ duration: 0.4, ease: "easeInOut" }}
                      style={{
                        overflow: "hidden",
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <EditarBox>
                        <h4>Editar Curriculo</h4>
                        <Input
                          type="file"
                          accept="application/pdf"
                          onChange={(e) => {
                            const arquivo = e.target.files[0];
                            if (arquivo) {
                              setCurriculo({
                                preview: arquivo.name,
                                file: arquivo,
                              });
                            }
                          }}
                        />
                        {error && (
                          <div className="alert alert-danger" role="alert">
                            {error}
                          </div>
                        )}
                        {success && (
                          <SuccessBox>
                            Currículo atualizado com sucesso!
                          </SuccessBox>
                        )}
                        <BotaoSalvar
                          onClick={handleSalvarCurriculo}
                          disabled={loading}
                        >
                          {loading ? "Atualizando..." : "Salvar"}
                        </BotaoSalvar>
                      </EditarBox>
                    </motion.div>
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

          {/* 🔽 Novo botão logo abaixo */}
          <ExibeCurriculo onClick={handleBaixarCurriculo}>
            <AiFillFileText size={20} />
            {loading ? "Carregando..." : "Exibir Currículo"}
          </ExibeCurriculo>
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
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}
              {success && <SuccessBox>Descrição salva com sucesso!</SuccessBox>}
              <BotaoSalvar onClick={handleSalvarDescricao} disabled={loading}>
                {loading ? "Salvando.." : "Salvar"}
              </BotaoSalvar>
            </>
          ) : (
            <ResumoTexto>
              {descricao_perfil?.trim() !== ""
                ? descricao_perfil
                : "Sem descrição cadastrada"}
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
const EditarBox = styled(motion.div)`
  background: linear-gradient(135deg, #ffffff 0%, #f4f0ff 100%);
  border-radius: 16px;
  box-shadow: 0px 10px 25px rgba(0, 0, 0, 0.15);
  padding: 40px 30px;
  width: 85%;
  max-width: 750px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  transition: all 0.3s ease;
  border: 1px solid #e0d6ff;
  margin-bottom: 5px;
  margin-top: 5px;
  h4 {
    color: #4b0082;
    font-size: 22px;
    font-weight: 700;
    margin-bottom: 10px;
  }
`;

const Input = styled.input`
  width: 90%;
  max-width: 650px;
  padding: 12px 16px;
  border: 2px solid #d5c4ff;
  border-radius: 10px;
  font-size: 15px;
  outline: none;
  background: #fff;
  transition: all 0.25s ease;
  box-shadow: inset 0 0 0 rgba(0, 0, 0, 0);

  &:focus {
    border-color: #7000d8;
    box-shadow: 0 0 8px rgba(112, 0, 216, 0.3);
  }
`;

const TextareaEdit = styled.textarea`
  width: 90%;
  max-width: 650px;
  height: 130px;
  font-size: 15px;
  padding: 14px;
  border-radius: 10px;
  border: 2px solid #d5c4ff;
  resize: vertical;
  outline: none;
  background: #fff;
  transition: all 0.25s ease;

  &:focus {
    border-color: #7000d8;
    box-shadow: 0 0 8px rgba(112, 0, 216, 0.3);
  }
`;
const SuccessBox = styled.div`
  background-color: #d4edda;
  border: 1px solid #c3e6cb;
  color: #155724;
  border-radius: 8px;
  padding: 10px;
  margin-bottom: 15px;
`;

const BotaoSalvar = styled.button`
  padding: 12px 24px;
  background: linear-gradient(135deg, #7000d8, #b188ff);
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 15px;
  cursor: pointer;
  margin-top: 10px;
  box-shadow: 0 4px 12px rgba(112, 0, 216, 0.4);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 18px rgba(112, 0, 216, 0.5);
  }

  &:active {
    transform: scale(0.98);
  }
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
  preview: {
    display: "flex",
    marginTop: "10px",
    width: "200px",
    height: "200px",
    borderRadius: "50%",
    objectFit: "cover",
    border: "3px solid #00ccff",
  },
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
