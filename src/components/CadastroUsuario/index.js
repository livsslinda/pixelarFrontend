import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

// --- FUNÇÃO AUXILIAR DE CONVERSÃO DE ARQUIVO PARA BASE64 ---
const converterParaBase64 = (arquivo) => {
  return new Promise((resolver, rejeitar) => {
    const leitor = new FileReader();
    leitor.readAsDataURL(arquivo);
    leitor.onload = () => resolver(leitor.result);
    leitor.onerror = (erro) => rejeitar(erro);
  });
};

export default function CadastroUsuario() {
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [cargo, setCargo] = useState("");
  const [foto, setFoto] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  const handleVoltar = () => {
    navigate("/");
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFoto(file);
    }
  };

  const execSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    if (cpf.length !== 11) {
      alert("❌| CPF inválido. O CPF deve conter 11 dígitos.");
      setLoading(false);
      return;
    }

    try {
      let fotoBase64 = null;
      if (foto) {
        fotoBase64 = await converterParaBase64(foto);
      }

      const resposta = await fetch("http://localhost:3000/usuarios/cadastrar", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          nome,
          email,
          cpf_cnpj: cpf,
          senha,
          cargo,
          foto: fotoBase64,
        }),
      });

      const dados = await resposta.json();

      if (resposta.ok) {
        setSuccess(true);
        setTimeout(() => {
          navigate("/");
        }, 1000);
      } else {
        setError(dados.message || "Erro ao fazer o cadastro. Tente novamente.");
      }
    } catch (e) {
      console.error("Falha ao conectar a API:", e);
      setError("Não foi possível conectar ao servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.background}>
      <form onSubmit={execSubmit} style={styles.container}>
        <h2 style={styles.title}>CADASTRO DE USUÁRIO</h2>

        {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
        {success && <SuccessBox>Cadastro realizado com sucesso!</SuccessBox>}

        <div style={styles.inputGroup}>
          <label style={styles.label}>Nome</label>
          <input
            value={nome}
            style={styles.input}
            type="text"
            placeholder="Digite seu nome..."
            onChange={(e) => setNome(e.target.value)}
            required
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>E-mail</label>
          <input
            value={email}
            style={styles.input}
            type="email"
            placeholder="Digite seu e-mail..."
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>CPF</label>
          <input
            value={cpf}
            style={styles.input}
            type="text"
            placeholder="Digite seu CPF..."
            onChange={(e) => setCpf(e.target.value)}
            required
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Cargo</label>
          <input
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
            value={senha}
            style={styles.input}
            type="password"
            placeholder="Digite sua senha..."
            onChange={(e) => setSenha(e.target.value)}
            required
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Foto de Perfil</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={styles.inputFile}
          />
          {foto && (
            <img
              src={URL.createObjectURL(foto)}
              alt="Prévia"
              style={styles.preview}
            />
          )}
        </div>

        <Button type="submit" disabled={loading}>
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
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: "420px",
    background: "linear-gradient(to bottom right, #2c2cfc, #1e1e2f)",
    borderRadius: "20px",
    padding: "30px 40px",
    color: "#fff",
    boxShadow: "0 0 10px #00ccff",
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
    fontSize: "15px",
  },
  preview: {
    display: "flex",
    marginTop: "10px",
    width: "200px",
    height: "200px",
    borderRadius: "50%",
    objectFit: "cover",
    border: "3px solid #00ccff",
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
