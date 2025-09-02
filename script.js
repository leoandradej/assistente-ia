const apiKey = document.querySelector(".settings__api-key");
const aiModel = document.querySelector(".settings__ai-model");
const errorMessage = document.querySelector(".settings__error-message");
const form = document.querySelector("#question__form");
const formBtn = document.querySelector(".btn");
const textDisplayer = document.querySelector(".text-displayer");
const textDisplayerItems = document.querySelectorAll(".text-displayer__para");
const questionSection = document.querySelector(".question");
const question = document.querySelector(".question__text");
const charCounter = document.querySelector(".question__charCounter");
const userQuestion = document.querySelector(".user-question");
const answer = document.querySelector(".ai-response");
const loader = document.querySelector(".loader");
const newQuestionBtn = document.querySelector(".new-question-btn");
const url = "https://api.openai.com/v1/chat/completions";

const getApiResponse = async (apiKey) => {
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${apiKey}`,
  };

  const body = {
    model: aiModel.value,
    messages: [{ role: "user", content: question.value }],
    temperature: 0.7,
  };

  try {
    questionSection.style.display = "none";
    textDisplayer.style.display = "flex";
    errorMessage.textContent = "";
    if (!loader.classList.contains("active")) {
      loader.textContent = "";
      loader.classList.add("active");
    }
    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(body),
    });

    if (!response.ok) throw new Error(`API request failed: ${response.status}`);

    const data = await response.json();
    loader.style.display = "none";
    textDisplayerItems.forEach((item) => (item.style.display = "block"));
    userQuestion.textContent = question.value;
    answer.textContent = data.choices[0].message.content;
    question.value = "";
  } catch (error) {
    console.log("Error fetching from ChatGPT API:", error.message);
    if (error.message === "API request failed: 401") {
      errorMessage.textContent = "Chave API inválida, tente novamente";
    }
    if (error.message === "API request failed: 429") {
      loader.classList.remove("active");
      loader.textContent =
        "Você excedeu o limite de requisições, por favor tente outro modelo IA.";
    } else {
      answer.textContent =
        "Desculpe, houve um erro processando sua requisição.";
    }
  }
};

question.addEventListener("input", () => {
  charCounter.textContent = `${question.value.length}/500`;
  if (question.value.trim() === "") {
    formBtn.disabled = true;
  } else {
    formBtn.disabled = false;
  }
});

form.addEventListener("submit", (e) => {
  e.preventDefault();

  if (errorMessage.textContent !== "") errorMessage.textContent = "";

  if (apiKey.value === "") {
    errorMessage.textContent = "Por favor, insira sua chave API";
  } else if (apiKey.value.length < 51) {
    errorMessage.textContent =
      "Sua Chave API precisa conter ao menos 51 caracteres";
  } else {
    getApiResponse(apiKey.value);
  }
});

form.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();

    if (question.value === "") return;

    if (apiKey.value === "") {
      errorMessage.textContent = "Por favor, insira sua chave API";
    } else if (apiKey.value.length < 51) {
      errorMessage.textContent =
        "Sua Chave API precisa conter pelo menos 51 caracteres";
    } else {
      getApiResponse(apiKey.value);
    }
  }
});

newQuestionBtn.addEventListener("click", () => {
  questionSection.style.display = "flex";
  textDisplayer.style.display = "none";
  textDisplayerItems.forEach((item) => (item.style.display = "none"));
  loader.style.display = "block";
  question.value = "";
  charCounter.textContent = "0/500";
});
