package de.entropylabs.mithrilforge.services

import org.springframework.beans.factory.annotation.Value
import org.springframework.mail.SimpleMailMessage
import org.springframework.mail.javamail.JavaMailSender
import org.springframework.stereotype.Service

@Service
class EmailService(
    @Value("\${spring.mail.from}") private val senderEmail: String,
    private val mailSender: JavaMailSender,
) {
    fun sendSimpleEmail(
        to: String,
        subject: String,
        text: String,
    ) {
        val message =
            SimpleMailMessage().apply {
                setFrom(senderEmail)
                setTo(to)
                setSubject(subject)
                setText(text)
            }

        mailSender.send(message)
    }
}
