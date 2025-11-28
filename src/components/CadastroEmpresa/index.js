import React, { useState } from "react";
import { BsJustify } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
// --- FUNÇÃO AUXILIAR DE CONVERSÃO DE ARQUIVO PARA BASE64 ---
//Converte um objeto File (Imagem/PDF) em uma string Base64 Data URL
const converterParaBase64 = (arquivo) => {
  alert("converterParaBase64");
  return new Promise((resolver, rejeitar) => {
    const leitor = new FileReader();
    leitor.readAsDataURL(arquivo);
    leitor.onload = () => resolver(leitor.result);
    leitor.onerror = (erro) => rejeitar(erro);
  });
};

export default function CadastroUsuario() {
  const [nome, setNome] = useState("");
  const [cpf_cnpj, setCnpj] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [cargo, setCargo] = useState("");
  const [error, setErro] = useState("");
  const [loading, setLoading] = useState(false);
  const [foto, setFoto] = useState(null);

  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  
  const handleVoltar = () => {
    setTimeout(() => {
      navigate("/");
    }, 500);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFoto(URL.createObjectURL(file));
    }
  };

  const execSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setErro("");

    try {
      alert("1");
      alert(foto);
      // 1. Converter arquivos para Base64 antes de enviar
      const imagemBase64 = await converterParaBase64(foto);
      alert(imagemBase64);

      const resposta = await fetch("http://localhost:3000/usuarios/cadastrar", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          nome: nome,
          email: email,
          cpf_cnpj: cpf_cnpj,
          senha: senha,
          cargo: cargo,
          foto: imagemBase64,
        }),
      });

      console.log("Resposta do servidor:", resposta);

      const dados = await resposta.json();
      if (cpf_cnpj.length !== 14) {
        alert("❌| CNPJ inválido. O CNPJ deve conter 14 dígitos.");
        setLoading(false);
        return;
      }
      if (resposta.ok) {
        setSuccess(true);
        setTimeout(() => {
          navigate("/");
        }, 400);
      } else {
        setErro(dados.message || "Erro ao fazer o cadastro. Tente novamente.");
      }
    } catch (e) {
      console.error("Falha ao conectar a API:", e);
      setErro("Não foi possível conectar ao servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.background}>
      <form onSubmit={execSubmit} style={styles.container}>
        <h2 style={styles.title}>CADASTRO</h2>

        {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

        <div style={styles.inputGroup}>
          <label style={styles.label}>Nome da Empresa</label>
          <input
            id="nome"
            name="nome"
            value={nome}
            style={styles.input}
            type="text"
            placeholder="Digite seu Nome..."
            onChange={(e) => setNome(e.target.value)}
            required
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>E-mail</label>
          <input
            id="email"
            name="email"
            value={email}
            style={styles.input}
            type="email"
            placeholder="Digite seu E-mail..."
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>CNPJ</label>
          <input
            id="cpf_cnpj"
            name="cpf_cnpj"
            value={cpf_cnpj}
            style={styles.input}
            type="text"
            placeholder="Digite seu CNPJ..."
            onChange={(e) => setCnpj(e.target.value)}
            required
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Cargo</label>
          <input
            id="cargo"
            name="cargo"
            value={cargo}
            style={styles.input}
            type="text"
            placeholder="Digite seu cargo..."
            onChange={(e) => setCargo(e.target.value)}
            required
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Senha</label>
          <input
            id="senha"
            name="senha"
            value={senha}
            style={styles.input}
            type="password"
            placeholder="Digite sua Senha..."
            onChange={(e) => setSenha(e.target.value)}
            required
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Foto de Perfil</label>
          <input
            type="file"
            accept="image/*"
            // onChange={handleFileChange}
            onChange={(e) => setFoto(e.target.files[0])}
            style={styles.inputFile}
          />
          {foto && (
            <img src={foto} alt="Prévia da foto" style={styles.preview} />
          )}
        </div>

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}
        {success && <SuccessBox>Cadastro realizado com sucesso!</SuccessBox>}
        <Button onClick={execSubmit} disabled={loading}>
          {loading ? "Cadastrando..." : "CADASTRAR-SE"}
        </Button>

        <a style={styles.backLink} onClick={handleVoltar}>
          Voltar
        </a>
      </form>
    </div>
  );
}
const Button = styled.button`
  width: 100%;
  padding: 14px;
  border-radius: 30px;
  background-color: #9100ff;
  color: #fff;
  font-weight: bold;
  font-size: 18px;
  border: none;
  cursor: pointer;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    padding: 12px;
    font-size: 16px;
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
const styles = {
  background: {
    backgroundColor: "#c4caffff",
    minHeight: "100vh",
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundAttachment: "fixed",
    backgroundRepeat: "no-repeat",
  },
  container: {
    width: "420px",
    background: "linear-gradient(to bottom right, #2c2cfc, #1e1e2f)",
    borderRadius: "20px",
    padding: "30px 40px",
    color: "#fff",
    boxShadow: "0 0 10px #00ccff",
    margin: "40px 0", // deixa espaço para respirar caso role
  },
  title: {
    textAlign: "center",
    fontSize: "28px",
    marginBottom: "20px",
  },
  inputGroup: {
    marginBottom: "15px",
  },
  label: {
    display: "block",
    fontWeight: "bold",
    marginBottom: "6px",
  },
  input: {
    width: "100%",
    padding: "10px",
    borderRadius: "25px",
    border: "none",
    outline: "none",
    fontSize: "15px",
  },
  inputFile: {
    width: "100%",
    borderRadius: "20px",
    padding: "10px",
    color: "#ffffffff",
    fontSize: "15px",
  },
  preview: {
    display: "flex",
    marginTop: "10px",
    flexDirection: "column",
    alignItems: "center",
    justifySelf: "center",
    width: "200px",
    height: "200px",
    borderRadius: "50%",
    objectFit: "cover",
    border: "3px solid #00ccff",
  },
  button: {
    width: "100%",
    padding: "12px",
    marginTop: "10px",
    backgroundColor: "#9100ff",
    color: "#fff",
    fontWeight: "bold",
    fontSize: "16px",
    border: "none",
    borderRadius: "30px",
    cursor: "pointer",
  },
  backLink: {
    display: "block",
    textAlign: "center",
    color: "#00ff66",
    textDecoration: "none",
    marginTop: "10px",
    fontSize: "16px",
    cursor: "pointer",
  },
};
