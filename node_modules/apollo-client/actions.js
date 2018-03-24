export function isQueryResultAction(action) {
    return action.type === 'APOLLO_QUERY_RESULT';
}
export function isQueryErrorAction(action) {
    return action.type === 'APOLLO_QUERY_ERROR';
}
export function isQueryInitAction(action) {
    return action.type === 'APOLLO_QUERY_INIT';
}
export function isQueryResultClientAction(action) {
    return action.type === 'APOLLO_QUERY_RESULT_CLIENT';
}
export function isQueryStopAction(action) {
    return action.type === 'APOLLO_QUERY_STOP';
}
export function isMutationInitAction(action) {
    return action.type === 'APOLLO_MUTATION_INIT';
}
export function isMutationResultAction(action) {
    return action.type === 'APOLLO_MUTATION_RESULT';
}
export function isMutationErrorAction(action) {
    return action.type === 'APOLLO_MUTATION_ERROR';
}
export function isUpdateQueryResultAction(action) {
    return action.type === 'APOLLO_UPDATE_QUERY_RESULT';
}
export function isStoreResetAction(action) {
    return action.type === 'APOLLO_STORE_RESET';
}
export function isSubscriptionResultAction(action) {
    return action.type === 'APOLLO_SUBSCRIPTION_RESULT';
}
export function isWriteAction(action) {
    return action.type === 'APOLLO_WRITE';
}
//# sourceMappingURL=actions.js.map