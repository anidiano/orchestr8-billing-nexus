
export interface ApiProvider {
  id: string;
  name: string;
  icon: string;
  description: string;
  authType: 'bearer' | 'api-key' | 'custom';
  baseUrl: string;
  testEndpoint: string;
  keyFormat?: {
    pattern: RegExp;
    placeholder: string;
    example: string;
  };
  customHeaders?: Record<string, string>;
  documentationUrl: string;
}

export interface ApiKeyConfig {
  id: string;
  providerId: string;
  name: string;
  apiKey: string;
  baseUrl?: string;
  customHeaders?: Record<string, string>;
  authType: 'bearer' | 'api-key' | 'custom';
  isActive: boolean;
  lastTested?: string;
  status: 'connected' | 'error' | 'untested';
  errorMessage?: string;
  usage?: {
    requests: number;
    lastUsed: string;
  };
  createdAt: string;
  updatedAt: string;
}

export const AI_PROVIDERS: ApiProvider[] = [
  {
    id: 'openai',
    name: 'OpenAI',
    icon: '🤖',
    description: 'GPT models, DALL-E, Whisper, and more',
    authType: 'bearer',
    baseUrl: 'https://api.openai.com/v1',
    testEndpoint: '/models',
    keyFormat: {
      pattern: /^sk-[a-zA-Z0-9]{48,}$/,
      placeholder: 'sk-...',
      example: 'sk-proj-abcd1234...'
    },
    documentationUrl: 'https://platform.openai.com/docs/api-reference'
  },
  {
    id: 'anthropic',
    name: 'Anthropic Claude',
    icon: '🧠',
    description: 'Claude AI models for advanced reasoning',
    authType: 'api-key',
    baseUrl: 'https://api.anthropic.com',
    testEndpoint: '/v1/messages',
    keyFormat: {
      pattern: /^sk-ant-[a-zA-Z0-9\-_]{95,}$/,
      placeholder: 'sk-ant-...',
      example: 'sk-ant-api03-...'
    },
    customHeaders: {
      'anthropic-version': '2023-06-01'
    },
    documentationUrl: 'https://docs.anthropic.com/claude/reference'
  },
  {
    id: 'cohere',
    name: 'Cohere',
    icon: '🔮',
    description: 'Language AI platform for text generation',
    authType: 'bearer',
    baseUrl: 'https://api.cohere.ai/v1',
    testEndpoint: '/models',
    keyFormat: {
      pattern: /^[a-zA-Z0-9]{40}$/,
      placeholder: 'Your API key',
      example: 'abcd1234efgh5678...'
    },
    documentationUrl: 'https://docs.cohere.com/reference'
  },
  {
    id: 'stability',
    name: 'Stability AI',
    icon: '🎨',
    description: 'Stable Diffusion and image generation',
    authType: 'bearer',
    baseUrl: 'https://api.stability.ai',
    testEndpoint: '/v1/user/account',
    keyFormat: {
      pattern: /^sk-[a-zA-Z0-9]{32,}$/,
      placeholder: 'sk-...',
      example: 'sk-abcd1234...'
    },
    documentationUrl: 'https://platform.stability.ai/docs/api-reference'
  },
  {
    id: 'huggingface',
    name: 'Hugging Face',
    icon: '🤗',
    description: 'Open source AI models and inference',
    authType: 'bearer',
    baseUrl: 'https://api-inference.huggingface.co',
    testEndpoint: '/models',
    keyFormat: {
      pattern: /^hf_[a-zA-Z0-9]{37}$/,
      placeholder: 'hf_...',
      example: 'hf_abcd1234...'
    },
    documentationUrl: 'https://huggingface.co/docs/api-inference'
  },
  {
    id: 'pinecone',
    name: 'Pinecone',
    icon: '🌲',
    description: 'Vector database for AI applications',
    authType: 'api-key',
    baseUrl: 'https://api.pinecone.io',
    testEndpoint: '/indexes',
    keyFormat: {
      pattern: /^[a-zA-Z0-9\-]{36,}$/,
      placeholder: 'Your API key',
      example: 'abcd-1234-efgh-5678...'
    },
    documentationUrl: 'https://docs.pinecone.io/reference'
  },
  {
    id: 'custom',
    name: 'Custom Provider',
    icon: '⚙️',
    description: 'Add any custom AI API endpoint',
    authType: 'bearer',
    baseUrl: '',
    testEndpoint: '',
    documentationUrl: ''
  }
];
