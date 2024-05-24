// Referências iniciais
let timerRef = document.querySelector(".timer-display"); // Referência para o visor do timer
const hourInput = document.getElementById("hourInput"); // Referência para o campo de entrada de hora
const minuteInput = document.getElementById("minuteInput"); // Referência para o campo de entrada de minuto
const activeAlarms = document.querySelector(".activeAlarms"); // Referência para a área de alarmes ativos
const setAlarm = document.getElementById("set"); // Referência para o botão "Adicionar Alarme"
let alarmsArray = []; // Array para armazenar os alarmes
let alarmSound = new Audio("./alarm.mp3"); // Objeto de áudio para o som do alarme

let initialHour = 0, // Hora inicial
  initialMinute = 0, // Minuto inicial
  alarmIndex = 0; // Índice do alarme

// Função para adicionar zero à esquerda para valores de um dígito
const appendZero = (value) => (value < 10 ? "0" + value : value);

// Função para pesquisar por um valor em um objeto
const searchObject = (parameter, value) => {
  let alarmObject,
    objIndex,
    exists = false;
  alarmsArray.forEach((alarm, index) => {
    if (alarm[parameter] == value) {
      exists = true;
      alarmObject = alarm;
      objIndex = index;
      return false;
    }
  });
  return [exists, alarmObject, objIndex];
};

// Função para exibir o timer
function displayTimer() {
  let date = new Date();
  let [hours, minutes, seconds] = [
    appendZero(date.getHours()),
    appendZero(date.getMinutes()),
    appendZero(date.getSeconds()),
  ];

  // Exibe o horário
  timerRef.innerHTML = `${hours}:${minutes}:${seconds}`;

  // Verifica os alarmes ativos
  alarmsArray.forEach((alarm, index) => {
    if (alarm.isActive) {
      if (`${alarm.alarmHour}:${alarm.alarmMinute}` === `${hours}:${minutes}`) {
        alarmSound.play(); // Toca o som do alarme
        alarmSound.loop = true; // Repete o som do alarme
      }
    }
  });
}

// Função para verificar e corrigir a entrada do usuário para hora e minuto
const inputCheck = (inputValue) => {
  inputValue = parseInt(inputValue);
  if (inputValue < 10) {
    inputValue = appendZero(inputValue);
  }
  return inputValue;
};

// Evento para verificar e corrigir a entrada de hora
hourInput.addEventListener("input", () => {
  hourInput.value = inputCheck(hourInput.value);
});

// Evento para verificar e corrigir a entrada de minuto
minuteInput.addEventListener("input", () => {
  minuteInput.value = inputCheck(minuteInput.value);
});

// Função para criar uma div de alarme
const createAlarm = (alarmObj) => {
  // Chaves do objeto
  const { id, alarmHour, alarmMinute } = alarmObj;
  // Cria a div do alarme
  let alarmDiv = document.createElement("div");
  alarmDiv.classList.add("alarm");
  alarmDiv.setAttribute("data-id", id);
  alarmDiv.innerHTML = `<span>${alarmHour}: ${alarmMinute}</span>`;

  // Checkbox
  let checkbox = document.createElement("input");
  checkbox.setAttribute("type", "checkbox");
  checkbox.addEventListener("click", (e) => {
    if (e.target.checked) {
      startAlarm(e); // Inicia o alarme
    } else {
      stopAlarm(e); // Para o alarme
    }
  });
  alarmDiv.appendChild(checkbox);
  // Botão de exclusão
  let deleteButton = document.createElement("button");
  deleteButton.innerHTML = `<i class="fa-solid fa-trash-can"></i>`;
  deleteButton.classList.add("deleteButton");
  deleteButton.addEventListener("click", (e) => deleteAlarm(e));
  alarmDiv.appendChild(deleteButton);
  activeAlarms.appendChild(alarmDiv); // Adiciona a div de alarme à área de alarmes ativos
};

// Evento para adicionar um alarme
setAlarm.addEventListener("click", () => {
  alarmIndex += 1;

  // Objeto de alarme
  let alarmObj = {};
  alarmObj.id = `${alarmIndex}_${hourInput.value}_${minuteInput.value}`;
  alarmObj.alarmHour = hourInput.value;
  alarmObj.alarmMinute = minuteInput.value;
  alarmObj.isActive = false;
  alarmsArray.push(alarmObj); // Adiciona o alarme ao array
  createAlarm(alarmObj); // Cria a div de alarme
  hourInput.value = appendZero(initialHour); // Reinicia a entrada de hora
  minuteInput.value = appendZero(initialMinute); // Reinicia a entrada de minuto
});

// Função para iniciar o alarme
const startAlarm = (e) => {
  // Obtém o ID do alarme a partir do elemento pai do evento
  let searchId = e.target.parentElement.getAttribute("data-id");
  // Busca o objeto correspondente ao ID no array de alarmes
  let [exists, obj, index] = searchObject("id", searchId);
  // Se o objeto existe, ativa o alarme
  if (exists) {
  alarmsArray[index].isActive = true;
  }
  };
  
  // Função para parar o alarme
  const stopAlarm = (e) => {
  // Obtém o ID do alarme a partir do elemento pai do evento
  let searchId = e.target.parentElement.getAttribute("data-id");
  // Busca o objeto correspondente ao ID no array de alarmes
  let [exists, obj, index] = searchObject("id", searchId);
  // Se o objeto existe, desativa o alarme e pausa o som do alarme
  if (exists) {
  alarmsArray[index].isActive = false;
  alarmSound.pause(); // Pausa o som do alarme
  }
  };

// Função para excluir o alarme
const deleteAlarm = (e) => {
  let searchId = e.target.parentElement.parentElement.getAttribute("data-id");
  let [exists, obj, index] = searchObject("id", searchId);
  if (exists) {
    e.target.parentElement.parentElement.remove(); // Remove a div de alarme
    alarmsArray.splice(index, 1); // Remove o alarme do array
  }
};

// Evento ao carregar a página
window.onload = () => {
  setInterval(displayTimer); // Atualiza o timer a cada segundo
  initialHour = 0; // Hora inicial
  initialMinute = 0; // Minuto inicial
  alarmIndex = 0; // Índice inicial do alarme
  alarmsArray = []; // Array de alarmes vazio
  hourInput.value = appendZero(initialHour); // Define a entrada de hora inicial
  minuteInput.value = appendZero(initialMinute); // Define a entrada de minuto inicial
};




