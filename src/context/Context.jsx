import { createContext, useState } from "react";
import runChat from "../config/gemini";
import getPythonData from "../config/api_python";

export const Context = createContext();

const ContextProvider = (props) => {
  const [input, setInput] = useState("");
  const [recentPrompt, setRecentPrompt] = useState("");
  const [prevPrompts, setPrevPrompts] = useState([]); // Nota: Este estado não está sendo usado.
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState("");

  // NOVO: Função auxiliar para formatar a resposta. Evita repetição.
  const formatResponse = (response) => {
    // Verifica se a resposta não é nula ou indefinida antes de processar
    if (!response) return "Não foi possível obter uma resposta.";

    const responseArray = response.split("**");
    let formattedResponse = "";
    for (let i = 0; i < responseArray.length; i++) {
      if (i === 0 || i % 2 === 0) {
        formattedResponse += responseArray[i];
      } else {
        formattedResponse += "<b>" + responseArray[i] + "</b>";
      }
    }
    return formattedResponse.replace(/\n/g, "<br />");
  };

  // ALTERADO: Função de envio genérica para tratar ambas as chamadas de API.
  const sendMessage = async (apiFunction) => {
    // Não precisamos do parâmetro 'prompt', pois usamos o estado 'input'.
    setLoading(true);
    setShowResult(true);
    setRecentPrompt(input);
    setResultData(""); // Limpa o resultado anterior enquanto carrega

    try {
      const response = await apiFunction(input);
      const formattedText = formatResponse(response);
      setResultData(formattedText);
    } catch (error) {
      console.error("Falha na chamada da API:", error);
      setResultData("Ocorreu um erro ao buscar a resposta. Tente novamente."); // Mensagem de erro para o usuário
    } finally {
      // O bloco 'finally' sempre executa, garantindo que o loading termine.
      setLoading(false);
      setInput("");
    }
  };

  // As funções exportadas agora são mais simples e apenas chamam a função genérica.
  const onSent = () => sendMessage(runChat);
  const onSentApi = () => sendMessage(getPythonData);
  
  // MELHORADO: A função newChat agora limpa mais estados para um recomeço completo.
  const newChat = () => {
    setLoading(false);
    setShowResult(false);
    setInput("");
    setRecentPrompt("");
  };

  const contextValue = {
    prevPrompts,
    setPrevPrompts,
    onSent,
    onSentApi, // Mantemos os mesmos nomes para não quebrar outros componentes
    recentPrompt,
    setRecentPrompt,
    showResult,
    loading,
    resultData,
    input,
    setInput,
    newChat,
  };

  return (
    <Context.Provider value={contextValue}>{props.children}</Context.Provider>
  );
};

export default ContextProvider;