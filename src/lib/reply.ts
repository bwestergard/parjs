/**
 * @module parjs
 */
/** */
import {Trace} from "./internal";
import {ParjsParsingFailure} from "./errors";
import {BasicTraceVisualizer} from "./internal/implementation/basic-trace-visualizer";
import {LoudParser} from "./loud";


/**
 * Indicates a success reply and contains the value and other information.
 */
export class SuccessReply<T> {
    kind = ReplyKind.Ok;

    constructor(public value: T) {

    }

    toString() {
        return `SuccessReply: ${this.value}`;
    }

}

export interface ErrorLocation {
    row: number;
    column: number;
}

/**
 * An object indicating trace information about the state of parsing when it was stopped.
 */
export interface Trace {
    userState: object;
    position: number;
    reason: string;
    kind: ReplyKind.Fail;
    location: ErrorLocation;
    stackTrace: LoudParser<any>[];
    input: string;
}

export class FailureReply {
    reason: string;
    constructor(public trace: Trace) {
        this.reason = trace.reason;

    }

    get value(): never {
        throw new ParjsParsingFailure(this);
    }

    get kind() {
        return this.trace.kind;
    }

    toString() {
        return BasicTraceVisualizer()(this.trace);
    }
}


/**
 * A type that represents a SuccessReply or a FailureReply. Returned by parsers.
 */
export type Reply<T> = (SuccessReply<T> | FailureReply);


/**
 * A type representing the reply of a quiet parser.
 */
export type QuietReply = Reply<void>;

/**
 * Namespace that contains the different reply kinds/error levels.
 */
export namespace ReplyKind {
    /**
     * An Unknown reply. Used internally.
     */
    export type Unknown = "Unknown";
    /**
     * The OK reply type.
     */
    export type Ok = "OK";
    /**
     * The soft failure type.
     */
    export type SoftFail = "Soft";
    /**
     * The hard failure type.
     */
    export type HardFail = "Hard";
    /**
     * The fatal failure type.
     */
    export type FatalFail = "Fatal";

    /**
     * An Unknown reply.
     */
    export const Unknown: Unknown = "Unknown";
    /**
     * An OK reply.
     */
    export const Ok: Ok = "OK";
    /**
     * A soft failure reply.
     */
    export const SoftFail: SoftFail = "Soft";
    /**
     * A hard failure reply.
     */
    export const HardFail: HardFail = "Hard";
    /**
     * A fatal failure reply.
     */
    export const FatalFail: FatalFail = "Fatal";

    /**
     * Specifies any kind of failure.
     */
    export type Fail = HardFail | FatalFail | SoftFail;
}
/**
 * Specifies a reply kind, indicating success or failure, and the severity of the failure.
 */
export type ReplyKind = ReplyKind.Ok | ReplyKind.Fail | ReplyKind.Unknown;

