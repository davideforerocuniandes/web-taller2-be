declare const TaskStatus: {
    readonly PENDING: "pending";
    readonly IN_PROGRESS: "in-progress";
    readonly DONE: "done";
};
type TaskStatus = (typeof TaskStatus)[keyof typeof TaskStatus];
export declare class UpdateTaskDto {
    title?: string;
    description?: string;
    status?: TaskStatus;
}
export {};
