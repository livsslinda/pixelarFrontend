import React, { useState } from "react";
import styled from "styled-components";
import fotoLogin from "../../img/Imagem Projeto.png";
import { useNavigate } from "react-router-dom";

const Container = styled.div`
  display: flex;
  height: 100vh;
  font-family: Arial, sans-serif;
  position: relative;
`;

const LeftSide = styled.div`
  flex: 1;
  background-color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const RightSide = styled.div`
  flex: 1;
  background: linear-gradient(to bottom right, #2c2cfc, #1e1e2f);
  color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 50px;
`;
const SuccessBox = styled.div`
  background-color: #d4edda;
  border: 1px solid #c3e6cb;
  color: #155724;
  border-radius: 8px;
  padding: 10px;
  margin-bottom: 15px;
`;

const Title = styled.h2`
  font-size: 32px;
  margin-bottom: 40px;
  align-self: center;
`;

const InputGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  border-radius: 25px;
  border: none;
  font-size: 16px;
  outline: none;
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

const Popup = styled.div`
  background: linear-gradient(135deg, #2c2cfc, #1e1e2f);
  padding: 30px;
  border-radius: 20px;
  width: 90%;
  max-width: 400px;
  color: #fff;
  text-align: center;
  position: relative;
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
