import { fetchWrapper } from "../helpers";
import constants from "../config/constants";

export interface Plan {
  speed: string;
  price: number;
  name: string;
  description: string;
}

type Plans = [Plan];

const baseUrl = `${constants.API_URL}/billing/plans/all`;

async function getAllPlans(offset = 0): Promise<Plans> {
  try {
    const plans: Plans = (await fetchWrapper.get(
      `${baseUrl}/all?offset=${offset}`
    )) as Plans;
    return plans;
  } catch (error) {
    throw new Error(`Error inside getPlans: ${error}`);
  }
}

export { getAllPlans };
