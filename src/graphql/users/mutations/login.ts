import { getAuthenticatedUserId } from '../../../models/Users';

export const loginMutation = (email: string, password: string) => getAuthenticatedUserId(email, password);
