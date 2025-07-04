
---
title: "Gemini models  |  Gemini API  |  Google AI for Developers"
source: "https://ai.google.dev/gemini-api/docs/models"
author:
published:
created: 2025-07-01
description: "Learn about Google's most advanced AI models including Gemini 2.5 Pro"
tags:
  - "clippings"
---
## Model variants

The Gemini API offers different models that are optimized for specific use cases. Here's a brief overview of Gemini variants that are available:

| Model variant                                                                                                                                                                                                   | Input(s)                             | Output                      | Optimized for                                                                        |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------ | --------------------------- | ------------------------------------------------------------------------------------ |
| [Gemini 2.5 Pro](https://ai.google.dev/gemini-api/docs/#gemini-2.5-pro)   `gemini-2.5-pro`                                                                                                                       | Audio, images, videos, text, and PDF | Text                        | Enhanced thinking and reasoning, multimodal understanding, advanced coding, and more |
| [Gemini 2.5 Flash](https://ai.google.dev/gemini-api/docs/#gemini-2.5-flash)   `gemini-2.5-flash`                                                                                                                 | Audio, images, videos, and text      | Text                        | Adaptive thinking, cost efficiency                                                   |
| [Gemini 2.5 Flash-Lite Preview](https://ai.google.dev/gemini-api/docs/#gemini-2.5-flash-lite)   `gemini-2.5-flash-lite-preview-06-17`                                                                            | Text, image, video, audio            | Text                        | Most cost-efficient model supporting high throughput                                 |
| [Gemini 2.5 Flash Native Audio](https://ai.google.dev/gemini-api/docs/#gemini-2.5-flash-native-audio)   `gemini-2.5-flash-preview-native-audio-dialog` &   `gemini-2.5-flash-exp-native-audio-thinking-dialog` | Audio, videos, and text              | Text and audio, interleaved | High quality, natural conversational audio outputs, with or without thinking         |
| [Gemini 2.5 Flash Preview TTS](https://ai.google.dev/gemini-api/docs/#gemini-2.5-flash-preview-tts)   `gemini-2.5-flash-preview-tts`                                                                             | Text                                 | Audio                       | Low latency, controllable, single- and multi-speaker text-to-speech audio generation |
| [Gemini 2.5 Pro Preview TTS](https://ai.google.dev/gemini-api/docs/#gemini-2.5-pro-preview-tts)   `gemini-2.5-pro-preview-tts`                                                                                   | Text                                 | Audio                       | Low latency, controllable, single- and multi-speaker text-to-speech audio generation |
| [Gemini 2.0 Flash](https://ai.google.dev/gemini-api/docs/#gemini-2.0-flash)   `gemini-2.0-flash`                                                                                                                 | Audio, images, videos, and text      | Text                        | Next generation features, speed, and realtime streaming.                             |
| [Gemini 2.0 Flash Preview Image Generation](https://ai.google.dev/gemini-api/docs/#gemini-2.0-flash-preview-image-generation)   `gemini-2.0-flash-preview-image-generation`                                      | Audio, images, videos, and text      | Text, images                | Conversational image generation and editing                                          |
| [Gemini 2.0 Flash-Lite](https://ai.google.dev/gemini-api/docs/#gemini-2.0-flash-lite)   `gemini-2.0-flash-lite`                                                                                                  | Audio, images, videos, and text      | Text                        | Cost efficiency and low latency                                                      |
| [Gemini 1.5 Flash](https://ai.google.dev/gemini-api/docs/#gemini-1.5-flash)   `gemini-1.5-flash`                                                                                                                 | Audio, images, videos, and text      | Text                        | Fast and versatile performance across a diverse variety of tasks                     |
| [Gemini 1.5 Flash-8B](https://ai.google.dev/gemini-api/docs/#gemini-1.5-flash-8b)   `gemini-1.5-flash-8b`                                                                                                        | Audio, images, videos, and text      | Text                        | High volume and lower intelligence tasks                                             |
| [Gemini 1.5 Pro](https://ai.google.dev/gemini-api/docs/#gemini-1.5-pro)   `gemini-1.5-pro`                                                                                                                       | Audio, images, videos, and text      | Text                        | Complex reasoning tasks requiring more intelligence                                  |
| [Gemini Embedding](https://ai.google.dev/gemini-api/docs/#gemini-embedding)   `gemini-embedding-exp`                                                                                                             | Text                                 | Text embeddings             | Measuring the relatedness of text strings                                            |
| [Imagen 4](https://ai.google.dev/gemini-api/docs/#imagen-4)   `imagen-4.0-generate-preview-06-06`   `imagen-4.0-ultra-generate-preview-06-06`                                                                  | Text                                 | Images                      | Our most up-to-date image generation model                                           |
| [Imagen 3](https://ai.google.dev/gemini-api/docs/#imagen-3)   `imagen-3.0-generate-002`                                                                                                                          | Text                                 | Images                      | High quality image generation model                                                  |
| [Veo 2](https://ai.google.dev/gemini-api/docs/#veo-2)   `veo-2.0-generate-001`                                                                                                                                   | Text, images                         | Video                       | High quality video generation                                                        |
| [Gemini 2.5 Flash Live](https://ai.google.dev/gemini-api/docs/#live-api)   `gemini-live-2.5-flash-preview`                                                                                                       | Audio, video, and text               | Text, audio                 | Low-latency bidirectional voice and video interactions                               |
| [Gemini 2.0 Flash Live](https://ai.google.dev/gemini-api/docs/#live-api-2.0)   `gemini-2.0-flash-live-001`                                                                                                       | Audio, video, and text               | Text, audio                 | Low-latency bidirectional voice and video interactions                               |

You can view the rate limits for each model on the [rate limits page](https://ai.google.dev/gemini-api/docs/rate-limits).

### Gemini 2.5 Pro

Gemini 2.5 Pro is our state-of-the-art thinking model, capable of reasoning over complex problems in code, math, and STEM, as well as analyzing large datasets, codebases, and documents using long context.

[Try in Google AI Studio](https://aistudio.google.com/?model=gemini-2.5-pro)

#### Model details

| Property                                                                                           | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| -------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Model code                                                                                         | `gemini-2.5-pro`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| Supported data types                                                                               | ============================**Inputs**============================  ==Audio, images, video, text, and PDF==  ==========================================**Output**==========================================  ==================================Text==================================                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| Token limits`<sup><a href="https://ai.google.dev/gemini-api/docs/#token-size">`[*]`</a></sup>` | ========================================**Input token limit**========================================  ================1,048,576================  ==============================**Output token limit**==============================  ====65,536====                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| Capabilities                                                                                       | ======================**Structured outputs**======================  ============================================================================================================================================Supported============================================================================================================================================  ========================**Caching**========================  Supported  ============================**Tuning**============================  ============================================================================================================Not supported============================================================================================================  ============================**Function calling**============================  Supported  ============================**Code execution**============================  Supported  ========**Search grounding**========  Supported  ==================**Image generation**==================  Not supported  ======================**Audio generation**======================  Not supported  ====================**Live API**====================  Not supported  ====================**Thinking**====================  Supported |
| Versions                                                                                           | Read the[model version patterns](https://ai.google.dev/gemini-api/docs/models/gemini#model-versions) for more details. - `Stable: gemini-2.5-pro` - `Preview: gemini-2.5-pro-preview-06-05` - `Preview: gemini-2.5-pro-preview-05-06` - `Preview: gemini-2.5-pro-preview-03-25`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| Latest update                                                                                      | June 2025                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| Knowledge cutoff                                                                                   | January 2025                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |

### Gemini 2.5 Flash

Our best model in terms of price-performance, offering well-rounded capabilities. 2.5 Flash is best for large scale processing, low-latency, high volume tasks that require thinking, and agentic use cases.

[Try in Google AI Studio](https://aistudio.google.com/?model=gemini-2.5-flash)

#### Model details

| Property                                                                                           | Description                                                                                                                                                                                                                                                                                                                                    |
| -------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Model code                                                                                         | `models/gemini-2.5-flash`                                                                                                                                                                                                                                                                                                                    |
| Supported data types                                                                               | **Inputs**  ==Text, images, video, audio==  **Output**  Text                                                                                                                                                                                                                                                                             |
| Token limits`<sup><a href="https://ai.google.dev/gemini-api/docs/#token-size">`[*]`</a></sup>` | **Input token limit**  1,048,576  **Output token limit**  65,536                                                                                                                                                                                                                                                                   |
| Capabilities                                                                                       | **Audio generation**  Not supported  **Caching**  Supported  **Code execution**  Supported  **Function calling**  Supported  **Image generation**  Not supported  **Search grounding**  Supported  **Structured outputs**  Supported  **Thinking**  Supported  **Tuning**  Not supported |
| Versions                                                                                           | Read the[model version patterns](https://ai.google.dev/gemini-api/docs/models/gemini#model-versions) for more details. - Stable: `gemini-2.5-flash` - Preview: `gemini-2.5-flash-preview-05-20`                                                                                                                                               |
| Latest update                                                                                      | June 2025                                                                                                                                                                                                                                                                                                                                      |
| Knowledge cutoff                                                                                   | January 2025                                                                                                                                                                                                                                                                                                                                   |

### Gemini 2.5 Flash-Lite Preview

A Gemini 2.5 Flash model optimized for cost efficiency and low latency.

[Try in Google AI Studio](https://aistudio.google.com/?model=gemini-2.5-flash-lite-preview-06-17)

#### Model details

| Property                                                                                           | Description                                                                                                                                                                                                                                                                                                                                                                               |
| -------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Model code                                                                                         | `models/gemini-2.5-flash-lite-preview-06-17`                                                                                                                                                                                                                                                                                                                                            |
| Supported data types                                                                               | **Inputs**  ==Text, images, video, and audio==  **Output**  Text                                                                                                                                                                                                                                                                                                                    |
| Token limits`<sup><a href="https://ai.google.dev/gemini-api/docs/#token-size">`[*]`</a></sup>` | **Input token limit**  ==1,000,000==  **Output token limit**  ==64,000==                                                                                                                                                                                                                                                                                                            |
| Capabilities                                                                                       | **Structured outputs**  Supported  **Caching**  Supported  **Tuning**  Not supported  **Function calling**  Supported  **Code execution**  Supported  ==**URL Context**==  Supported  **Search grounding**  Supported  **Image generation**  Not supported  **Audio generation**  Not supported  **Live API**  Not supported  **Thinking**  Supported |
| Versions                                                                                           | Read the[model version patterns](https://ai.google.dev/gemini-api/docs/models/gemini#model-versions) for more details. - Preview: `gemini-2.5-flash-lite-preview-06-17`                                                                                                                                                                                                                    |
| Latest update                                                                                      | June 2025                                                                                                                                                                                                                                                                                                                                                                                 |
| Knowledge cutoff                                                                                   | January 2025                                                                                                                                                                                                                                                                                                                                                                              |

### Gemini 2.5 Flash Native Audio

Our native audio dialog models, with and without thinking, available through the [Live API](https://ai.google.dev/gemini-api/docs/live). These models provide interactive and unstructured conversational experiences, with style and control prompting.

[Try native audio in Google AI Studio](https://aistudio.google.com/app/live)

#### Model details

| Property                                                                                           | Description                                                                                                                                                                                                                                                                                                                                            |
| -------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Model code                                                                                         | `models/gemini-2.5-flash-preview-native-audio-dialog` &   `models/gemini-2.5-flash-exp-native-audio-thinking-dialog`                                                                                                                                                                                                                               |
| Supported data types                                                                               | **Inputs**  ==Audio, video, text==  **Output**  ==Audio and text==                                                                                                                                                                                                                                                                               |
| Token limits`<sup><a href="https://ai.google.dev/gemini-api/docs/#token-size">`[*]`</a></sup>` | **Input token limit**  ==128,000==  **Output token limit**  ======8,000======                                                                                                                                                                                                                                                                    |
| Capabilities                                                                                       | **Audio generation**  Supported  **Caching**  Not supported  **Code execution**  Not supported  **Function calling**  Supported  **Image generation**  Not supported  **Search grounding**  Supported  **Structured outputs**  Not supported  **Thinking**  Supported  **Tuning**  Not supported |
| Versions                                                                                           | Read the[model version patterns](https://ai.google.dev/gemini-api/docs/models/gemini#model-versions) for more details. - Preview: `gemini-2.5-flash-preview-05-20` - Experimental: `gemini-2.5-flash-exp-native-audio-thinking-dialog`                                                                                                                |
| Latest update                                                                                      | May 2025                                                                                                                                                                                                                                                                                                                                               |
| Knowledge cutoff                                                                                   | January 2025                                                                                                                                                                                                                                                                                                                                           |

### Gemini 2.5 Flash Preview Text-to-Speech

Gemini 2.5 Flash Preview TTS is our price-performant text-to-speech model, delivering high control and transparency for structured workflows like podcast generation, audiobooks, customer support, and more. Gemini 2.5 Flash rate limits are more restricted since it is an experimental / preview model.

[Try in Google AI Studio](https://aistudio.google.com/generate-speech)

#### Model details

| Property                                                                                           | Description                                                                                                                                                                                                                                                                                                                                                |
| -------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Model code                                                                                         | `models/gemini-2.5-flash-preview-tts`                                                                                                                                                                                                                                                                                                                    |
| Supported data types                                                                               | **Inputs**  Text  **Output**  ====Audio====                                                                                                                                                                                                                                                                                                    |
| Token limits`<sup><a href="https://ai.google.dev/gemini-api/docs/#token-size">`[*]`</a></sup>` | **Input token limit**  8,000  **Output token limit**  ====16,000====                                                                                                                                                                                                                                                                           |
| Capabilities                                                                                       | **Structured outputs**  Not supported  **Caching**  Not supported  **Tuning**  Not supported  **Function calling**  Not supported  **Code execution**  Not supported  ==============**Search**==============  Not supported  **Audio generation**  Supported  **Live API**  Not supported  **Thinking**  Not supported |
| Versions                                                                                           | Read the[model version patterns](https://ai.google.dev/gemini-api/docs/models/gemini#model-versions) for more details. - `gemini-2.5-flash-preview-tts`                                                                                                                                                                                                     |
| Latest update                                                                                      | May 2025                                                                                                                                                                                                                                                                                                                                                   |

### Gemini 2.5 Pro Preview Text-to-Speech

Gemini 2.5 Pro Preview TTS is our most powerful text-to-speech model, delivering high control and transparency for structured workflows like podcast generation, audiobooks, customer support, and more. Gemini 2.5 Pro rate limits are more restricted since it is an experimental / preview model.

[Try in Google AI Studio](https://aistudio.google.com/generate-speech)

#### Model details

| Property                                                                                           | Description                                                                                                                                                                                                                                                                                                                                      |
| -------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Model code                                                                                         | `models/gemini-2.5-pro-preview-tts`                                                                                                                                                                                                                                                                                                            |
| Supported data types                                                                               | **Inputs**  Text  **Output**  Audio                                                                                                                                                                                                                                                                                                  |
| Token limits`<sup><a href="https://ai.google.dev/gemini-api/docs/#token-size">`[*]`</a></sup>` | **Input token limit**  8,000  **Output token limit**  16,000                                                                                                                                                                                                                                                                         |
| Capabilities                                                                                       | **Structured outputs**  Not supported  **Caching**  Not supported  **Tuning**  Not supported  **Function calling**  Not supported  **Code execution**  Not supported  **Search**  Not supported  **Audio generation**  Supported  **Live API**  Not supported  **Thinking**  Not supported |
| Versions                                                                                           | Read the[model version patterns](https://ai.google.dev/gemini-api/docs/models/gemini#model-versions) for more details. - `gemini-2.5-pro-preview-tts`                                                                                                                                                                                             |
| Latest update                                                                                      | May 2025                                                                                                                                                                                                                                                                                                                                         |

### Gemini 2.0 Flash

Gemini 2.0 Flash delivers next-gen features and improved capabilities, including superior speed, native tool use, and a 1M token context window.

[Try in Google AI Studio](https://aistudio.google.com/?model=gemini-2.0-flash-001)

#### Model details

| Property                                                                                           | Description                                                                                                                                                                                                                                                                                                                                                                |
| -------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Model code                                                                                         | `models/gemini-2.0-flash`                                                                                                                                                                                                                                                                                                                                                |
| Supported data types                                                                               | **Inputs**  ============Audio, images, video, and text============  **Output**  Text                                                                                                                                                                                                                                                                                 |
| Token limits`<sup><a href="https://ai.google.dev/gemini-api/docs/#token-size">`[*]`</a></sup>` | **Input token limit**  1,048,576  **Output token limit**  ==================8,192==================                                                                                                                                                                                                                                                            |
| Capabilities                                                                                       | **Structured outputs**  Supported  **Caching**  Supported  **Tuning**  Not supported  **Function calling**  Supported  **Code execution**  Supported  **Search**  Supported  **Image generation**  Not supported  **Audio generation**  Not supported  **Live API**  Supported  **Thinking**  ==Experimental== |
| Versions                                                                                           | Read the[model version patterns](https://ai.google.dev/gemini-api/docs/models/gemini#model-versions) for more details. - Latest: `gemini-2.0-flash` - Stable: `gemini-2.0-flash-001` - Experimental: `gemini-2.0-flash-exp`                                                                                                                                             |
| Latest update                                                                                      | February 2025                                                                                                                                                                                                                                                                                                                                                              |
| Knowledge cutoff                                                                                   | August 2024                                                                                                                                                                                                                                                                                                                                                                |

### Gemini 2.0 Flash Preview Image Generation

Gemini 2.0 Flash Preview Image Generation delivers improved image generation features, including generating and editing images conversationally.

[Try in Google AI Studio](https://aistudio.google.com/?model=gemini-2.0-flash-preview-image-generation)

#### Model details

| Property                                                                                           | Description                                                                                                                                                                                                                                                                                                                                                           |
| -------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Model code                                                                                         | `models/gemini-2.0-flash-preview-image-generation`                                                                                                                                                                                                                                                                                                                  |
| Supported data types                                                                               | **Inputs**  Audio, images, video, and text  **Output**  ==Text and images==                                                                                                                                                                                                                                                                               |
| Token limits`<sup><a href="https://ai.google.dev/gemini-api/docs/#token-size">`[*]`</a></sup>` | **Input token limit**  ==32,000==  **Output token limit**  8,192                                                                                                                                                                                                                                                                                                |
| Capabilities                                                                                       | **Structured outputs**  Supported  **Caching**  Supported  **Tuning**  Not supported  **Function calling**  Not supported  **Code execution**  ========Not Supported========  **Search**  Not Supported  **Image generation**  Supported  **Audio generation**  Not supported  **Live API**  Not Supported  **Thinking**  Not Supported |
| Versions                                                                                           | Read the[model version patterns](https://ai.google.dev/gemini-api/docs/models/gemini#model-versions) for more details. - Preview: `gemini-2.0-flash-preview-image-generation`  ==gemini-2.0-flash-preview-image-generation is not currently supported in a number of countries in Europe, Middle East & Africa==                                                       |
| Latest update                                                                                      | May 2025                                                                                                                                                                                                                                                                                                                                                              |
| Knowledge cutoff                                                                                   | August 2024                                                                                                                                                                                                                                                                                                                                                           |

### Gemini 2.0 Flash-Lite

A Gemini 2.0 Flash model optimized for cost efficiency and low latency.

[Try in Google AI Studio](https://aistudio.google.com/?model=gemini-2.0-flash-lite)

#### Model details

| Property                                                                                           | Description                                                                                                                                                                                                                                                                                                                                      |
| -------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Model code                                                                                         | `models/gemini-2.0-flash-lite`                                                                                                                                                                                                                                                                                                                 |
| Supported data types                                                                               | **Inputs**  Audio, images, video, and text  **Output**  Text                                                                                                                                                                                                                                                                         |
| Token limits`<sup><a href="https://ai.google.dev/gemini-api/docs/#token-size">`[*]`</a></sup>` | **Input token limit**  1,048,576  **Output token limit**  8,192                                                                                                                                                                                                                                                                      |
| Capabilities                                                                                       | **Structured outputs**  Supported  **Caching**  Supported  **Tuning**  Not supported  **Function calling**  Supported  **Code execution**  Not supported  **Search**  Not supported  **Image generation**  Not supported  **Audio generation**  Not supported  **Live API**  Not supported |
| Versions                                                                                           | Read the[model version patterns](https://ai.google.dev/gemini-api/docs/models/gemini#model-versions) for more details. - Latest: `gemini-2.0-flash-lite` - Stable: `gemini-2.0-flash-lite-001`                                                                                                                                                  |
| Latest update                                                                                      | February 2025                                                                                                                                                                                                                                                                                                                                    |
| Knowledge cutoff                                                                                   | August 2024                                                                                                                                                                                                                                                                                                                                      |

### Gemini 1.5 Flash

Gemini 1.5 Flash is a fast and versatile multimodal model for scaling across diverse tasks.

[Try in Google AI Studio](https://aistudio.google.com/?model=gemini-1.5-flash)

#### Model details

| Property                                                                                           | Description                                                                                                                                                                                                                                                                                                                           |
| -------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Model code                                                                                         | `models/gemini-1.5-flash`                                                                                                                                                                                                                                                                                                           |
| Supported data types                                                                               | **Inputs**  Audio, images, video, and text  **Output**  Text                                                                                                                                                                                                                                                              |
| Token limits`<sup><a href="https://ai.google.dev/gemini-api/docs/#token-size">`[*]`</a></sup>` | **Input token limit**  1,048,576  **Output token limit**  8,192                                                                                                                                                                                                                                                           |
| Audio/visual specs                                                                                 | ======**Maximum number of images per prompt**======  ====3,600====  ======**Maximum video length**======  ====1 hour====  ======**Maximum audio length**======  ====Approximately 9.5 hours====                                                                                                                                 |
| Capabilities                                                                                       | ======**System instructions**======  Supported  ======**JSON mode**======  Supported  ======**JSON schema**======  Supported  ======**Adjustable safety settings**======  Supported  **Caching**  Supported  **Tuning**  Supported  **Function calling**  Supported  **Code execution**  Supported  **Live API**  Not supported |
| Versions                                                                                           | Read the[model version patterns](https://ai.google.dev/gemini-api/docs/models/gemini#model-versions) for more details. - Latest: `gemini-1.5-flash-latest` - Latest stable: `gemini-1.5-flash` - Stable: - `gemini-1.5-flash-001` 	- `gemini-1.5-flash-002`                                                                      |
| Latest update                                                                                      | September 2024                                                                                                                                                                                                                                                                                                                        |

### Gemini 1.5 Flash-8B

Gemini 1.5 Flash-8B is a small model designed for lower intelligence tasks.

[Try in Google AI Studio](https://aistudio.google.com/?model=gemini-1.5-flash)

#### Model details

| Property                                                                                           | Description                                                                                                                                                                                                                                                                                                                           |
| -------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Model code                                                                                         | `models/gemini-1.5-flash-8b`                                                                                                                                                                                                                                                                                                        |
| Supported data types                                                                               | **Inputs**  Audio, images, video, and text  **Output**  Text                                                                                                                                                                                                                                                              |
| Token limits`<sup><a href="https://ai.google.dev/gemini-api/docs/#token-size">`[*]`</a></sup>` | **Input token limit**  1,048,576  **Output token limit**  8,192                                                                                                                                                                                                                                                           |
| Audio/visual specs                                                                                 | **Maximum number of images per prompt**  3,600  **Maximum video length**  1 hour  **Maximum audio length**  Approximately 9.5 hours                                                                                                                                                                                 |
| Capabilities                                                                                       | **System instructions**  Supported  **JSON mode**  Supported  **JSON schema**  Supported  **Adjustable safety settings**  Supported  **Caching**  Supported  **Tuning**  Supported  **Function calling**  Supported  **Code execution**  Supported  **Live API**  Not supported |
| Versions                                                                                           | Read the[model version patterns](https://ai.google.dev/gemini-api/docs/models/gemini#model-versions) for more details. - Latest: `gemini-1.5-flash-8b-latest` - Latest stable: `gemini-1.5-flash-8b` - Stable: - `gemini-1.5-flash-8b-001`                                                                                         |
| Latest update                                                                                      | October 2024                                                                                                                                                                                                                                                                                                                          |

### Gemini 1.5 Pro

Try [Gemini 2.5 Pro Preview](https://ai.google.dev/gemini-api/docs/models/experimental-models#available-models), our most advanced Gemini model to date.

Gemini 1.5 Pro is a mid-size multimodal model that is optimized for a wide-range of reasoning tasks. 1.5 Pro can process large amounts of data at once, including 2 hours of video, 19 hours of audio, codebases with 60,000 lines of code, or 2,000 pages of text.

[Try in Google AI Studio](https://aistudio.google.com/?model=gemini-1.5-pro)

#### Model details

| Property                                                                                           | Description                                                                                                                                                                                                                                                                                                                               |
| -------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Model code                                                                                         | `models/gemini-1.5-pro`                                                                                                                                                                                                                                                                                                                 |
| Supported data types                                                                               | **Inputs**  Audio, images, video, and text  **Output**  Text                                                                                                                                                                                                                                                                  |
| Token limits`<sup><a href="https://ai.google.dev/gemini-api/docs/#token-size">`[*]`</a></sup>` | **Input token limit**  ==2,097,152==  **Output token limit**  8,192                                                                                                                                                                                                                                                                 |
| Audio/visual specs                                                                                 | **Maximum number of images per prompt**  ==7,200==  **Maximum video length**  ==2 hours==  **Maximum audio length**  ==Approximately 19 hours==                                                                                                                                                                                     |
| Capabilities                                                                                       | **System instructions**  Supported  **JSON mode**  Supported  **JSON schema**  Supported  **Adjustable safety settings**  Supported  **Caching**  Supported  **Tuning**  Not supported  **Function calling**  Supported  **Code execution**  Supported  **Live API**  Not supported |
| Versions                                                                                           | Read the[model version patterns](https://ai.google.dev/gemini-api/docs/models/gemini#model-versions) for more details. - Latest: `gemini-1.5-pro-latest` - Latest stable: `gemini-1.5-pro` - Stable: - `gemini-1.5-pro-001` 	- `gemini-1.5-pro-002`                                                                                  |
| Latest update                                                                                      | September 2024                                                                                                                                                                                                                                                                                                                            |

### Imagen 4

Imagen 4 is our latest image model, capable of generating highly detailed images with rich lighting, significantly better text rendering, and higher resolution output than previous models.

##### Model details

| Property                                                                                           | Description                                                                                                                   |
| -------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| Model code                                                                                         | ==========**Gemini API**==========  `imagen-4.0-generate-preview-06-06`   `imagen-4.0-ultra-generate-preview-06-06` |
| Supported data types                                                                               | ==============**Input**==============  Text  **Output**  ====Images====                                                 |
| Token limits`<sup><a href="https://ai.google.dev/gemini-api/docs/#token-size">`[*]`</a></sup>` | **Input token limit**  ==480 tokens (text)==  ====**Output images**====  1 (Ultra)   1 to 4 (Standard)                  |
| Latest update                                                                                      | June 2025                                                                                                                     |

### Imagen 3

Imagen 3 is our highest quality text-to-image model, capable of generating images with even better detail, richer lighting and fewer distracting artifacts than our previous models.

##### Model details

| Property                                                                                           | Description                                                              |
| -------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| Model code                                                                                         | **Gemini API**  ==`imagen-3.0-generate-002`==                    |
| Supported data types                                                                               | **Input**  Text  **Output**  Images                          |
| Token limits`<sup><a href="https://ai.google.dev/gemini-api/docs/#token-size">`[*]`</a></sup>` | **Input token limit**  ====N/A====  **Output images**  ==Up to 4== |
| Latest update                                                                                      | February 2025                                                            |

### Veo 2

Veo 2 is our high quality text- and image-to-video model, capable of generating detailed videos, capturing the artistic nuance in your prompts.

##### Model details

| Property             | Description                                                                                                                                           |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| Model code           | **Gemini API**  ==`veo-2.0-generate-001`==                                                                                                    |
| Supported data types | **Input**  ==Text, image==  **Output**  ==Video==                                                                                               |
| Limits               | ==**Text input**==  N/A  ==**Image input**==  ==Any image resolution and aspect ratio up to 20MB file size==  ==**Output video**==  ==Up to 2== |
| Latest update        | April 2025                                                                                                                                            |

### Gemini 2.5 Flash Live

The Gemini 2.5 Flash Live model works with the Live API to enable low-latency bidirectional voice and video interactions with Gemini. The model can process text, audio, and video input, and it can provide text and audio output.

[Try in Google AI Studio](https://aistudio.google.com/?model=gemini-live-2.5-flash-preview)

#### Model details

| Property                                                                                           | Description                                                                                                                                                                                                                                                                                            |
| -------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Model code                                                                                         | `models/gemini-live-2.5-flash-preview`                                                                                                                                                                                                                                                               |
| Supported data types                                                                               | **Inputs**  ====Audio, video, and text====  **Output**  ====Text, and audio====                                                                                                                                                                                                                  |
| Token limits`<sup><a href="https://ai.google.dev/gemini-api/docs/#token-size">`[*]`</a></sup>` | **Input token limit**  1,048,576  **Output token limit**  8,192                                                                                                                                                                                                                            |
| Capabilities                                                                                       | **Structured outputs**  Supported  **Tuning**  Not supported  **Function calling**  Supported  **Code execution**  Supported  **Search**  Supported  **Image generation**  Not supported  **Audio generation**  Supported  **Thinking**  Not supported |
| Versions                                                                                           | Read the[model version patterns](https://ai.google.dev/gemini-api/docs/models/gemini#model-versions) for more details. - Preview: `gemini-live-2.5-flash-preview`                                                                                                                                       |
| Latest update                                                                                      | June 2025                                                                                                                                                                                                                                                                                              |
| Knowledge cutoff                                                                                   | January 2025                                                                                                                                                                                                                                                                                           |

### Gemini 2.0 Flash Live

The Gemini 2.0 Flash Live model works with the Live API to enable low-latency bidirectional voice and video interactions with Gemini. The model can process text, audio, and video input, and it can provide text and audio output.

[Try in Google AI Studio](https://aistudio.google.com/?model=gemini-2.0-flash-live-001)

#### Model details

| Property                                                                                           | Description                                                                                                                                                                                                                                                                                            |
| -------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Model code                                                                                         | `models/gemini-2.0-flash-live-001`                                                                                                                                                                                                                                                                   |
| Supported data types                                                                               | **Inputs**  Audio, video, and text  **Output**  Text, and audio                                                                                                                                                                                                                            |
| Token limits`<sup><a href="https://ai.google.dev/gemini-api/docs/#token-size">`[*]`</a></sup>` | **Input token limit**  1,048,576  **Output token limit**  8,192                                                                                                                                                                                                                            |
| Capabilities                                                                                       | **Structured outputs**  Supported  **Tuning**  Not supported  **Function calling**  Supported  **Code execution**  Supported  **Search**  Supported  **Image generation**  Not supported  **Audio generation**  Supported  **Thinking**  Not supported |
| Versions                                                                                           | Read the[model version patterns](https://ai.google.dev/gemini-api/docs/models/gemini#model-versions) for more details. - Preview: `gemini-2.0-flash-live-001`                                                                                                                                           |
| Latest update                                                                                      | April 2025                                                                                                                                                                                                                                                                                             |
| Knowledge cutoff                                                                                   | August 2024                                                                                                                                                                                                                                                                                            |

### Gemini Embedding Experimental

`Gemini embedding` achieves a [SOTA performance](https://deepmind.google/research/publications/157741/) across many key dimensions including code, multi-lingual, and retrieval. Gemini Embedding rate limits are more restricted since it is an experimental model.

##### Model details

| Property                                                                                           | Description                                                                                                                |
| -------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| Model code                                                                                         | **Gemini API**  ==`gemini-embedding-exp-03-07`==                                                                   |
| Supported data types                                                                               | **Input**  Text  **Output**  ======Text embeddings======                                                       |
| Token limits`<sup><a href="https://ai.google.dev/gemini-api/docs/#token-size">`[*]`</a></sup>` | **Input token limit**  8,192  ======**Output dimension size**======  ==Elastic, supports: 3072, 1536, or 768== |
| Latest update                                                                                      | March 2025                                                                                                                 |

### Text Embedding and Embedding

#### Text Embedding

Try our new [experimental Gemini embedding model](https://developers.googleblog.com/en/gemini-embedding-text-model-now-available-gemini-api/) which achieves state-of-the-art performance.

[Text embeddings](https://ai.google.dev/gemini-api/docs/embeddings) are used to measure the relatedness of strings and are widely used in many AI applications.

`text-embedding-004` achieves a [stronger retrieval performance and outperforms existing models](https://arxiv.org/pdf/2403.20327) with comparable dimensions, on the standard MTEB embedding benchmarks.

##### Model details

| Property                                                                                            | Description                                                                        |
| --------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| Model code                                                                                          | **Gemini API**  ==`models/text-embedding-004`==                            |
| Supported data types                                                                                | **Input**  Text  **Output**  Text embeddings                           |
| Token limits`<sup><a href="https://ai.google.dev/gemini-api/docs/#token-size">`[*]`</a></sup>`  | **Input token limit**  ====2,048====  **Output dimension size**  ====768==== |
| Rate limits`<sup><a href="https://ai.google.dev/gemini-api/docs/#rate-limits">`[**]`</a></sup>` | 1,500 requests per minute                                                          |
| Adjustable safety settings                                                                          | Not supported                                                                      |
| Latest update                                                                                       | April 2024                                                                         |

#### Embedding

You can use the Embedding model to generate [text embeddings](https://ai.google.dev/gemini-api/docs/embeddings) for input text.

The Embedding model is optimized for creating embeddings with 768 dimensions for text of up to 2,048 tokens.

##### Embedding model details

| Property                                                                                            | Description                                                              |
| --------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| Model code                                                                                          | `models/embedding-001`                                                 |
| Supported data types                                                                                | **Input**  Text  **Output**  Text embeddings                 |
| Token limits`<sup><a href="https://ai.google.dev/gemini-api/docs/#token-size">`[*]`</a></sup>`  | **Input token limit**  2,048  **Output dimension size**  768 |
| Rate limits`<sup><a href="https://ai.google.dev/gemini-api/docs/#rate-limits">`[**]`</a></sup>` | 1,500 requests per minute                                                |
| Adjustable safety settings                                                                          | Not supported                                                            |
| Latest update                                                                                       | December 2023                                                            |

### AQA

You can use the AQA model to perform [Attributed Question-Answering](https://ai.google.dev/gemini-api/docs/semantic_retrieval) (AQA)–related tasks over a document, corpus, or a set of passages. The AQA model returns answers to questions that are grounded in provided sources, along with estimating answerable probability.

#### Model details

| Property                                                                                            | Description                                                               |
| --------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| Model code                                                                                          | `models/aqa`                                                            |
| Supported data types                                                                                | **Input**  Text  **Output**  Text                             |
| Supported language                                                                                  | English                                                                   |
| Token limits`<sup><a href="https://ai.google.dev/gemini-api/docs/#token-size">`[*]`</a></sup>`  | **Input token limit**  ==7,168==  **Output token limit**  ==1,024== |
| Rate limits`<sup><a href="https://ai.google.dev/gemini-api/docs/#rate-limits">`[**]`</a></sup>` | 1,500 requests per minute                                                 |
| Adjustable safety settings                                                                          | Supported                                                                 |
| Latest update                                                                                       | December 2023                                                             |

See the [examples](https://ai.google.dev/examples) to explore the capabilities of these model variations.

\[\*\] A token is equivalent to about 4 characters for Gemini models. 100 tokens are about 60-80 English words.

## Model version name patterns

Gemini models are available in either *stable*, *preview*, or *experimental* versions. In your code, you can use one of the following model name formats to specify which model and version you want to use.

### Latest stable

Points to the most recent stable version released for the specified model generation and variation.

To specify the latest stable version, use the following pattern:`<model>-<generation>-<variation>`. For example, `gemini-2.0-flash`.

### Stable

Points to a specific stable model. Stable models usually don't change. Most production apps should use a specific stable model.

To specify a stable version, use the following pattern:`<model>-<generation>-<variation>-<version>`. For example,`gemini-2.0-flash-001`.

### Preview

Points to a preview model which may not be suitable for production use, come with more restrictive rate limits, but may have billing enabled.

To specify a preview version, use the following pattern:`<model>-<generation>-<variation>-<version>`. For example,`gemini-2.5-pro-preview-06-05`.

### Experimental

Points to an experimental model which may not be suitable for production use and come with more restrictive rate limits. We release experimental models to gather feedback and get our latest updates into the hands of developers quickly.

To specify an experimental version, use the following pattern:`<model>-<generation>-<variation>-<version>`. For example,`gemini-2.0-pro-exp-02-05`.

## Experimental models

In addition to stable models, the Gemini API offers experimental models which may not be suitable for production use and come with more restrictive rate limits.

We release experimental models to gather feedback, get our latest updates into the hands of developers quickly, and highlight the pace of innovation happening at Google. What we learn from experimental launches informs how we release models more widely. An experimental model can be swapped for another without prior notice. We don't guarantee that an experimental model will become a stable model in the future.

### Previous experimental models

As new versions or stable releases become available, we remove and replace experimental models. You can find the previous experimental models we released in the following section along with the replacement version:

| Model code                                | Base model                  | Replacement version                           |
| ----------------------------------------- | --------------------------- | --------------------------------------------- |
| `gemini-2.5-flash-preview-04-17`        | Gemini 2.5 Flash            | `gemini-2.5-flash-preview-05-20`            |
| `gemini-2.0-flash-exp-image-generation` | Gemini 2.0 Flash            | `gemini-2.0-flash-preview-image-generation` |
| `gemini-2.5-pro-preview-06-05`          | Gemini 2.5 Pro              | `gemini-2.5-pro`                            |
| `gemini-2.5-pro-preview-05-06`          | Gemini 2.5 Pro              | `gemini-2.5-pro`                            |
| `gemini-2.5-pro-preview-03-25`          | Gemini 2.5 Pro              | `gemini-2.5-pro`                            |
| `gemini-2.0-flash-thinking-exp-01-21`   | Gemini 2.5 Flash            | `gemini-2.5-flash-preview-04-17`            |
| `gemini-2.0-pro-exp-02-05`              | Gemini 2.0 Pro Experimental | `gemini-2.5-pro-preview-03-25`              |
| `gemini-2.0-flash-exp`                  | Gemini 2.0 Flash            | `gemini-2.0-flash`                          |
| `gemini-exp-1206`                       | Gemini 2.0 Pro              | `gemini-2.0-pro-exp-02-05`                  |
| `gemini-2.0-flash-thinking-exp-1219`    | Gemini 2.0 Flash Thinking   | `gemini-2.0-flash-thinking-exp-01-21`       |
| `gemini-exp-1121`                       | Gemini                      | `gemini-exp-1206`                           |
| `gemini-exp-1114`                       | Gemini                      | `gemini-exp-1206`                           |
| `gemini-1.5-pro-exp-0827`               | Gemini 1.5 Pro              | `gemini-exp-1206`                           |
| `gemini-1.5-pro-exp-0801`               | Gemini 1.5 Pro              | `gemini-exp-1206`                           |
| `gemini-1.5-flash-8b-exp-0924`          | Gemini 1.5 Flash-8B         | `gemini-1.5-flash-8b`                       |
| `gemini-1.5-flash-8b-exp-0827`          | Gemini 1.5 Flash-8B         | `gemini-1.5-flash-8b`                       |

## Supported languages

Gemini models are trained to work with the following languages:

- Arabic (`ar`)
- Bengali (`bn`)
- Bulgarian (`bg`)
- Chinese simplified and traditional (`zh`)
- Croatian (`hr`)
- Czech (`cs`)
- Danish (`da`)
- Dutch (`nl`)
- English (`en`)
- Estonian (`et`)
- Finnish (`fi`)
- French (`fr`)
- German (`de`)
- Greek (`el`)
- Hebrew (`iw`)
- Hindi (`hi`)
- Hungarian (`hu`)
- Indonesian (`id`)
- Italian (`it`)
- Japanese (`ja`)
- Korean (`ko`)
- Latvian (`lv`)
- Lithuanian (`lt`)
- Norwegian (`no`)
- Polish (`pl`)
- Portuguese (`pt`)
- Romanian (`ro`)
- Russian (`ru`)
- Serbian (`sr`)
- Slovak (`sk`)
- Slovenian (`sl`)
- Spanish (`es`)
- Swahili (`sw`)
- Swedish (`sv`)
- Thai (`th`)
- Turkish (`tr`)
- Ukrainian (`uk`)
- Vietnamese (`vi`)

Except as otherwise noted, the content of this page is licensed under the [Creative Commons Attribution 4.0 License](https://creativecommons.org/licenses/by/4.0/), and code samples are licensed under the [Apache 2.0 License](https://www.apache.org/licenses/LICENSE-2.0). For details, see the [Google Developers Site Policies](https://developers.google.com/site-policies). Java is a registered trademark of Oracle and/or its affiliates.

Last updated 2025-06-26 UTC.

The new page has loaded.
