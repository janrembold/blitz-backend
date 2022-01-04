-- https://docs.pgrouting.org/3.1/en/sampledata.html

CREATE TABLE edge_table (
    id BIGSERIAL,
    dir character varying,
    source BIGINT,
    target BIGINT,
    cost FLOAT,
    reverse_cost FLOAT,
    capacity BIGINT,
    reverse_capacity BIGINT,
    category_id INTEGER,
    reverse_category_id INTEGER,
    x1 FLOAT,
    y1 FLOAT,
    x2 FLOAT,
    y2 FLOAT,
    the_geom geometry
);


INSERT INTO edge_table (source, target, category_id, reverse_category_id, cost, reverse_cost, x1, y1, x2, y2, dir) VALUES
(1, 2, 1, 1, 4105, 4105, 0, 0, 34, -23, 'B'),
(3, 1, 1, 1, 5636, 5636, -26, -50, 0, 0, 'B'),
(4, 1, 1, 1, 8713, 8713, -86, 14, 0, 0, 'B'),
(5, 1, 1, 1, 9338, 9338, 16, 92, 0, 0, 'B'),
(1, 6, 1, 1, 9651, 9651, 0, 0, 95, 17, 'B'),
(11, 10, 1, 1, 3635, 3635, 39, 40, 75, 45, 'B'),
(10, 6, 1, 1, 3441, 3441, 75, 45, 95, 17, 'B'),
(2, 8, 1, 1, 8538, 8538, 34, -23, 117, -43, 'B'),
(2, 9, 1, 1, 5304, 5304, 34, -23, 72, -60, 'B'),
(2, 7, 1, 1, 6306, 6306, 34, -23, 50, -84, 'B'),
(9, 7, 1, 1, 3256, 3256, 72, -60, 50, -84, 'B'),
(4, 5, 1, 1, 12841, 12841, -86, 14, 16, 92, 'B');

UPDATE edge_table SET the_geom = st_makeline(st_point(x1,y1),st_point(x2,y2));
SELECT pgr_createTopology('edge_table',0.001);
-- SELECT pgr_nodeNetwork('edge_table', 0.001);