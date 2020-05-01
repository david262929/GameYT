
const size = {width:8, height:8};
const field = createField(size);
const gameArea = document.createElement("div");

gameArea.classList.add("gameArea");
gameArea.appendChild(field.element);
document.body.appendChild(gameArea);

