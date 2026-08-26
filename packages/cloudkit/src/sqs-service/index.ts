export { createSQSClient } from './client.js'
export { sendMessage } from './sendMessage.js'
export { receiveMessage } from './receiveMessage.js'
export { sendMessageBatch } from './sendMessageBatch.js'
export { deleteMessage } from './deleteMessage.js'
export { deleteMessageBatch } from './deleteMessageBatch.js'
export { changeMessageVisibility } from './changeMessageVisibility.js'
export { changeMessageVisibilityBatch } from './changeMessageVisibilityBatch.js'


// QUEUES
// ────────────────────────
// CreateQueue
// DeleteQueue
// GetQueueUrl
// GetQueueAttributes
// SetQueueAttributes
// ListQueues
// PurgeQueue

// DLQ
// ────────────────────────
// ListDeadLetterSourceQueues