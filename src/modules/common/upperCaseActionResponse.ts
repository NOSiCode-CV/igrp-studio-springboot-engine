import { ControllerAction } from "../../interfaces/types";
import { capitalize } from "../../utils/capitalizeStrings";

export const upperCaseResponse = (actions: ControllerAction[]) => {
  return actions.map(ac=>({
    ...ac, response:capitalize(ac.response)
  }))
}