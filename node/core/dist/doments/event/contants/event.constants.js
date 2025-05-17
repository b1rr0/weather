"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventType = exports.ProcessStatus = void 0;
var ProcessStatus;
(function (ProcessStatus) {
    ProcessStatus["PENDING"] = "pending";
    ProcessStatus["PROCESSING"] = "processing";
    ProcessStatus["COMPLETED"] = "completed";
})(ProcessStatus || (exports.ProcessStatus = ProcessStatus = {}));
var EventType;
(function (EventType) {
    EventType["SUBSCRIPTION"] = "subscription";
})(EventType || (exports.EventType = EventType = {}));
//# sourceMappingURL=event.constants.js.map