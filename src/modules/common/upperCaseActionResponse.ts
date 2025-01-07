import { ControllerAction } from "../../interfaces/types";
import { capitalize, capitalizeResponse } from '../../utils/capitalizeStrings';

export const upperCaseResponse = (actions: ControllerAction[]) => {
  return actions.map(ac=>({
    ...ac, response: capitalizeResponse(ac.responses)
  }))
}