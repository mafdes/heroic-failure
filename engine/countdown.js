function wrapText(ctx, text, maxWidth) {
  const words = String(text).split(/\s+/);
  const lines = [];
  let line = "";

  words.forEach((word) => {
    const testLine = line ? `${line} ${word}` : word;
    if (ctx.measureText(testLine).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = testLine;
    }
  });

  if (line) lines.push(line);
  return lines;
}

export function drawCountdown(ctx, seconds, subtitle) {
  const width = 960;
  const height = 540;
  const number = Math.max(1, Math.ceil(seconds));
  const progress = Math.max(0, Math.min(1, seconds / 3));
  const compact = width < 700 || height < 420;
  const ringRadius = compact ? Math.min(width, height) * 0.18 : 105;
  const numberSize = compact ? Math.max(64, Math.min(width, height) * 0.16) : 110;
  const titleSize = compact ? 26 : 34;
  const subtitleSize = compact ? 18 : 24;
  const subtitleMaxWidth = width * 0.82;
  const subtitleY = compact ? height * 0.84 : 440;

  // Background
  ctx.fillStyle = "#1a1622";
  ctx.fillRect(0, 0, width, height);

  ctx.save();
  ctx.translate(width / 2, height * (compact ? 0.47 : 0.46));

  // Background track ring
  ctx.strokeStyle = "rgba(211, 166, 88, 0.18)";
  ctx.lineWidth = compact ? 10 : 12;
  ctx.beginPath();
  ctx.arc(0, 0, ringRadius, 0, Math.PI * 2);
  ctx.stroke();

  // Active smooth progress arc (sweeps clockwise)
  ctx.strokeStyle = "#f3c46b";
  ctx.lineWidth = compact ? 10 : 12;
  ctx.lineCap = "round";
  ctx.beginPath();
  const startAngle = -Math.PI / 2;
  const endAngle = startAngle + (Math.PI * 2 * progress);
  ctx.arc(0, 0, ringRadius, startAngle, endAngle, false);
  ctx.stroke();

  // Center Countdown Number
  ctx.fillStyle = "#f7ead0";
  ctx.shadowColor = "#f3c46b";
  ctx.shadowBlur = 20;
  ctx.font = `bold ${numberSize}px Cinzel, Georgia, serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(String(number), 0, 4);

  ctx.restore();

  // Header & Footer labels
  ctx.shadowBlur = 0;
  ctx.fillStyle = "#f3c46b";
  ctx.font = `bold ${titleSize}px Cinzel, Georgia, serif`;
  ctx.textAlign = "center";
  ctx.fillText("¡PREPÁRATE!", width / 2, compact ? 64 : 85);

  ctx.fillStyle = "#d4c5cf";
  ctx.font = `600 ${subtitleSize}px Cinzel, Georgia, serif`;
  const lines = wrapText(ctx, subtitle, subtitleMaxWidth);
  const lineHeight = compact ? 22 : 28;
  const startY = subtitleY - ((lines.length - 1) * lineHeight) / 2;
  lines.forEach((line, index) => ctx.fillText(line, width / 2, startY + index * lineHeight));
}
