import Logo from "../../../img/logo.png";
import { useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { useState, useEffect } from "react";
import PillNav from "../../componentesMenu/PillNav";
import Dock from "../../componentesMenu/Dock";
import { FiLogOut } from "react-icons/fi";
import { VscAccount } from "react-icons/vsc";
const ContainerChat = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr; /* empresas (1/3) | chat (2/3) */
  gap: 16px;
  margin-top: 12px;
  height: 400px; /* ajusta conforme layout */
`;

const ListaEmpresas = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  background-color: #6a00ff;
  border-radius: 8px;
  padding: 12px;
  overflow-y: auto;
`;

const EmpresaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  border-radius: 6px;
  cursor: pointer;
  background-color: #ab9df8;
  transition: background 0.2s;
  font-weight: bold;

  &:hover {
    background: #e0e0e0;
  }
`;

const ChatWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: #6a00ff;
  border-radius: 8px;
  padding: 12px;
  width: 80%;
`;

const ChatBox = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
  overflow-y: auto;
  margin-bottom: 12px;
`;

const Mensagem = styled.div`
  align-self: ${(props) => (props.enviada ? "flex-end" : "flex-start")};
  background: ${(props) => (props.enviada ? "#ffffffff" : "#e0e0e0")};
  color: ${(props) => (props.enviada ? "#000000ff" : "#000")};
  padding: 8px 12px;
  border-radius: 12px;
  max-width: 70%;
`;

const InputMensagem = styled.input`
  border: 1px solid #ccc;
  border-radius: 6px;
  padding: 8px;
  outline: none;
  width: 90%;
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

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

const SubMenu = styled.div`
  background-color: #d1c4ff;
  display: flex;
  padding: 10px 30px;
  font-weight: bold;
  font-size: 18px;
  justify-self: center;
  border-radius: 60px;
  margin-top: 60px;
`;

const Aba = styled.div`
  margin-right: 20px;
  cursor: pointer;
  color: ${(props) => (props.ativo ? "#000" : "#555")};
`;

const Conteudo = styled.div`
  padding: 5px 20px;
  animation: ${fadeIn} 0.5s ease;
`;
const DockWrapper = styled.div`
  position: fixed;
  bottom: 0;
  width: 100%;
`;
const BarraNav = styled.div`
  background-color: rgba(112, 0, 216, 0);
  display: flex;
  align-items: center;
  padding: 10px 30px;
  justify-content: center;
`;

const GridCandidaturas = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 40px;
  background-color: #ab9df8;
  padding: 30px;
  animation: ${fadeIn} 0.5s ease;
`;

const CardCandidatura = styled.div`
  background-color: #8a00ff;
  color: white;
  padding: 15px;
  border-radius: 15px;
  min-height: 120px;
`;
const TituloVaga = styled.h1`
  font-size: 20px;
`;

const TriagemLayout = styled.div`
  gap: 30px;
  animation: ${fadeIn} 0.5s ease;
  margin-top: 20px;
`;

const Coluna1 = styled.div`
  background-color: #cdbbff;
  padding: 10px;
  border-radius: 5px;
  width: 95%;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  flex-direction: column;
  justify-self: center;
`;
const Coluna = styled.div`
  background-color: #cdbbff;
  padding: 10px;

  width: 80%;
`;

const TituloSecao = styled.h2`
  font-size: 20px;
  margin-bottom: 5px;
  margin-top: 5px;
`;

const GridJornadas = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
`;

const CardJornada = styled.div`
  background-color: #8a00ff;
  color: white;
  padding: 10px;
  border-radius: 12px;
  text-align: center;
  width: 30vw;
`;

const BotaoTarefa = styled.button`
  margin-top: 8px;
  padding: 5px 10px;
  background-color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
`;

const AvatarEmpresa = styled.img`
  width: 35px;
  height: 35px;
  border-radius: 50%;
`;
export default function CandidaturaUsuario() {
  const navigate = useNavigate();
  const [abaAtiva, setAbaAtiva] = useState("vagas");

  const [vagas, setVagas] = useState([]);
  const [candidaturas, setCandidaturas] = useState([]);
  const [erro, setErro] = useState(null);
  const [loading, setLoading] = useState(true);

  const [maiorSalarioDisponivel, setMaiorSalarioDisponivel] = useState(0); // Valor inicial pode ser 0
  const [salarioMaximo, setSalarioMaximo] = useState(0); // Valor inicial pode ser 0
  const [setores, setSetores] = useState([]); // Valor inicial deve ser um array vazio
  const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));

  const handleCandidaturas = () => {
    navigate("/candidaturaUsuario");
  };

  const handleRelatorios = () => {
    navigate("/relatorios");
  };

  useEffect(() => {
    const fetchVagas = async () => {
      try {
        if (!usuario) {
          navigate("/");
          return null;
        }
        const resposta = await fetch(`http://localhost:3000/candidaturas/listarPorUsuario/${usuario.id}`);
        if (!resposta.ok) throw new Error("Erro ao buscar vagas");
        const dados = await resposta.json();
        const vagasComEmpresa = await Promise.all(
          dados.map(async (vaga) => {
            const resUsuario = await fetch(
              `http://localhost:3000/candidaturas/listarPorUsuario/${usuario.id}`
            );
            // console.log(dados);

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

  // Adicione este novo useEffect ao componente:

  useEffect(() => {
    const fetchCandidaturas = async () => {
      if (!usuario || !usuario.id) {
        return;
      }

      try {
        const resposta = await fetch(
          `http://localhost:3000/candidaturas/listarPorUsuario/${usuario.id}`
        );
        if (!resposta.ok) {
          throw new Error("Erro ao buscar candidaturas.");
        }
        let dadosCandidaturas = await resposta.json();

        // Você pode precisar buscar o nome da vaga/empresa para cada candidatura,
        // assim como fez com as vagas
        const candidaturasComDetalhes = await Promise.all(
          dadosCandidaturas.map(async (candidatura) => {
            const resVaga = await fetch(
              `http://localhost:3000/vagas/listar/${candidatura.id_vaga}`
            );
            console.log(resVaga);
            
            if (!resVaga.ok) {
              return { ...candidatura, titulo_vaga: "Vaga Desconhecida" };
            }
            const vagaDados = await resVaga.json();
            return { ...candidatura, titulo_vaga: vagaDados.titulo };
          })
        );

        setCandidaturas(candidaturasComDetalhes);
      } catch (error) {
        console.error("Erro ao buscar candidaturas:", error);
        setErro("Erro ao carregar candidaturas.");
      }
    };

    fetchCandidaturas();
  }, [usuario]); // Depende do objeto 'usuario'

  const handleVagas = () => {
    navigate("/vagasU");
  };
  const handleLogout = () => {
    localStorage.removeItem("usuarioLogado");
    navigate("/");
  };
  const handlePerfil = () => {
    navigate("/perfilU");
  };

  if (!usuario) {
    navigate("/");
    return null;
  }
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
      <BarraNav>
        <PillNav
          logo={Logo}
          logoAlt="Company Logo"
          items={[
            { label: "Home", href: "/vagasU" },
            { label: "Candidaturas", href: "/candidaturaUsuario" },
          ]}
          activeHref="/candidaturaUsuario"
          className="custom-nav"
          ease="power2.easeOut"
          baseColor="#7000d8"
          pillColor="#ffffff"
          hoveredPillTextColor="#ffffff"
          pillTextColor="#000000"
        />
      </BarraNav>

      <SubMenu>
        <Aba ativo={abaAtiva === "vagas"} onClick={() => setAbaAtiva("vagas")}>
          Vagas Selecionadas
        </Aba>
        <Aba
          ativo={abaAtiva === "triagem"}
          onClick={() => setAbaAtiva("triagem")}
        >
          Triagem
        </Aba>
      </SubMenu>

      <Conteudo>
        {abaAtiva === "vagas" ? (
          <>
            <TituloSecao>Candidaturas:</TituloSecao>
            {/* Exibe mensagem de erro ou de carregamento */}
            {erro && <p style={{ color: "red" }}>{erro}</p>}
            {candidaturas.length === 0 && !erro ? (
              <p>Nenhuma candidatura encontrada.</p>
            ) : (
              <GridCandidaturas>
                {candidaturas.map((candidatura) => (
                  <CardCandidatura key={candidatura.id_candidatura}>
                    <TituloVaga>
                      {candidatura.titulo_vaga || "Vaga Desconhecida"}
                    </TituloVaga>
                    <p>
                      <strong>Data de início:</strong>{" "}
                      {new Date(
                        candidatura.data_candidatura
                      ).toLocaleDateString()}
                    </p>
                    <p>
                      <strong>Status:</strong> {candidatura.status_candidatura}
                    </p>
                    <p>
                      <strong>Pontuação:</strong>{" "}
                      {candidatura.pontuacao_candidatura || "N/A"}
                    </p>
                    {/* O nome da empresa precisaria ser buscado no useEffect, assim como o titulo_vaga. 
                  Se você tiver o ID da empresa no objeto candidatura (id_empresa) ou na vaga 
                  (vagaDados.nome_empresa), use-o aqui. Por enquanto, vou manter o XXXX como placeholder. 
              */}
                    <p>
                      <strong>Empresa:</strong> XXXX
                    </p>
                  </CardCandidatura>
                ))}
              </GridCandidaturas>
            )}
          </>
        ) : (
          <TriagemLayout>
            <Coluna1>
              <TituloSecao>Jornadas:</TituloSecao>
              <GridJornadas>
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <CardJornada key={i}>
                    Vaga xxxx
                    <br />
                    <BotaoTarefa>Tarefa</BotaoTarefa>
                  </CardJornada>
                ))}
              </GridJornadas>
            </Coluna1>
          </TriagemLayout>
        )}
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
