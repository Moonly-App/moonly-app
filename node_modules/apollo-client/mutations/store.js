var MutationStore = (function () {
    function MutationStore() {
        this.store = {};
    }
    MutationStore.prototype.getStore = function () {
        return this.store;
    };
    MutationStore.prototype.get = function (mutationId) {
        return this.store[mutationId];
    };
    MutationStore.prototype.initMutation = function (mutationId, mutationString, variables) {
        this.store[mutationId] = {
            mutationString: mutationString,
            variables: variables || {},
            loading: true,
            error: null,
        };
    };
    MutationStore.prototype.markMutationError = function (mutationId, error) {
        this.store[mutationId].loading = false;
        this.store[mutationId].error = error;
    };
    MutationStore.prototype.markMutationResult = function (mutationId) {
        this.store[mutationId].loading = false;
        this.store[mutationId].error = null;
    };
    MutationStore.prototype.reset = function () {
        this.store = {};
    };
    return MutationStore;
}());
export { MutationStore };
//# sourceMappingURL=store.js.map