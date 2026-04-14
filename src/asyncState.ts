export type AsyncState<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; message: string };

export type AsyncAction<T> =
  | { type: "loadStart" }
  | { type: "loadSuccess"; data: T }
  | { type: "loadError"; message: string }
  | { type: "reset" };

export function assertNever(x: never): never {
  throw new Error("Unexpected case:", x);
}

export function asyncReducer<T>(
  _state: AsyncState<T>,
  action: AsyncAction<T>,
): AsyncState<T> {
  switch (action.type) {
    case "loadStart":
      return { status: "loading" };
    case "loadSuccess":
      return { status: "success", data: action.data };
    case "loadError":
      return { status: "error", message: action.message };
    case "reset":
      return { status: "idle" };
    default:
      return assertNever(action as never);
  }
}
