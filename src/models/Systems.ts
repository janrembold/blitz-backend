export const getSystemById = (systemId: number) =>
  //   const pg = getPgClient();

  //   try {
  //     const res = await pg.query(
  //       `
  //           SELECT *
  //           FROM systems
  //           WHERE id = ?;`,
  //       [systemId],
  //     );

  //     return res.rows;
  //   } catch (error) {
  //     console.error('Systems getSystemById', error);
  //   }

  ({ id: systemId, max_mobship_count: 20 });
