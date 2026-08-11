export function drawCountdown(ctx, seconds, subtitle) {
  const number = Math.max(1, Math.ceil(seconds));
  const phase = seconds - Math.floor(seconds);
  const pulse = 1 + (1 - phase) * .18;
  const ringRadius = 96 + (1 - phase) * 100;

  ctx.fillStyle = "#211d2a"; ctx.fillRect(0, 0, 960, 540);
  ctx.save(); ctx.translate(480, 270);
  ctx.globalAlpha = .34 * phase; ctx.strokeStyle = "#f3c46b"; ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(0, 0, ringRadius, 0, Math.PI * 2); ctx.stroke();
  ctx.globalAlpha = .7; ctx.strokeStyle = "#a9683e"; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(0, 0, 116, 0, Math.PI * 2); ctx.stroke();
  ctx.globalAlpha = 1; ctx.scale(pulse, pulse); ctx.fillStyle = "#f7ead0"; ctx.shadowColor = "#f3c46b"; ctx.shadowBlur = 28; ctx.font = "bold 230px Georgia"; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(String(number), 0, 12); ctx.restore();
  ctx.shadowBlur = 0; ctx.fillStyle = "#f3c46b"; ctx.font = "bold 27px Georgia"; ctx.textAlign = "center"; ctx.fillText("PREPÁRATE", 480, 100); ctx.fillStyle = "#bdb0b6"; ctx.font = "20px Georgia"; ctx.fillText(subtitle, 480, 455);
}
