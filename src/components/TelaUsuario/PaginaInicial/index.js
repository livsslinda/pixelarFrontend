import React, { useEffect, useState } from "react";
import Logo from "../../../img/logo.png";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import { FiLogOut } from "react-icons/fi";
import { VscAccount } from "react-icons/vsc";
import Dock from "../../componentesMenu/Dock";
import PillNav from "../../componentesMenu/PillNav";
import { FaBullseye } from "react-icons/fa";
export default function VagasUsuario() {
  const [vagas, setVagas] = useState([]);
  const [erro, setErro] = useState(null);
  const [animando, setAnimando] = useState(false);
  const [success, setSucess] = useState(false);
  const [loading, setLoading] = useState(true);
  //y
  const [setores, setSetores] = useState([]);
  const [setorSelecionado, setSetorSelecionado] = useState("");
  const [salarioMaximo, setSalarioMaximo] = useState(0);
  const [maiorSalarioDisponivel, setMaiorSalarioDisponivel] = useState(0);
  const [buscaTitulo, setBuscaTitulo] = useState("");

  //
  const navigate = useNavigate();

  //
  const vagasFiltradas = vagas.filter((v) => {
    const tituloValido = v.titulo
      .toLowerCase()
      .includes(buscaTitulo.toLowerCase());
    const salarioValido = !salarioMaximo || Number(v.salario) <= salarioMaximo;
    const setorValido = !setorSelecionado || v.setor === setorSelecionado;
    return tituloValido && salarioValido && setorValido;
  });
  //

  const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));

  useEffect(() => {
    const fetchVagas = async () => {
      try {
        if (!usuario) {
          navigate("/");
          return null;
        }
        const resposta = await fetch(`http://localhost:3000/vagas/listarTodas`);
        if (!resposta.ok) throw new Error("Erro ao buscar vagas");
        const dados = await resposta.json();
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
        console.log("Empresa da vaga:", vagas.nome_empresa);
        setVagas(vagasComEmpresa);
        const maiorSalario = Math.max(
          ...vagasComEmpresa.map((v) => Number(v.salario) || 0)
        );
        setMaiorSalarioDisponivel(maiorSalario);
        setSalarioMaximo(maiorSalario);
        const setoresUnicos = [...new Set(vagasComEmpresa.map((v) => v.setor))];
        setSetores(setoresUnicos);
        //
      } catch (error) {
        setErro("Erro ao buscar vagas.");
      } finally {
        setLoading(false);
      }
    };
    fetchVagas();
  }, []);

  const handleInscrever = async (id_vaga, event) => {
    event.preventDefault();
    setLoading(true);
    setErro("");
    try {
      const respostaCurriculo = await fetch(
        `http://localhost:3000/curriculos/buscarPorUsuario/${usuario.id}`
      );
      const id_curriculo = respostaCurriculo.id_curriculo;
      if (!respostaCurriculo.ok) {
        setErro("Erro: Currículo não encontrado para este usuário.");
        return;
      }

      const curriculo = await respostaCurriculo.json();

      console.log("Resposta do servidor:", curriculo);
      const resposta = await fetch(`http://localhost:3000/candidaturas/criar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_vaga: id_vaga,
          id_curriculo: curriculo.id_curriculo,
        }),
      });
      console.log(id_vaga + " " + curriculo.id_curriculo);

      const dados = await resposta.json();
      console.log(dados.id_curriculo);
      if (!resposta.ok) {
        setErro(`Erro: ${dados.mensagem || " Falha ao se inscrever."}`);
        return;
      }
      setSucess(true);
      console.log("Inscrição realizada com sucesso!");
    } catch (error) {
      console.error("Erro ao se inscrever:", error);
      setErro("Não foi possível conectar ao servidor.");
    } finally {
      setLoading(false);
    }
  };

  const handleCandidaturas = () => navigate("/candidaturaUsuario");
  const handleRelatorios = () => navigate("/relatorios");
  const handlePerfil = () => navigate("/perfilU");
  const handleLogout = () => {
    localStorage.removeItem("usuarioLogado");
    setTimeout(() => navigate("/"), 500);
  };
  useEffect(() => {
    setAnimando(true);
    const timer = setTimeout(() => setAnimando(false), 400); // duração da animação
    return () => clearTimeout(timer);
  }, [setorSelecionado, salarioMaximo, buscaTitulo]);
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
            { label: "Candidaturas", href: "/candidaturaUsuario" },
          ]}
          activeHref="/vagasU"
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
        <BarraLateral>
          <TituloSidebar>Filtrar</TituloSidebar>
          <Entrada
            type="text"
            placeholder="🔍 Pesquisar vaga"
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

          <Rotulo>Salário R$ {salarioMaximo > 0 ? salarioMaximo : ""}</Rotulo>
          <ControleDeslizante
            type="range"
            min="0"
            max={maiorSalarioDisponivel}
            step="100"
            value={salarioMaximo}
            onChange={(e) => setSalarioMaximo(Number(e.target.value))}
          />
        </BarraLateral>

        <ListaVagas className={animando ? "animando" : ""}>
          {loading && <p>Carregando vagas...</p>}
          {erro && <p>{erro}</p>}
          {!loading && vagas.length === 0 && <p>Nenhuma vaga encontrada.</p>}

          {vagasFiltradas.map((vaga) => (
            <CartaoVaga key={vaga.id_vaga}>
              <TituloVaga>{vaga.titulo}</TituloVaga>
              <DescricaoVaga>{vaga.descricao}</DescricaoVaga>
              <p>
                <b>Empresa:</b> {vaga.nome_empresa}
              </p>
              <CaixaSalario>R$ {vaga.salario}</CaixaSalario>

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
                          <p>
                            <b>Salário:</b>{" "}
                            {vaga.salario === "A combinar"
                              ? "A combinar"
                              : `R$ ${vaga.salario}`}
                          </p>
                        </p>
                        <p>
                          <b>Empresa:</b> {vaga.nome_empresa}
                        </p>
                      </div>

                      {erro && (
                        <div className="alert alert-danger" role="alert">
                          {erro}
                        </div>
                      )}
                      {success && (
                        <SuccessBox>Inscrição bem-sucedida</SuccessBox>
                      )}
                      <BotaoSalvar
                        onClick={(e) => handleInscrever(vaga.id_vaga, e)}
                        disabled={loading}
                      >
                                               {" "}
                        {loading ? "Inscrevendo.." : "Inscrever-se"}           
                                 {" "}
                      </BotaoSalvar>
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

/* ---------- ESTILOS ---------- */
const PaginaContainer = styled.div`
  font-family: Arial, sans-serif;
  background-color: #efefff;
  min-height: 100vh;
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
const SuccessBox = styled.div`
  background-color: #d4edda;
  border: 1px solid #c3e6cb;
  color: #155724;
  border-radius: 8px;
  padding: 10px;
  margin-bottom: 15px;
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
const BarraNav = styled.div`
  background-color: rgba(112, 0, 216, 0);
  display: flex;
  align-items: center;
  padding: 10px 30px;
  justify-content: center;
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
  margin-top: 40px;
`;

const BarraLateral = styled.div`
  width: 200px;
  background-color: #c0b4ff;
  padding: 20px;
  border-radius: 10px;
  border: 1px solid #3891ff;
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
  transition: opacity 0.4s ease, transform 0.4s ease;

  &.animando {
    opacity: 0;
    transform: scale(0.98);
  }
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

const BotaoDetalhes = styled.button`
  margin-top: 10px;
  padding: 6px 12px;
  border-radius: 6px;
  border: 1px solid #000;
  background-color: #fff;
  cursor: pointer;
`;

const BotaoInscrever = styled.button`
  border-radius: 15px;
  border: 0;
  font-size: 18px;
  padding: 10px 25px;
  background-color: #b783ff;
  color: white;
  cursor: pointer;
  margin-top: 10px;
`;

const DockWrapper = styled.div`
  position: fixed;
  bottom: 0;
  width: 100%;
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
};
