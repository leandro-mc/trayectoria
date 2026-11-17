package com.edumora.trayectoria.ai

import com.edumora.trayectoria.infrastructure.ai.provider.GeminiProvider
import com.edumora.trayectoria.shared.exception.InternalException
import org.junit.jupiter.api.Test
import org.springframework.http.HttpMethod
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.test.web.client.MockRestServiceServer
import org.springframework.test.web.client.match.MockRestRequestMatchers.header
import org.springframework.test.web.client.match.MockRestRequestMatchers.jsonPath
import org.springframework.test.web.client.match.MockRestRequestMatchers.method
import org.springframework.test.web.client.match.MockRestRequestMatchers.requestTo
import org.springframework.test.web.client.response.MockRestResponseCreators.withStatus
import org.springframework.test.web.client.response.MockRestResponseCreators.withSuccess
import org.springframework.web.client.RestClient
import kotlin.test.assertEquals
import kotlin.test.assertFailsWith

/**
 * Unit tests for GeminiProvider. They use a mocked HTTP server, so they need
 * neither network access, a Gemini API key nor Docker.
 */
class GeminiProviderTest {

    private val url = "https://gemini.test/v1beta/models/gemini-2.5-flash:generateContent"

    private fun newProvider(apiKey: String = "test-key"): Pair<GeminiProvider, MockRestServiceServer> {
        val builder = RestClient.builder()
        val server = MockRestServiceServer.bindTo(builder).build()
        val provider = GeminiProvider(
            restClientBuilder = builder,
            apiKey = apiKey,
            model = "gemini-2.5-flash",
            baseUrl = "https://gemini.test/v1beta",
            maxOutputTokens = 1024,
            temperature = 0.5
        )
        return provider to server
    }

    private fun answer(text: String) =
        """{"candidates":[{"content":{"role":"model","parts":[{"text":${jsonString(text)}}]},"finishReason":"STOP"}]}"""

    private fun jsonString(s: String) = "\"" + s.replace("\\", "\\\\").replace("\"", "\\\"").replace("\n", "\\n") + "\""

    @Test
    fun `generate sends system and user prompts and returns the model text`() {
        val (provider, server) = newProvider()
        server.expect(requestTo(url))
            .andExpect(method(HttpMethod.POST))
            .andExpect(header("x-goog-api-key", "test-key"))
            .andExpect(jsonPath("$.system_instruction.parts[0].text").value("You are an interviewer"))
            .andExpect(jsonPath("$.contents[0].role").value("user"))
            .andExpect(jsonPath("$.contents[0].parts[0].text").value("Hello"))
            .andExpect(jsonPath("$.generationConfig.maxOutputTokens").value(1024))
            .andExpect(jsonPath("$.generationConfig.responseMimeType").doesNotExist())
            .andRespond(withSuccess(answer("Welcome to the interview"), MediaType.APPLICATION_JSON))

        assertEquals("Welcome to the interview", provider.generate("You are an interviewer", "Hello"))
        server.verify()
    }

    @Test
    fun `generateJson enables JSON mode and strips markdown fences`() {
        val (provider, server) = newProvider()
        server.expect(requestTo(url))
            .andExpect(jsonPath("$.generationConfig.responseMimeType").value("application/json"))
            .andRespond(withSuccess(answer("```json\n{\"ok\":true}\n```"), MediaType.APPLICATION_JSON))

        assertEquals("""{"ok":true}""", provider.generateJson("system", "user"))
        server.verify()
    }

    @Test
    fun `joins multiple text parts of the answer`() {
        val (provider, server) = newProvider()
        val body = """{"candidates":[{"content":{"parts":[{"text":"Hello, "},{"text":"world"}]}}]}"""
        server.expect(requestTo(url)).andRespond(withSuccess(body, MediaType.APPLICATION_JSON))

        assertEquals("Hello, world", provider.generate("s", "u"))
    }

    @Test
    fun `a blocked prompt becomes an InternalException`() {
        val (provider, server) = newProvider()
        server.expect(requestTo(url)).andRespond(
            withSuccess("""{"promptFeedback":{"blockReason":"SAFETY"}}""", MediaType.APPLICATION_JSON)
        )

        assertFailsWith<InternalException> { provider.generate("s", "u") }
    }

    @Test
    fun `an answer without text becomes an InternalException`() {
        val (provider, server) = newProvider()
        server.expect(requestTo(url)).andRespond(
            withSuccess("""{"candidates":[{"finishReason":"MAX_TOKENS"}]}""", MediaType.APPLICATION_JSON)
        )

        assertFailsWith<InternalException> { provider.generate("s", "u") }
    }

    @Test
    fun `an HTTP error from Gemini becomes an InternalException`() {
        val (provider, server) = newProvider()
        server.expect(requestTo(url)).andRespond(withStatus(HttpStatus.TOO_MANY_REQUESTS))

        assertFailsWith<InternalException> { provider.generate("s", "u") }
    }

    @Test
    fun `without an API key it fails fast and never calls Gemini`() {
        val (provider, server) = newProvider(apiKey = "")

        assertFailsWith<InternalException> { provider.generate("s", "u") }
        server.verify() // no expectations registered → any HTTP call would have failed the test
    }
}
