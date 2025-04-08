import { ControllerAction } from '../interfaces/types';

export function resolvePathVariables(action: ControllerAction): string {
  let pathVariable = '';
  if (action.path) {
    if (action.pathVariables) {
      action.pathVariables.forEach((path) => {
        pathVariable = pathVariable.concat(`=/{${path.name}}`);
      });
    }
  }
  return pathVariable;
}
