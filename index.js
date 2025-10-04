import EnemyController from "./EnemyController.js";
import Player from "./Player.js";
import BulletController from "./BulletController.js";


window.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("game");
  const ctx = canvas.getContext("2d");

  let gameStarted = false;

  // Only draw text after the font is ready
  document.fonts.load('70px PressStart').then(() => {
    gameLoop();
  });

  canvas.width = 800;
  canvas.height = 600;

  const background = new Image();
  background.src = "images/space.png";

  const playerBulletController = new BulletController(canvas, 10, "red", true);
  const enemyBulletController = new BulletController(canvas, 4, "white", false);
  const enemyController = new EnemyController(
    canvas,
    enemyBulletController,
    playerBulletController
  );
  const player = new Player(canvas, 3, playerBulletController);

  let isGameOver = false;
  let didWin = false;

  function displayGameStart() {
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";

    ctx.font = "40px PressStart"
    ctx.fillText("Space Invader", canvas.width / 5, canvas.height / 2);

    ctx.font = "20px PressStart"
    ctx.fillText("Press ENTER To Start", canvas.width / 4, canvas.height / 2 + 60);
  }

  document.addEventListener('keydown', (e) => {
    if (!gameStarted && e.code === "Enter") {
      gameStarted = true;
    } else if (isGameOver && e.code === "Enter") {
      location.reload(); // 👈 reloads the whole page
    }
  });

  function displayGameOver() {
    if (isGameOver) {
      let text = didWin ? "You Win" : "Game Over";
      let textOffset = didWin ? 3.5 : 4;

      ctx.fillStyle = "white";
      ctx.font = "40px PressStart";
      ctx.fillText(text, canvas.width / textOffset, canvas.height / 2);

      ctx.font = "20px PressStart"
      ctx.fillText("Press Any Button", canvas.width / 3.5, canvas.height / 2 + 60);
    }
  }

  function checkGameOver() {
    if (isGameOver) {
      return;
    }

    if (enemyBulletController.collideWith(player)) {
      isGameOver = true;
    }

    if (enemyController.collideWith(player)) {
      isGameOver = true;
    }

    if (enemyController.enemyRows.length === 0) {
      didWin = true;
      isGameOver = true;
    }
  }

  function gameLoop() {
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

    if (!gameStarted) {
      displayGameStart();
    } else {
      checkGameOver();
      if (!isGameOver) {
        enemyController.draw(ctx);
        player.draw(ctx);
        playerBulletController.draw(ctx);
        enemyBulletController.draw(ctx);
      } else {
        displayGameOver();
      }
    }

    requestAnimationFrame(gameLoop);
  }
})

