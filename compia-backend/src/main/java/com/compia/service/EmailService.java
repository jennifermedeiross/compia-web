package com.compia.service;

import com.compia.entity.Order;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    public void sendOrderConfirmation(String email, Order order) {

        try {

            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(email);
            helper.setSubject("Pedido confirmado - COMPIA");

            String itemsHtml = order.getItems().stream()
                    .map(item -> """
                        <tr>
                          <td style="padding:8px;">%s</td>
                          <td style="text-align:center;">%d</td>
                          <td style="text-align:right;">R$ %.2f</td>
                        </tr>
                        """.formatted(
                            item.getProduct().getTitle(),
                            item.getQuantity(),
                            item.getPrice()
                    ))
                    .collect(Collectors.joining());

            String html = """
                <div style="font-family:Arial,sans-serif;background:#f4f4f4;padding:20px;">
                  <div style="max-width:600px;margin:auto;background:white;padding:30px;border-radius:8px;">

                    <h2 style="color:#1a1a1a;">Pedido confirmado!</h2>

                    <p>Olá <strong>%s</strong>,</p>

                    <p>Seu pedido foi recebido com sucesso.</p>

                    <div style="background:#fafafa;padding:15px;border-radius:6px;margin:20px 0;">
                      <p><strong>Número do pedido:</strong> #%s</p>
                      <p><strong>Data:</strong> %s</p>
                    </div>

                    <h3>Resumo do pedido</h3>

                    <table style="width:100%%;border-collapse:collapse;">
                      <thead>
                        <tr style="background:#f0f0f0;">
                          <th style="text-align:left;padding:8px;">Produto</th>
                          <th style="text-align:center;padding:8px;">Qtd</th>
                          <th style="text-align:right;padding:8px;">Preço</th>
                        </tr>
                      </thead>
                      <tbody>
                        %s
                      </tbody>
                    </table>

                    <hr style="margin:20px 0">

                    <p style="text-align:right;">
                      <strong>Total: R$ %.2f</strong>
                    </p>

                    <div style="text-align:center;margin-top:30px;">
                      <a href="#"
                         style="background:#2563eb;color:white;padding:12px 20px;
                                text-decoration:none;border-radius:6px;font-weight:bold;">
                        Ver pedido
                      </a>
                    </div>

                    <hr style="margin:30px 0">

                    <p style="font-size:12px;color:#777;">
                      Editora COMPIA<br>
                      Conteúdos de Inteligência Artificial
                    </p>

                  </div>
                </div>
                """.formatted(
                    order.getCustomer().getName(),
                    order.getId(),
                    order.getCreatedAt(),
                    itemsHtml,
                    order.getTotal()
            );

            helper.setText(html, true);

            mailSender.send(message);

        } catch (Exception e) {
            System.out.println("Erro ao enviar email: " + e.getMessage());
        }
    }
}