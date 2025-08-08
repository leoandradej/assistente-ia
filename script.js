const apiKey = document.querySelector("#api-key");
const aiModel = document.querySelector("#ai-model");
const errorMessage = document.querySelector(".error-message");
const form = document.querySelector("#form");
const url = "https://api.openai.com/v1/chat/completions";
const question = document.querySelector("#question");
const answer = document.querySelector(".ai-response");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  if (apiKey.value === "") {
    errorMessage.textContent = "Por favor, insira sua chave API";
  }

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
      const response = await fetch(url, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(body),
      });

      if (!response.ok)
        throw new Error(`API request failed: ${response.status}`);

      const data = await response.json();
      answer.textContent = data.choices[0].message.content;
    } catch (error) {
      console.log("Error fetching from ChatGPT API:", error.message);
      answer.textContent =
        "Desculpe, houve um erro processando sua requisição.";
    }

    question.textContent = "";
  };

  getApiResponse(apiKey.value);
});
