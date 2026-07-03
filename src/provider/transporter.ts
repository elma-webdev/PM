import nodemailer from "nodemailer";

// Configuração do transportador (quem vai enviar o email)
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT), 
  secure: process.env.EMAIL_SECURE === "false",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendResetPasswordEmail = async (to: string, code: number) => {
  const mailOptions = {
    from: `"Suporte do sistema" <${process.env.EMAIL_USER}>`, // Nome e email do remetente
    to, // Email do usuário que solicitou
    subject: "Pedido de recuperação de Senha - Código de verificação",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <h2 style="color: #333;">Recuperação de Senha</h2>
        <p>Você solicitou a redefinição de senha da sua conta.</p>
        <p>Use o código abaixo para confirmar a alteração:</p>
        <div style="background-color: #f4f4f4; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 4px; color: #007bff; border-radius: 4px; margin: 20px 0;">
          ${code}
        </div>
        <p style="color: #666; font-size: 14px;">Este código expirará em 15 minutos.</p>
        <p style="color: #666; font-size: 14px;">Se você não solicitou isso, ignore este e-mail.</p>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
};
