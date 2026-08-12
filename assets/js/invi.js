(() => {
  "use strict";

  const widget = document.querySelector(".invi-widget");
  if (!widget) return;

  const launcher = widget.querySelector(".invi-launcher");
  const chat = widget.querySelector(".invi-chat");
  const closeButton = widget.querySelector(".invi-close");
  const expandButton = widget.querySelector(".invi-expand");
  const form = widget.querySelector(".invi-form");
  const input = widget.querySelector(".invi-input");
  const sendButton = widget.querySelector(".invi-send");
  const messages = widget.querySelector(".invi-messages");
  const quickActions = widget.querySelectorAll(".invi-quick-action");

  if (
    !launcher ||
    !chat ||
    !closeButton ||
    !form ||
    !input ||
    !sendButton ||
    !messages
  ) {
    console.error("INVI: faltan elementos obligatorios en el HTML.");
    return;
  }

  const STORAGE_KEY = "invi-chat-history-v3";
  const MAX_HISTORY = 24;
  const API_TIMEOUT = 30000;
  const MIN_TYPING_TIME = 650;
  const TYPEWRITER_SPEED = 12;

  let conversation = [];
  let isResponding = false;

  const siteInfo = {
    agsei:
      "AGS:EI, Aguascalientes: Entidad Inteligente, es una iniciativa orientada a impulsar la innovación, la tecnología y la colaboración para contribuir al desarrollo de un entorno más inteligente.",

    investel:
      "INVESTEL desarrolla e investiga soluciones relacionadas con ciencia, tecnología e innovación. INVI está diseñado para orientar a los visitantes sobre la información disponible en este sitio.",

    servicios:
      "En AGS:EI e INVESTEL se desarrollan iniciativas y soluciones relacionadas con innovación, transformación digital, análisis de datos, vinculación académica y desarrollo tecnológico.",

    proyectos:
      "La plataforma presenta proyectos e iniciativas relacionados con transformación digital, movilidad, datos ciudadanos, innovación, educación y vinculación académica.",

    contacto:
      "Puedes comunicarte con AGS:EI e INVESTEL al teléfono +52 449 155 1806 o mediante el correo ags.ei2030@gmail.com.",

    ubicacion:
      "La información disponible sobre la ubicación se encuentra en la sección de contacto del sitio. Puedo llevarte a esa sección.",

    horario:
      "Por el momento no cuento con un horario oficial confirmado. Te recomiendo comunicarte al +52 449 155 1806 o al correo ags.ei2030@gmail.com.",

    innovacion:
      "AGS:EI promueve la innovación mediante tecnología, colaboración, análisis de datos y proyectos orientados a mejorar el entorno urbano, educativo y social.",

    vinculacion:
      "La vinculación académica busca conectar instituciones educativas, estudiantes, investigadores y organizaciones para desarrollar proyectos de innovación, ciencia y tecnología.",

    clubes:
      "Los clubes de ciencia fomentan la participación, el aprendizaje y el desarrollo de proyectos científicos y tecnológicos.",

    ayuda:
      "Puedo ayudarte con información sobre AGS:EI, INVESTEL, servicios, proyectos, innovación, vinculación académica, clubes de ciencia, ubicación y contacto."
  };

  function setOpen(open) {
    widget.classList.toggle("is-open", open);
    launcher.setAttribute("aria-expanded", String(open));
    chat.setAttribute("aria-hidden", String(!open));

    if (open) {
      window.setTimeout(() => input.focus(), 180);
    }
  }

  function resetExpandedState() {
    widget.classList.remove("is-expanded");

    if (expandButton) {
      expandButton.innerHTML =
        '<i class="bi bi-arrows-fullscreen"></i>';

      expandButton.setAttribute(
        "aria-label",
        "Expandir chat"
      );

      expandButton.setAttribute(
        "title",
        "Expandir chat"
      );
    }
  }

  function scrollToLatest() {
    window.requestAnimationFrame(() => {
      messages.scrollTop = messages.scrollHeight;
    });
  }

  function saveHistory() {
    try {
      sessionStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(conversation.slice(-MAX_HISTORY))
      );
    } catch (error) {
      console.warn("INVI no pudo guardar el historial:", error);
    }
  }

  function createMessageElement(type = "bot") {
    const message = document.createElement("div");
    message.className = `invi-message ${type}`;
    messages.appendChild(message);
    scrollToLatest();
    return message;
  }

  function addMessage(text, type = "bot", save = true) {
    const message = createMessageElement(type);
    message.textContent = text;

    if (save) {
      conversation.push({ type, text });
      conversation = conversation.slice(-MAX_HISTORY);
      saveHistory();
    }

    scrollToLatest();
    return message;
  }

  async function addTypedMessage(text, type = "bot", save = true) {
    const message = createMessageElement(type);

    const speed =
      text.length > 500
        ? 2
        : text.length > 250
          ? 5
          : TYPEWRITER_SPEED;

    for (let index = 0; index < text.length; index += 1) {
      message.textContent += text[index];

      if (index % 4 === 0) {
        scrollToLatest();
      }

      await new Promise((resolve) => {
        window.setTimeout(resolve, speed);
      });
    }

    if (save) {
      conversation.push({ type, text });
      conversation = conversation.slice(-MAX_HISTORY);
      saveHistory();
    }

    scrollToLatest();
    return message;
  }

  function loadHistory() {
    try {
      const saved = JSON.parse(
        sessionStorage.getItem(STORAGE_KEY) || "[]"
      );

      if (!Array.isArray(saved) || saved.length === 0) {
        return;
      }

      messages.innerHTML = "";

      conversation = saved
        .filter(
          (item) =>
            item &&
            typeof item.text === "string" &&
            (item.type === "user" || item.type === "bot")
        )
        .slice(-MAX_HISTORY);

      conversation.forEach((item) => {
        addMessage(item.text, item.type, false);
      });
    } catch (error) {
      console.warn("INVI no pudo recuperar el historial:", error);
      conversation = [];
    }
  }

  function clearConversation() {
    if (isResponding) return;

    conversation = [];

    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.warn("INVI no pudo eliminar el historial:", error);
    }

    messages.innerHTML = "";

    addMessage(
      "¡Hola! Soy INVI, el asistente virtual de AGS:EI e INVESTEL. ¿En qué puedo orientarte?",
      "bot"
    );

    input.focus();
  }

  function createClearButton() {
    const header =
      widget.querySelector(".invi-header") ||
      closeButton.parentElement;

    if (!header || widget.querySelector(".invi-clear")) {
      return;
    }

    const clearButton = document.createElement("button");
    clearButton.type = "button";
    clearButton.className = "invi-clear";
    clearButton.setAttribute(
      "aria-label",
      "Limpiar conversación"
    );
    clearButton.setAttribute(
      "title",
      "Limpiar conversación"
    );
    clearButton.textContent = "↻";

    clearButton.addEventListener(
      "click",
      clearConversation
    );

    header.insertBefore(clearButton, closeButton);
  }

  function normalize(text) {
    return text
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }

  function showTyping() {
    const typing = document.createElement("div");
    typing.className = "invi-message bot invi-typing";
    typing.setAttribute(
      "aria-label",
      "INVI está escribiendo"
    );

    typing.innerHTML = `
      <span class="invi-typing-label">
        INVI está escribiendo
      </span>

      <span
        class="invi-typing-dots"
        aria-hidden="true"
      >
        <span></span>
        <span></span>
        <span></span>
      </span>
    `;

    messages.appendChild(typing);
    scrollToLatest();

    return typing;
  }

  function setLoading(loading) {
    isResponding = loading;
    input.disabled = loading;
    sendButton.disabled = loading;
    widget.classList.toggle(
      "is-thinking",
      loading
    );

    if (!loading) {
      input.focus();
    }
  }

  function navigateTo(selector) {
    window.setTimeout(() => {
      const target =
        document.querySelector(selector);

      if (!target) {
        console.info(
          `INVI no encontró la sección con el selector: ${selector}`
        );
        return;
      }

      target.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });

      target.classList.add(
        "invi-highlight"
      );

      window.setTimeout(() => {
        target.classList.remove(
          "invi-highlight"
        );
      }, 1800);
    }, 500);
  }

  function processNavigation(text) {
    const normalized = normalize(text);

    const routes = [
      {
        words: [
          "contacto",
          "correo",
          "telefono",
          "celular",
          "direccion"
        ],
        selectors: [
          "#contact",
          "#contacto",
          ".contact"
        ]
      },
      {
        words: [
          "servicio",
          "servicios"
        ],
        selectors: [
          "#services",
          "#servicios",
          ".services"
        ]
      },
      {
        words: [
          "noticia",
          "noticias"
        ],
        selectors: [
          "#news",
          "#noticias",
          ".news"
        ]
      },
      {
        words: [
          "proyecto",
          "proyectos",
          "iniciativa"
        ],
        selectors: [
          "#projects",
          "#proyectos",
          ".projects"
        ]
      },
      {
        words: [
          "inicio",
          "principal"
        ],
        selectors: [
          "#inicio",
          "#home",
          "body"
        ]
      }
    ];

    const route = routes.find((item) =>
      item.words.some((word) =>
        normalized.includes(word)
      )
    );

    if (!route) return;

    const validSelector =
      route.selectors.find((selector) => {
        try {
          return Boolean(
            document.querySelector(selector)
          );
        } catch {
          return false;
        }
      });

    if (validSelector) {
      navigateTo(validSelector);
    }
  }

  function getLocalResponse(text) {
    const normalized = normalize(text);

    if (
      /^(hola|buenas|hey|holi|que tal|buen dia|buenas tardes|buenas noches)\b/.test(
        normalized
      )
    ) {
      return "¡Hola! Soy INVI. Puedo orientarte sobre AGS:EI, INVESTEL, servicios, proyectos, innovación y contacto.";
    }

    if (normalized.includes("gracias")) {
      return "¡Con gusto! ¿Hay algo más en lo que pueda orientarte?";
    }

    if (
      /\b(adios|hasta luego|nos vemos|bye)\b/.test(
        normalized
      )
    ) {
      return "¡Hasta luego! Aquí estaré cuando necesites más información.";
    }

    if (
      normalized.includes("quien eres") ||
      normalized.includes("tu nombre")
    ) {
      return "Soy INVI, el asistente virtual de AGS:EI e INVESTEL. Mi función es orientar a los visitantes dentro de la plataforma web.";
    }

    if (
      normalized.includes("que es ags") ||
      normalized.includes("ags:ei") ||
      normalized.includes("agsei")
    ) {
      return siteInfo.agsei;
    }

    if (
      normalized.includes("investel")
    ) {
      return siteInfo.investel;
    }

    if (
      normalized.includes("servicio")
    ) {
      processNavigation(text);
      return `${siteInfo.servicios} Te llevaré a la sección de servicios.`;
    }

    if (
      normalized.includes("proyecto") ||
      normalized.includes("iniciativa")
    ) {
      processNavigation(text);
      return siteInfo.proyectos;
    }

    if (
      normalized.includes("contact") ||
      normalized.includes("correo") ||
      normalized.includes("telefono") ||
      normalized.includes("celular")
    ) {
      processNavigation(text);
      return siteInfo.contacto;
    }

    if (
      normalized.includes("ubicacion") ||
      normalized.includes("direccion") ||
      normalized.includes("donde estan")
    ) {
      processNavigation(text);
      return siteInfo.ubicacion;
    }

    if (
      normalized.includes("horario") ||
      normalized.includes("hora de atencion")
    ) {
      return siteInfo.horario;
    }

    if (
      normalized.includes("innovacion") ||
      normalized.includes("tecnologia")
    ) {
      return siteInfo.innovacion;
    }

    if (
      normalized.includes("vinculacion") ||
      normalized.includes("academica") ||
      normalized.includes("universidad")
    ) {
      return siteInfo.vinculacion;
    }

    if (
      normalized.includes("club") ||
      normalized.includes("ciencia")
    ) {
      return siteInfo.clubes;
    }

    if (
      normalized.includes("ayuda") ||
      normalized.includes("que puedes hacer") ||
      normalized.includes("opciones")
    ) {
      return siteInfo.ayuda;
    }

    return "No pude consultar la inteligencia artificial en este momento y tampoco cuento con una respuesta local confirmada para esa pregunta. Puedes preguntarme sobre AGS:EI, INVESTEL, servicios, proyectos, innovación, vinculación, clubes de ciencia, ubicación o contacto.";
  }

  function getHistoryForServer() {
    const historyWithoutCurrentMessage =
      conversation.at(-1)?.type === "user"
        ? conversation.slice(0, -1)
        : conversation;

    return historyWithoutCurrentMessage.slice(-12);
  }

  async function askGemini(text) {
    const controller =
      new AbortController();

    const timeout =
      window.setTimeout(() => {
        controller.abort();
      }, API_TIMEOUT);

    try {
      const response =
        await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json"
          },
          signal: controller.signal,
          body: JSON.stringify({
            message: text,
            history:
              getHistoryForServer(),
            page: {
              title:
                document.title,
              path:
                window.location.pathname
            }
          })
        });

      const data =
        await response
          .json()
          .catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.error ||
          `Error del servidor: ${response.status}`
        );
      }

      if (
        typeof data.reply !== "string" ||
        !data.reply.trim()
      ) {
        throw new Error(
          "El servidor no devolvió una respuesta válida."
        );
      }

      return data.reply.trim();
    } catch (error) {
      if (
        error.name === "AbortError"
      ) {
        throw new Error(
          "La respuesta tardó demasiado. Verifica la conexión e inténtalo nuevamente."
        );
      }

      throw error;
    } finally {
      window.clearTimeout(timeout);
    }
  }

  async function respond(text) {
    setLoading(true);

    const typing =
      showTyping();

    const startTime =
      Date.now();

    let answer;
    let usedLocalResponse =
      false;

    try {
      answer =
        await askGemini(text);
    } catch (error) {
      console.info(
        "INVI usará una respuesta local:",
        error.message
      );

      answer =
        getLocalResponse(text);

      usedLocalResponse =
        true;
    }

    const elapsed =
      Date.now() - startTime;

    const remaining =
      Math.max(
        MIN_TYPING_TIME - elapsed,
        0
      );

    window.setTimeout(
      async () => {
        typing.remove();

        try {
          await addTypedMessage(
            answer,
            "bot"
          );

          processNavigation(text);

          if (
            usedLocalResponse
          ) {
            widget.classList.add(
              "is-local-response"
            );

            window.setTimeout(
              () => {
                widget.classList.remove(
                  "is-local-response"
                );
              },
              1200
            );
          }
        } finally {
          setLoading(false);
        }
      },
      remaining
    );
  }

  function submitText(text) {
    const cleanText =
      String(text || "").trim();

    if (
      !cleanText ||
      isResponding
    ) {
      return;
    }

    addMessage(
      cleanText,
      "user"
    );

    input.value = "";
    input.style.height = "";

    respond(cleanText);
  }

  launcher.addEventListener(
    "click",
    () => {
      setOpen(
        !widget.classList.contains(
          "is-open"
        )
      );
    }
  );

  closeButton.addEventListener(
    "click",
    () => {
      resetExpandedState();
      setOpen(false);
    }
  );

  expandButton?.addEventListener(
    "click",
    () => {
      const expanded =
        widget.classList.toggle(
          "is-expanded"
        );

      expandButton.innerHTML =
        expanded
          ? '<i class="bi bi-fullscreen-exit"></i>'
          : '<i class="bi bi-arrows-fullscreen"></i>';

      expandButton.setAttribute(
        "aria-label",
        expanded
          ? "Reducir chat"
          : "Expandir chat"
      );

      expandButton.setAttribute(
        "title",
        expanded
          ? "Reducir chat"
          : "Expandir chat"
      );

      scrollToLatest();
    }
  );

  form.addEventListener(
    "submit",
    (event) => {
      event.preventDefault();
      submitText(input.value);
    }
  );

  input.addEventListener(
    "keydown",
    (event) => {
      if (
        event.key === "Enter" &&
        !event.shiftKey
      ) {
        event.preventDefault();
        form.requestSubmit();
      }
    }
  );

  input.addEventListener(
    "input",
    () => {
      input.style.height =
        "auto";

      input.style.height =
        `${Math.min(
          input.scrollHeight,
          110
        )}px`;
    }
  );

  quickActions.forEach(
    (button) => {
      button.addEventListener(
        "click",
        () => {
          const question =
            button.dataset.question ||
            button.textContent ||
            "";

          submitText(question);
        }
      );
    }
  );

  document.addEventListener(
    "keydown",
    (event) => {
      if (
        event.key !== "Escape"
      ) {
        return;
      }

      if (
        widget.classList.contains(
          "is-expanded"
        )
      ) {
        resetExpandedState();
        return;
      }

      if (
        widget.classList.contains(
          "is-open"
        )
      ) {
        setOpen(false);
      }
    }
  );

  createClearButton();
  loadHistory();
})();