create or replace table t.theta_sketch(sketch bytes);

insert into t.theta_sketch
(select t.theta_sketch_agg_string(cast(value as string), struct<int, int>(null, null)) from unnest(GENERATE_ARRAY(1, 10000, 1)) as value);
insert into t.theta_sketch
(select t.theta_sketch_agg_string(cast(value as string), struct<int, int>(null, null)) from unnest(GENERATE_ARRAY(100000, 110000, 1)) as value);

select t.theta_sketch_to_string(
  t.theta_sketch_agg_union(sketch, struct<int, int>(null, null)),
  null
) from t.theta_sketch;

drop table t.theta_sketch;

# expected 5
select t.theta_sketch_get_estimate(
  t.theta_sketch_scalar_union(
    (select t.theta_sketch_agg_string(str, struct<int, int>(null, null)) from unnest(["a", "b", "c"]) as str),
    (select t.theta_sketch_agg_string(str, STRUCT<int, int>(null, null)) from unnest(["c", "d", "e"]) as str),
    null,
    null
  ),
  null
);

# expected 1
select t.theta_sketch_get_estimate(
  t.theta_sketch_scalar_intersection(
    (select t.theta_sketch_agg_string(str, struct<int, int>(null, null)) from unnest(["a", "b", "c"]) as str),
    (select t.theta_sketch_agg_string(str, STRUCT<int, int>(null, null)) from unnest(["c", "d", "e"]) as str),
    null
  ),
  null
);

# expected 2
select t.theta_sketch_get_estimate(
  t.theta_sketch_a_not_b(
    (select t.theta_sketch_agg_string(str, struct<int, int>(null, null)) from unnest(["a", "b", "c"]) as str),
    (select t.theta_sketch_agg_string(str, STRUCT<int, int>(null, null)) from unnest(["c", "d", "e"]) as str),
    null
  ),
  null
);

# expected 0.2
select t.theta_sketch_jaccard_similarity(
  (select t.theta_sketch_agg_string(str, struct<int, int>(null, null)) from unnest(["a", "b", "c"]) as str),
  (select t.theta_sketch_agg_string(str, STRUCT<int, int>(null, null)) from unnest(["c", "d", "e"]) as str),
  null
);
