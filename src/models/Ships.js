import { getPgClient } from '../database/postgres';

export function Ships() {
  const pg = getPgClient();

  return {
    getAllShipsInSystem: async (systemId) => {
      try {
        const res = await pg.query(`
          SELECT sp.id, s.name, sp.x, sp.y
          FROM ship_positions sp
          LEFT JOIN ships s ON sp.ship_id = s.id;`);

        return res.rows;
      } catch (error) {
        console.error('Ships getAllShipsInSystem', error);
      }

      return [];
    },

    updateTargetPosition: (systemId, shipId, targetX, targetY) => {},
  };
}
