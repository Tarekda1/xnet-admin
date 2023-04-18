import { fetchWrapper } from "../helpers";
import constants from "../config/constants";

export interface Plan {
  speed: string;
  price: number;
  name: string;
  description: string;
  planId: string;
}

type Plans = [Plan];

const baseUrl = `${constants.API_URL}/billing/plans`;

export const billingService = {
  getAllPlans,
  getPlanById,
  updatePlan,
};

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

async function getPlanById(id): Promise<Plan> {
  try {
    const plan: Plan = (await fetchWrapper.get(`${baseUrl}/${id}`)) as Plan;
    return plan;
  } catch (error) {
    throw new Error(`Error inside getPlans: ${error}`);
  }
}

async function updatePlan(id: string, plan: Plan): Promise<Plan> {
  try {
    const resp = await fetchWrapper.put(`${baseUrl}/${id}`, plan);
    return resp;
  } catch (error) {
    throw new Error(`Error inside getPlans: ${error}`);
  }
}
