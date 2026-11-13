import {
  createConversationService,
  getConversationsService,
  getConversationByIdService,
  sendChatMessageService,
  deleteConversationService,
} from '../services/chat.service.js';
import { successResponse } from '../utils/response.js';

export const createConversation = async (req, res, next) => {
  try {
    const { title, language } = req.body;
    const result = await createConversationService(req.user.id, title, language, req.supabase);
    return successResponse(res, 'Conversation created successfully', result, 201);
  } catch (err) {
    next(err);
  }
};

export const getConversations = async (req, res, next) => {
  try {
    const result = await getConversationsService(req.user.id, req.supabase);
    return successResponse(res, 'Conversations retrieved successfully', result);
  } catch (err) {
    next(err);
  }
};

export const getConversationById = async (req, res, next) => {
  try {
    const result = await getConversationByIdService(req.params.id, req.user.id, req.supabase);
    return successResponse(res, 'Conversation retrieved successfully', result);
  } catch (err) {
    next(err);
  }
};

export const sendChatMessage = async (req, res, next) => {
  try {
    const { message, language } = req.body;
    const result = await sendChatMessageService(
      req.params.id,
      req.user.id,
      message,
      language,
      req.supabase
    );
    return successResponse(res, 'Message processed successfully', result, 201);
  } catch (err) {
    next(err);
  }
};

export const deleteConversation = async (req, res, next) => {
  try {
    await deleteConversationService(req.params.id, req.user.id, req.supabase);
    return successResponse(res, 'Conversation deleted successfully', null);
  } catch (err) {
    next(err);
  }
};

