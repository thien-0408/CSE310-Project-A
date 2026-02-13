using backend.Models.GeminiDtos;
using System.Text;
using System.Text.Json;

namespace backend.Services
{
    public class GeminiService
    {
        private readonly HttpClient _httpClient;
        private readonly string _apiKey;

        private const string BaseUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

        public GeminiService(HttpClient httpClient, IConfiguration configuration)
        {
            _httpClient = httpClient;
            _apiKey = configuration["Gemini:ApiKey"];
        }

        public async Task<string> AnalyzeAudioAsync(byte[] audioBytes, string prompt)
        {
            var base64Audio = Convert.ToBase64String(audioBytes);

            var requestBody = new GeminiRequest
            {
                contents = new List<Content>
            {
                new Content
                {
                    parts = new List<Part>
                    {
                        new Part { text = prompt },
                        new Part
                        {
                            inline_data = new InlineData
                            {
                                mime_type = "audio/wav",
                                data = base64Audio
                            }
                        }
                    }
                }
            }
            };

            var jsonContent = new StringContent(
                JsonSerializer.Serialize(requestBody),
                Encoding.UTF8,
                "application/json");

            var response = await _httpClient.PostAsync($"{BaseUrl}?key={_apiKey}", jsonContent);

            var responseString = await response.Content.ReadAsStringAsync();

            if (!response.IsSuccessStatusCode)
            {
                throw new Exception($"Gemini API Error ({response.StatusCode}): {responseString}");
            }

            var result = JsonSerializer.Deserialize<GeminiResponse>(responseString);

            return result?.candidates?.FirstOrDefault()?.content?.parts?.FirstOrDefault()?.text ?? "No response content found.";
        }
        public async Task<List<string>> GetGenerateContentModels()
        {
            var response = await _httpClient.GetAsync(
                $"https://generativelanguage.googleapis.com/v1beta/models?key={_apiKey}"
            );

            var json = await response.Content.ReadAsStringAsync();
            var root = JsonSerializer.Deserialize<JsonElement>(json);

            List<string> models = new();
            foreach (var m in root.GetProperty("models").EnumerateArray())
            {
                var supported = m.GetProperty("supportedGenerationMethods")
                                 .EnumerateArray()
                                 .Select(x => x.GetString())
                                 .ToList();
                if (supported.Contains("generateContent"))
                {
                    models.Add(m.GetProperty("name").GetString());
                }
            }
            return models;
        }

        public async Task<string> EvaluateWritingAsync(byte[]? imageBytes, string question, string essay, string taskType)
        {
            var systemPrompt = $@"
            You are an IELTS Writing Examiner. 
            Task Type: {taskType}.
            
            Question: {question}
            Student Essay: {essay}
            
            {(imageBytes != null ? "Note: Use the provided image as the reference for Task 1 data." : "")}

            Please evaluate based on 4 criteria: 
            1. Task Achievement/Response
            2. Coherence and Cohesion
            3. Lexical Resource
            4. Grammatical Range and Accuracy.

            Output strictly in JSON format:
            {{
                ""overall_band"": 8.0,
                ""criteria_scores"": {{
                    ""task_response"": 8.5,
                    ""coherence_cohesion"": 7.5,
                    ""lexical_resource"": 7.5,
                    ""grammar"": 8.0
                }},
                ""feedback"": ""Detailed feedback here...""
            }}
            Do not use markdown code blocks (```json). Just return raw JSON.
        ";

            var parts = new List<Part>();

            parts.Add(new Part { text = systemPrompt });

            if (imageBytes != null && imageBytes.Length > 0)
            {
                parts.Add(new Part
                {
                    inline_data = new InlineData
                    {
                        mime_type = "image/jpeg", 
                        data = Convert.ToBase64String(imageBytes)
                    }
                });
            }

            var requestBody = new GeminiRequest
            {
                contents = new List<Content> { new Content { parts = parts } }
            };

            var jsonContent = new StringContent(
                JsonSerializer.Serialize(requestBody),
                Encoding.UTF8,
                "application/json");

            var response = await _httpClient.PostAsync($"{BaseUrl}?key={_apiKey}", jsonContent);
            var responseString = await response.Content.ReadAsStringAsync();

            if (!response.IsSuccessStatusCode)
            {
                throw new Exception($"Gemini Error: {responseString}");
            }

            var result = JsonSerializer.Deserialize<GeminiResponse>(responseString);
            var textResponse = result?.candidates?.FirstOrDefault()?.content?.parts?.FirstOrDefault()?.text;

            return CleanJsonString(textResponse);
        }

        private string CleanJsonString(string json)
        {
            if (string.IsNullOrEmpty(json)) return "{}";
            json = json.Replace("```json", "").Replace("```", "").Trim();
            return json;
        }
    }
}
