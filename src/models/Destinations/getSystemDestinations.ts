import { getPgClient } from '../../database/postgres';
import { DestinationResponse } from '../../graphql/destinations/typeDef';

export const getSystemDestinations = async (systemId: number): Promise<DestinationResponse[]> => {
  try {
    const pg = getPgClient();
    const res = await pg.query('SELECT * FROM destinations WHERE system_id = $1;', [systemId]);

    return res.rows as DestinationResponse[];
  } catch (error) {
    console.error('getSystemDestinations', error);
    throw new Error(`Error loading destinations for system #${systemId}`);
  }
};
