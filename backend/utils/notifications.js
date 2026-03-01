// Central helper for all notification inserts.
// NEVER bypass this function with a direct INSERT INTO notifications query.

async function createNotification(client, {
    userId,
    type,
    message,
    contextId = null,
    metadata = {}
}) {
    const safeMessage = (message && typeof message === 'string' && message.trim())
        ? message.trim()
        : 'Notification';

    const safeType = (type && typeof type === 'string' && type.trim())
        ? type.trim().toUpperCase()
        : 'NOTIFICATION';

    console.log('[createNotification] payload:', {
        userId,
        type: safeType,
        message: safeMessage,
        contextId,
        metadata
    });

    await client.query(
        `INSERT INTO notifications 
         (user_id, type, message, context_id, metadata)
         VALUES ($1, $2, $3, $4, $5)`,
        [
            userId,
            safeType,
            safeMessage,
            contextId || null,
            JSON.stringify(metadata || {})
        ]
    );
}

module.exports = { createNotification };
