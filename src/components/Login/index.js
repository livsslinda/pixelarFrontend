import React, { useState } from "react";
import styled from "styled-components";
import fotoLogin from "../../img/Imagem Projeto.png";
import { useNavigate } from "react-router-dom";
const Container = styled.div`
  display: flex;
  height: 100vh;
  font-family: Arial, sans-serif;
  position: relative;

  @media (max-width: 768px) {
    flex-direction: column;
    height: auto;
  }
`;

const LeftSide = styled.div`
  flex: 1;
  background-color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;

  @media (max-width: 768px) {
    width: 100%;
    height: 200px; /* Ajuste a altura da imagem em telas pequenas */
  }
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;

  @media (max-width: 768px) {
    object-fit: contain;
  }
`;

const RightSide = styled.div`
  flex: 1;
  background: linear-gradient(to bottom right, #2c2cfc, #1e1e2f);
  color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 50px;

  @media (max-width: 768px) {
    width: 100%;
    padding: 20px;
  }
`;

const Title = styled.h2`
  font-size: 32px;
  margin-bottom: 40px;
  align-self: center;
  font-weight: 1000;
  font-family: Roboto, sans-serif;

  @media (max-width: 768px) {
    font-size: 28px;
    margin-bottom: 20px;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  border-radius: 25px;
  border: none;
  font-size: 16px;
  outline: none;

  @media (max-width: 768px) {
    padding: 10px;
    font-size: 14px;
  }
`;

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

const Popup = styled.div`
  background: linear-gradient(135deg, #2c2cfc, #1e1e2f);
  padding: 30px;
  border-radius: 20px;
  width: 90%;
  max-width: 400px;
  color: #fff;
  text-align: center;
  position: relative;

  @media (max-width: 768px) {
    padding: 20px;
    max-width: 90%;
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

const InputGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
`;

const Options = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  margin-bottom: 30px;
`;

const Remember = styled.span`
  margin-left: 8px;
  color: #ccc;
`;

const LinkGreen = styled.a`
  color: #00ff99;
  text-decoration: none;
  cursor: pointer;
`;

const Footer = styled.p`
  text-align: center;
  font-size: 14px;
  color: #ccc;
`;

const PopupOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
`;

const Close = styled.span`
  position: absolute;
  top: 10px;
  right: 15px;
  color: #00ff00;
  cursor: pointer;
  font-weight: bold;
`;

const PopupText = styled.p`
  font-size: 20px;
  margin-bottom: 30px;
`;

const PopupButton = styled.button`
  width: 100%;
  padding: 14px;
  border-radius: 30px;
  background-color: #6c00ff;
  color: #fff;
  font-size: 18px;
  border: none;
  cursor: pointer;
  margin-bottom: 20px;
`;

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setErro] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  const handleEmpresaClick = () => {
    localStorage.removeItem("usuarioLogado");
    navigate("/CadastroE");
  };

  const handleUsuarioClick = () => {
    localStorage.removeItem("usuarioLogado");
    navigate("/CadastroU");
  };

  const handleCadastrarClick = () => setShowPopup(true);
  const handleClosePopup = () => setShowPopup(false);

  const execSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setErro("");

    try {
      const resposta = await fetch("http://localhost:3000/usuarios/login", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ email, senha }),
      });

      console.log("Resposta do servidor:", resposta);

      const dados = await resposta.json();

      if (resposta.ok && dados.usuario) {
        setSuccess(true);

        localStorage.setItem(
          "usuarioLogado",
          JSON.stringify({
            ...dados.usuario,
          })
        );

        setTimeout(() => {
          if (dados.usuario.tipo_usuario === "avaliador") {
            navigate("/vagas");
          } else {
            navigate("/vagasU");
          }
        }, 1000);
      } else {
        setErro(dados.message || "Erro ao fazer Login. Tente novamente.");
      }
    } catch (e) {
      console.error("Falha ao conectar a API:", e);
      setErro("Não foi possível conectar ao servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form>
      <Container>
        <LeftSide>
          <Image src={fotoLogin} />
        </LeftSide>

        <RightSide>
          <Title>LOGIN</Title>

          <InputGroup>
            <Label>E-mail</Label>
            <Input
              id="email"
              name="email"
              value={email}
              type="email"
              placeholder="Digite seu E-mail..."
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </InputGroup>

          <InputGroup>
            <Label>Senha</Label>
            <Input
              id="senha"
              name="senha"
              value={senha}
              type="password"
              placeholder="Digite sua Senha..."
              onChange={(e) => setSenha(e.target.value)}
              required
            />
          </InputGroup>

          <Options>
            <label>
              <input type="checkbox" />
              <Remember>Lembrar de Mim</Remember>
            </label>
            <LinkGreen href="#">Esqueceu a Senha?</LinkGreen>
          </Options>
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}
          {success && <SuccessBox>Login bem-sucedido</SuccessBox>}
          <Button onClick={execSubmit} disabled={loading}>
            {loading ? "Entrando..." : "Entrar"}
          </Button>

          <Footer>
            Não Tem Uma Conta?{" "}
            <LinkGreen as="span" onClick={handleCadastrarClick}>
              Cadastrar-se
            </LinkGreen>
          </Footer>
        </RightSide>

        {showPopup && (
          <PopupOverlay>
            <Popup>
              <Close onClick={handleClosePopup}>Fechar</Close>
              <PopupText>
                Antes de fazer o cadastro, nos diga o que você é!
              </PopupText>
              <PopupButton onClick={handleEmpresaClick}>
                Sou uma empresa
              </PopupButton>
              <PopupButton onClick={handleUsuarioClick}>
                Sou um estagiário
              </PopupButton>
            </Popup>
          </PopupOverlay>
        )}
      </Container>
    </form>
  );
}
