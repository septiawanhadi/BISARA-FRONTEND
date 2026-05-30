import React, { useRef, useEffect } from 'react';
import { colors } from '../../lib/tokens';

interface AvatarViewerProps {
  avatarId: string;
  activeClip: string | null;
  frameIndex: number;
}

export const AvatarViewer: React.FC<AvatarViewerProps> = ({ 
  avatarId, 
  activeClip, 
  frameIndex 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.parentElement?.clientWidth || 400;
    canvas.height = canvas.parentElement?.clientHeight || 380;

    const midX = canvas.width / 2;
    const midY = canvas.height / 2;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Premium radial gradient background matching the static app style
    const bgGrad = ctx.createRadialGradient(midX, midY, 10, midX, midY, canvas.width / 1.4);
    bgGrad.addColorStop(0, '#FFFFFF');
    bgGrad.addColorStop(1, '#E2E8F0');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Idle breathing offset
    let breatheY = Math.sin(Date.now() * 0.003) * 3;
    let handOffsetLeftY = 0;
    let handOffsetRightY = 0;
    let handOffsetLeftX = 0;
    let handOffsetRightX = 0;
    let expression = 'happy';

    // Rigging clip translations
    if (activeClip === 'makan') {
      const cycle = (frameIndex % 30) / 30;
      const pull = Math.sin(cycle * Math.PI);
      handOffsetRightX = -50 * pull;
      handOffsetRightY = -70 * pull - 30;
      expression = pull > 0.5 ? 'chewing' : 'happy';
    } else if (activeClip === 'terima-kasih') {
      if (frameIndex < 45) {
        const pull = Math.sin((frameIndex / 45) * Math.PI / 2);
        handOffsetRightX = -30 * pull;
        handOffsetRightY = -80 * pull;
      } else {
        const pull = Math.cos(((frameIndex - 45) / 45) * Math.PI / 2);
        handOffsetRightX = -30 * pull + 40 * (1 - pull);
        handOffsetRightY = -80 * pull + 10 * (1 - pull);
      }
      expression = 'thankful';
    } else if (activeClip === 'tolong') {
      const pull = Math.sin((frameIndex / 90) * Math.PI * 3);
      handOffsetLeftX = 35;
      handOffsetRightX = -35;
      handOffsetLeftY = -40 + pull * 10;
      handOffsetRightY = -40 + pull * 10;
      expression = 'please';
    } else if (activeClip === 'belajar') {
      const tap = Math.sin(frameIndex * 0.5) > 0 ? 1 : 0;
      handOffsetLeftX = 30;
      handOffsetLeftY = -25;
      handOffsetRightX = -25;
      handOffsetRightY = -28 - tap * 12;
      expression = 'focused';
    } else if (activeClip === 'scratch_head') {
      breatheY += Math.sin(frameIndex * 0.5) * 2;
      handOffsetRightX = -15 + Math.sin(frameIndex * 0.8) * 8;
      handOffsetRightY = -120;
      expression = 'confused';
    } else if (activeClip === 'halo') {
      const wave = Math.sin(frameIndex * 0.4) * 15;
      handOffsetLeftX = -45;
      handOffsetLeftY = -70 + wave;
    }

    // Avatar visual profiles definitions
    let avatarColor = colors['purple-accent']; // default Timi
    if (avatarId === 'kiko') avatarColor = colors['cyan-accent'];
    if (avatarId === 'lulu') avatarColor = colors['orange-accent'];

    // Draw main body
    ctx.fillStyle = avatarColor;
    ctx.beginPath();
    ctx.ellipse(midX, midY + 120 + breatheY, 70, 50, 0, 0, Math.PI * 2);
    ctx.fill();

    // Head
    ctx.beginPath();
    ctx.arc(midX, midY - 20 + breatheY, 52, 0, Math.PI * 2);
    ctx.fill();

    // Ears
    if (avatarId === 'timi') {
      // Cat ears
      ctx.fillStyle = '#6D28D9';
      ctx.beginPath();
      ctx.moveTo(midX - 45, midY - 45 + breatheY);
      ctx.lineTo(midX - 45, midY - 80 + breatheY);
      ctx.lineTo(midX - 15, midY - 50 + breatheY);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(midX + 45, midY - 45 + breatheY);
      ctx.lineTo(midX + 45, midY - 80 + breatheY);
      ctx.lineTo(midX + 15, midY - 50 + breatheY);
      ctx.fill();
    } else if (avatarId === 'kiko') {
      // Bunny ears
      ctx.fillStyle = '#0EA5E9';
      ctx.beginPath();
      ctx.ellipse(midX - 20, midY - 85 + breatheY, 10, 32, -0.08, 0, Math.PI * 2);
      ctx.ellipse(midX + 20, midY - 85 + breatheY, 10, 32, 0.08, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#FF4D9D';
      ctx.beginPath();
      ctx.ellipse(midX - 20, midY - 82 + breatheY, 5, 23, -0.08, 0, Math.PI * 2);
      ctx.ellipse(midX + 20, midY - 82 + breatheY, 5, 23, 0.08, 0, Math.PI * 2);
      ctx.fill();
    } else if (avatarId === 'lulu') {
      // Bear ears
      ctx.fillStyle = '#D97706';
      ctx.beginPath();
      ctx.arc(midX - 42, midY - 60 + breatheY, 16, 0, Math.PI * 2);
      ctx.arc(midX + 42, midY - 60 + breatheY, 16, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#FFD60A';
      ctx.beginPath();
      ctx.arc(midX - 42, midY - 60 + breatheY, 9, 0, Math.PI * 2);
      ctx.arc(midX + 42, midY - 60 + breatheY, 9, 0, Math.PI * 2);
      ctx.fill();
    }

    // Face overlay
    ctx.fillStyle = '#FFE0B2';
    ctx.beginPath();
    ctx.arc(midX, midY - 14 + breatheY, 40, 0, Math.PI * 2);
    ctx.fill();

    // Eyes
    ctx.fillStyle = '#1E293B';
    if (expression === 'thankful') {
      ctx.lineWidth = 4;
      ctx.strokeStyle = '#1E293B';
      ctx.beginPath();
      ctx.arc(midX - 16, midY - 18 + breatheY, 6, Math.PI, 0);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(midX + 16, midY - 18 + breatheY, 6, Math.PI, 0);
      ctx.stroke();
    } else if (expression === 'confused') {
      ctx.beginPath();
      ctx.arc(midX - 16, midY - 16 + breatheY, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(midX + 16, midY - 14 + breatheY, 3, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.beginPath();
      ctx.arc(midX - 16, midY - 16 + breatheY, 6, 0, Math.PI * 2);
      ctx.arc(midX + 16, midY - 16 + breatheY, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(midX - 14, midY - 18 + breatheY, 2, 0, Math.PI * 2);
      ctx.arc(midX + 18, midY - 18 + breatheY, 2, 0, Math.PI * 2);
      ctx.fill();
    }

    // Nose & Mouth
    ctx.fillStyle = '#FF4D9D';
    ctx.beginPath();
    ctx.arc(midX, midY - 6 + breatheY, 3, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#1E293B';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    if (expression === 'chewing') {
      ctx.strokeRect(midX - 4, midY + 4 + breatheY, 8, 4);
    } else if (expression === 'thankful' || expression === 'happy') {
      ctx.arc(midX, midY + breatheY, 6, 0.1, Math.PI - 0.1);
      ctx.stroke();
    } else {
      ctx.arc(midX, midY + 2 + breatheY, 3, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Rosy cheeks
    ctx.fillStyle = '#FF4D9D';
    ctx.globalAlpha = 0.3;
    ctx.beginPath();
    ctx.arc(midX - 26, midY - 4 + breatheY, 6, 0, Math.PI * 2);
    ctx.arc(midX + 26, midY - 4 + breatheY, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1.0;

    // Draw hands & arms
    ctx.strokeStyle = avatarColor;
    ctx.lineWidth = 14;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Left arm & hand
    ctx.beginPath();
    ctx.moveTo(midX - 60, midY + 110 + breatheY);
    ctx.lineTo(midX - 90 + handOffsetLeftX, midY + 80 + handOffsetLeftY + breatheY);
    ctx.stroke();
    
    ctx.fillStyle = '#FFE0B2';
    ctx.beginPath();
    ctx.arc(midX - 90 + handOffsetLeftX, midY + 80 + handOffsetLeftY + breatheY, 10, 0, Math.PI * 2);
    ctx.fill();

    // Right arm & hand
    ctx.strokeStyle = avatarColor;
    ctx.beginPath();
    ctx.moveTo(midX + 60, midY + 110 + breatheY);
    ctx.lineTo(midX + 90 + handOffsetRightX, midY + 80 + handOffsetRightY + breatheY);
    ctx.stroke();
    
    ctx.fillStyle = '#FFE0B2';
    ctx.beginPath();
    ctx.arc(midX + 90 + handOffsetRightX, midY + 80 + handOffsetRightY + breatheY, 10, 0, Math.PI * 2);
    ctx.fill();

  }, [avatarId, activeClip, frameIndex]);

  return (
    <div className="w-full h-full relative overflow-hidden bg-slate-100 rounded-md">
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
};
