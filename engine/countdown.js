export function drawCountdown(ctx, seconds, subtitle) {
  const number = Math.max(1, Math.ceil(seconds));
  const progress = Math.max(0, Math.min(1, seconds / 3));

  // Background
  ctx.fillStyle = "#1a1622";
  ctx.fillRect(0, 0, 960, 540);

  ctx.save();
  ctx.translate(480, 250);

  // Background track ring
  ctx.strokeStyle = "rgba(211, 166, 88, 0.18)";
  ctx.lineWidth = 12;
  ctx.beginPath();
  ctx.arc(0, 0, 105, 0, Math.PI * 2);
  ctx.stroke();

  // Active smooth progress arc (sweeps clockwise)
  ctx.strokeStyle = "#f3c46b";
  ctx.lineWidth = 12;
  ctx.lineCap = "round";
  ctx.beginPath();
  const startAngle = -Math.PI / 2;
  const endAngle = startAngle + (Math.PI * 2 * progress);
  ctx.arc(0, 0, 105, startAngle, endAngle, false);
  ctx.stroke();

  // Center Countdown Number
  ctx.fillStyle = "#f7ead0";
  ctx.shadowColor = "#f3c46b";
  ctx.shadowBlur = 20;
  ctx.font = "bold 110px Cinzel, Georgia, serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(String(number), 0, 4);

  ctx.restore();

  // Header & Footer labels
  ctx.shadowBlur = 0;
  ctx.fillStyle = "#f3c46b";
  ctx.font = "bold 34px Cinzel, Georgia, serif";
  ctx.textAlign = "center";
  ctx.fillText("¡PREPÁRATE!", 480, 85);

  ctx.fillStyle = "#d4c5cf";
  ctx.font = "600 24px Cinzel, Georgia, serif";
  ctx.fillText(subtitle, 480, 440);
}

