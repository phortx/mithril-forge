package de.entropylabs.mithrilforge.services

import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test
import org.mockito.ArgumentCaptor
import org.mockito.Mockito.mock
import org.mockito.Mockito.verify
import org.springframework.mail.SimpleMailMessage
import org.springframework.mail.javamail.JavaMailSender
import org.springframework.test.util.ReflectionTestUtils

class EmailServiceTest {
    @Test
    fun `sendSimpleEmail should send email with correct properties`() {
        val mailSender = mock(JavaMailSender::class.java)
        val senderEmail = "noreply@mithrilforge.test"
        val emailService =
            EmailService(
                senderEmail = senderEmail,
                mailSender = mailSender,
            )

        emailService.sendSimpleEmail("user@example.com", "Test Subject", "Test Body")

        val messageCaptor = ArgumentCaptor.forClass(SimpleMailMessage::class.java)
        verify(mailSender).send(messageCaptor.capture())

        val sentMessage = messageCaptor.value
        assertEquals(senderEmail, sentMessage.from)
        assertEquals(1, sentMessage.to?.size)
        assertEquals("user@example.com", sentMessage.to?.get(0))
        assertEquals("Test Subject", sentMessage.subject)
        assertEquals("Test Body", sentMessage.text)
    }
}
