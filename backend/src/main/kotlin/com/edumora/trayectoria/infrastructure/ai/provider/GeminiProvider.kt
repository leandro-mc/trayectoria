package com.edumora.trayectoria.infrastructure.ai.provider

import com.edumora.trayectoria.application.port.output.AiGenerationPort
import com.edumora.trayectoria.shared.exception.InternalException
import com.fasterxml.jackson.databind.JsonNode
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Value
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty
import org.springframework.http.MediaType
import org.springframework.stereotype.Component
import org.springframework.web.client.RestClient

/**
 * Implementation of the AiGenerationPort using Google's Gemini API
 * (Generative Language API, "generateContent" endpoint).
 *
 * Active only when `app.ai.provider=gemini` (env: AI_PROVIDER=gemini).
 * The default provider remains OpenAI (see SpringAiProvider).
 *
 * It uses Spring's RestClient directly, so no extra dependency is needed.
 * Because the use cases only depend on AiGenerationPort, switching provider
 * is purely a configuration change.
 *
 * Configuration (application.yml -> gemini.*):
 *  - api-key            GEMINI_API_KEY      (required when this provider is active)
 *  - model              GEMINI_MODEL        (default gemini-2.5-flash)
 *  - base-url           GEMINI_BASE_URL     (default https://generativelanguage.googleapis.com/v1beta)
 *  - max-output-tokens  GEMINI_MAX_TOKENS   (default 8192; "thinking" models count their reasoning here too)
 *  - temperature        GEMINI_TEMPERATURE  (default 0.7)
 *
 * The API key is sent in the `x-goog-api-key` header, never in the URL,
 * so it cannot leak through logged URLs or exception messages.
 */
@Component
@ConditionalOnProperty(prefix = "app.ai", name = ["provider"], havingValue = "gemini")
class GeminiProvider(
    restClientBuilder: RestClient.Builder,
    @Value("\${gemini.api-key:}") private val apiKey: String,
    @Value("\${gemini.model:gemini-2.5-flash}") private val model: String,
    @Value("\${gemini.base-url:https://generativelanguage.googleapis.com/v1beta}") baseUrl: String,
    @Value("\${gemini.max-output-tokens:8192}") private val maxOutputTokens: Int,
    @Value("\${gemini.temperature:0.7}") private val temperature: Double
) : AiGenerationPort {

    private val log = LoggerFactory.getLogger(GeminiProvider::class.java)

    private val client: RestClient = restClientBuilder.clone()
        .baseUrl(baseUrl.trimEnd('/'))
        .build()

    init {
        if (apiKey.isBlank()) {
            log.warn("AI provider is 'gemini' but GEMINI_API_KEY is not set: AI endpoints will fail until it is configured.")
        } else {
            log.info("AI provider: Gemini (model={})", model)
        }
    }

    override fun generate(systemPrompt: String, userPrompt: String): String =
        execute("generation", systemPrompt, userPrompt, json = false)

    override fun generateJson(systemPrompt: String, userPrompt: String): String {
        // Same reinforced instruction as the OpenAI provider, on top of Gemini's JSON mode
        // (responseMimeType=application/json).
        val jsonSystemPrompt = """
            $systemPrompt

            CRITICAL: Respond ONLY with valid JSON. No markdown, no backticks, no explanations.
            Your response must start with { and end with }.
        """.trimIndent()

        return execute("JSON generation", jsonSystemPrompt, userPrompt, json = true)
            .trim()
            .removePrefix("```json") // Defensive cleanup in case the model ignores the instructions
            .removePrefix("```")
            .removeSuffix("```")
            .trim()
    }

    private fun execute(operation: String, systemPrompt: String, userPrompt: String, json: Boolean): String {
        if (apiKey.isBlank()) {
            throw InternalException("AI provider 'gemini' is selected but GEMINI_API_KEY is not configured.")
        }

        return runCatching { callGemini(systemPrompt, userPrompt, json) }
            .getOrElse { e ->
                log.error("Gemini $operation failed: ${e.message}", e)
                throw InternalException("AI service unavailable. Please try again later.")
            }
    }

    private fun callGemini(systemPrompt: String, userPrompt: String, json: Boolean): String {
        val generationConfig = linkedMapOf<String, Any>(
            "temperature" to temperature,
            "maxOutputTokens" to maxOutputTokens
        )
        if (json) generationConfig["responseMimeType"] = "application/json"

        val body = mapOf(
            "system_instruction" to mapOf("parts" to listOf(mapOf("text" to systemPrompt))),
            "contents" to listOf(
                mapOf("role" to "user", "parts" to listOf(mapOf("text" to userPrompt)))
            ),
            "generationConfig" to generationConfig
        )

        val response: JsonNode = client.post()
            .uri("/models/{model}:generateContent", model)
            .header("x-goog-api-key", apiKey)
            .contentType(MediaType.APPLICATION_JSON)
            .body(body)
            .retrieve()
            .body(JsonNode::class.java)
            ?: throw InternalException("AI returned empty response")

        // The whole prompt can be rejected by Gemini's safety filters
        val blockReason = response.path("promptFeedback").path("blockReason").asText("")
        if (blockReason.isNotEmpty()) {
            throw InternalException("Gemini blocked the prompt: $blockReason")
        }

        val candidate = response.path("candidates").path(0)
        val text = candidate.path("content").path("parts")
            .filter { it.path("text").isTextual }
            .joinToString("") { it.path("text").asText() }

        if (text.isBlank()) {
            val finishReason = candidate.path("finishReason").asText("UNKNOWN")
            throw InternalException("AI returned empty response (finishReason=$finishReason)")
        }
        return text
    }
}
