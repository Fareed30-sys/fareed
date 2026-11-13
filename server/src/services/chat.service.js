import { generateGeminiStructuredContent } from './gemini.service.js';
import { generateChatPrompt } from '../prompts/chat.prompt.js';
import { chatbotResponseSchema } from '../schemas/chat.schema.js';

export const createConversationService = async (userId, title, language, supabase) => {
  const { data, error } = await supabase
    .from('chat_conversations')
    .insert({
      user_id: userId,
      title: title || 'Agricultural Advice Discussion',
      language: language || 'en',
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create conversation: ${error.message}`);
  }

  return data;
};

export const getConversationsService = async (userId, supabase) => {
  const { data, error } = await supabase
    .from('chat_conversations')
    .select('*')
    .order('updated_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch conversations: ${error.message}`);
  }

  return data;
};

export const getConversationByIdService = async (conversationId, userId, supabase) => {
  const { data: conversation, error: convoError } = await supabase
    .from('chat_conversations')
    .select('*')
    .eq('id', conversationId)
    .single();

  if (convoError) {
    throw new Error(`Conversation not found: ${convoError.message}`);
  }

  const { data: messages, error: msgsError } = await supabase
    .from('chat_messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true });

  if (msgsError) {
    throw new Error(`Failed to fetch messages: ${msgsError.message}`);
  }

  return { conversation, messages };
};

export const sendChatMessageService = async (conversationId, userId, messageText, language, supabase) => {
  // 1. Verify conversation exists and fetch its details
  const { data: conversation, error: convoError } = await supabase
    .from('chat_conversations')
    .select('*')
    .eq('id', conversationId)
    .single();

  if (convoError || !conversation) {
    throw new Error('Conversation not found or access denied.');
  }

  const activeLanguage = language || conversation.language || 'en';

  // 2. Fetch past messages for conversational memory (last 10 messages)
  const { data: historyMessages } = await supabase
    .from('chat_messages')
    .select('role, content')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true })
    .limit(10);

  // 3. Fetch farmer profile context
  const { data: userProfile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  // 4. Record the user message
  const { error: userMsgError } = await supabase
    .from('chat_messages')
    .insert({
      conversation_id: conversationId,
      user_id: userId,
      role: 'user',
      content: messageText,
    });

  if (userMsgError) {
    throw new Error(`Failed to store farmer message: ${userMsgError.message}`);
  }

  // 5. Generate AI answer via Gemini
  const prompt = generateChatPrompt({
    message: messageText,
    history: historyMessages || [],
    userProfile: userProfile || {},
    language: activeLanguage,
  });

  const aiResult = await generateGeminiStructuredContent(
    prompt,
    chatbotResponseSchema
  );

  // 6. Record the assistant message
  const { data: assistantMsg, error: aiMsgError } = await supabase
    .from('chat_messages')
    .insert({
      conversation_id: conversationId,
      user_id: userId,
      role: 'assistant',
      content: aiResult.answer,
    })
    .select()
    .single();

  if (aiMsgError) {
    throw new Error(`Failed to store assistant response: ${aiMsgError.message}`);
  }

  // 7. Update conversation title if default and update timestamp
  const updatePayload = { updated_at: new Date().toISOString() };
  if (conversation.title === 'New Conversation' || conversation.title === 'Agricultural Advice Discussion') {
    updatePayload.title = messageText.slice(0, 40) + (messageText.length > 40 ? '...' : '');
  }

  await supabase
    .from('chat_conversations')
    .update(updatePayload)
    .eq('id', conversationId);

  return {
    message: assistantMsg,
    meta: {
      relatedTopics: aiResult.relatedTopics,
      warnings: aiResult.warnings,
      requiresExpertConsultation: aiResult.requiresExpertConsultation,
    },
  };
};

export const deleteConversationService = async (conversationId, userId, supabase) => {
  const { error } = await supabase
    .from('chat_conversations')
    .delete()
    .eq('id', conversationId);

  if (error) {
    throw new Error(`Failed to delete conversation: ${error.message}`);
  }

  return true;
};

